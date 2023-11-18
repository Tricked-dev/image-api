import data from "../data.json"
import { parseTags } from "./utils";

export function getDataForImage() {
    return data.map(x => [
        x.name,
        x.tags
    ] as const)
}

export function getDataForTags() {
    return JSON.stringify([...new Set(data.flatMap(x => parseTags(x.tags)))]);
}