export function parseTags(tags: string) {
    return tags.split(/,| /g).filter(x => x)
}