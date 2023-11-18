import { FormatEnum } from "sharp";
import branding from "../branding.json"
import { compileFile } from "pug"
import fs from "fs/promises";
import { options } from "./options";
import { parseTags } from "./utils";
import sharp from "sharp";
await fs.rm("./dist", {
    recursive: true
})

await fs.mkdir("./dist");



await fs.mkdir(".cache/images", {
    recursive: true
});

const text = await fs.readFile("./data.json", {
    encoding: "utf8"
}).catch(() => ("[]"))

interface Image {
    added: number,
    name: string,
    tags: string,
    originalName: string
    idx: number
}

const data: Image[] = JSON.parse(text);


const files = await fs.readdir("./images");

let count = data.length;

function extname(file: string) {
    return file.split(".").pop() ?? "";
}


async function applySharp(filePath: string,): Promise<string> {
    console.log("Running sharp on ", filePath)
    const extName: string = extname(filePath).toLowerCase();
    if (extName == "gif") {
        const p = `.cache/${filePath}`;
        await sharp(filePath, { animated: extName === 'gif' })
            .toFormat(extName as keyof FormatEnum, options[extName as keyof typeof options])
            .toFile(p);
        return p
    }
    else {
        const p = `.cache/${filePath.replace(`.${extName}`, `.${branding.format}`)}`;
        await sharp(filePath, { animated: false })
            .toFormat(branding.format as keyof FormatEnum, options[branding.format as keyof typeof options])
            .toFile(p);
        return p;
    }
};


for (const file of files) {
    if (data.find(d => d.originalName === file)) {
        continue;
    }

    data.push({
        added: Date.now(),
        name: (await applySharp(`images/${file}`)).split("/").pop()!,
        originalName: file,
        tags: "",
        idx: count++
    })
}

await fs.cp(".cache/images", "./dist/images", {
    recursive: true
})

for (const d of data) {
    if (!await fs.exists(`./images/${d.originalName}`)) {
        console.warn(`${d.name} not found but still in data.json`)
        const yes = prompt("Remove and reorder list? Y/N");
        if (yes != "N") {
            const idx = data.findIndex(x => x.name === d.name);
            data.splice(idx, 1);
            for (let i = idx; i < data.length; i++) {
                data[i].idx--;
            }
        }
    }
    if (!await fs.exists(`.cache/images/${d.name}`)) {
        await applySharp(`images/${d.originalName}`);
    }
}

await fs.writeFile("./data.json", JSON.stringify(data, undefined, 2), {
    encoding: "utf8"
})

function generatePugData() {
    const tags = new Set(
        data.flatMap((x) => parseTags(x.tags))
    )

    const base = "/api"
    const random = `/image`
    const fromName = `/image/:name`
    const tagsUrl = `/tags`

    return {
        tags: [...tags],
        endPoints: {
            base,
            random,
            fromName,
            tags: tagsUrl
        },
        branding,
        count: data.length,
    }
}

const ui = compileFile("src/ui/ui.pug")(generatePugData())

await fs.writeFile("dist/index.html", ui, {
    encoding: "utf8"
})

await fs.writeFile("dist/404.html", compileFile("src/ui/404.pug")(generatePugData()), {
    encoding: "utf8"
})

Bun.build({
    entrypoints: ["src/api/image.ts", "src/api/tags.ts"],
    outdir: "functions/api/",
    minify: true,
    format: "esm",
})