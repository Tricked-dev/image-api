export const options = {
    png: {
        // https://sharp.pixelplumbing.com/api-output#png
        quality: 100,
    },
    jpeg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 100,
    },
    jpg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 100,
    },
    tiff: {
        // https://sharp.pixelplumbing.com/api-output#tiff
        quality: 100,
    },
    // gif does not support lossless compression
    // https://sharp.pixelplumbing.com/api-output#gif
    gif: {},
    webp: {
        // https://sharp.pixelplumbing.com/api-output#webp
        lossless: true,
    },
    avif: {
        // https://sharp.pixelplumbing.com/api-output#avif
        lossless: true,
    },
}