import data from "./data.json"
import { parseTags } from "./utils"

export async function onRequest({ request, env }) {
    const search = new URL(request.url).searchParams
    const tags = search.get("tags")
    const count = parseInt(search.get("count") ?? "-");

    if (isNaN(count)) {
        const image = getImage(tags?.split("+") ?? [])
        return new Response(undefined, {
            status: 302,
            headers: {
                Location: `/images/${image?.name}`
            }
        })
    } else {
        if (count > 5) {
            return new Response("Too many", {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
        let res = new Array(count).fill(0).map(() => getImage(tags?.split("+") ?? []));
        return new Response(JSON.stringify([...new Set(res.map(x => x?.name))]), {
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
        const parsedTags = parseTags(x.tags)
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