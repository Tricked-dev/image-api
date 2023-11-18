import { compileFile } from "pug"
import fs from "fs/promises";
await fs.rm("./dist", {
    recursive: true
})

await fs.mkdir("./dist");

await fs.cp("./images", "./dist/images", {
    recursive: true
})

const text = await fs.readFile("./data.json", {
    encoding: "utf8"
}).catch(() => ("[]"))

interface Image {
    added: number,
    name: string,
    tags: string,
    idx: number
}

const data: Image[] = JSON.parse(text);


const files = await fs.readdir("./images");

let count = data.length;

for (const file of files) {
    if (data.find(d => d.name === file)) {
        continue;
    }

    data.push({
        added: Date.now(),
        name: file,
        tags: "",
        idx: count++
    })
}

for (const d of data) {
    if (!await fs.exists(`./images/${d.name}`)) {
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
}

await fs.writeFile("./data.json", JSON.stringify(data, undefined, 2), {
    encoding: "utf8"
})

function generatePugData() {
    const tags = new Set(
        data.flatMap(x => x.tags.split(/,| /g).filter(x => x))
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
        count: data.length,
    }
}

const ui = compileFile("ui.pug", {
    pretty: true,
})(generatePugData())

await fs.writeFile("dist/index.html", ui, {
    encoding: "utf8"
})