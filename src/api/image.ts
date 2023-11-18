import { limit } from "../../branding.json"
import { getDataForImage } from "../data" assert { type: "macro" }
import { parseTags } from "../utils"

// makes it so bun doesn't inline it twice
const data = [...getDataForImage()]

export async function onRequest({ request }: { request: Request }) {
    const search = new URL(request.url).searchParams
    const tags = search.get("tags")
    const count = parseInt(search.get("count") ?? "-");

    if (isNaN(count)) {
        const image = getImage(tags?.split("+") ?? [])
        return new Response(undefined, {
            status: 302,
            headers: {
                Location: `/images/${image![0]}`
            }
        })
    } else {
        if (count > limit) {
            return new Response("Too many", {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
        let res = new Array(count).fill(0).map(() => getImage(tags?.split("+") ?? []));
        return new Response(JSON.stringify([...new Set(res.map(x => x![0]))]), {
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function getImage(tags: string[]) {
    if (tags.length === 0) {
        return getRandomElement(data)
    }
    const correctArray = data.filter(x => {
        const parsedTags = parseTags(x[1])
        for (const tag of tags) {
            if (!parsedTags.includes(tag)) {
                return false
            }
        }
        return true
    })
    if (correctArray.length === 0) {
        return
    }
    return getRandomElement(correctArray)
}

function getRandomElement<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array[0];
}