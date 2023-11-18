import { getDataForTags } from "../data" assert { type: "macro" }


export async function onRequest() {
    return new Response(getDataForTags(), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}