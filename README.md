# Image API

Create a api for images with [Cloudflare pages](https://pages.cloudflare.com) and [Bun](https://bun.sh/).

## Getting started

You will need Bun installed and a Cloudflare account.

1. Create a repo with this as a template and clone it locally
1. Edit branding.json to add a description, title and possible change the format used png is used by default and gifs will stay gifs (png,webp,jpg) are all accepted formats
1. Drop images into the images folder
1. (optional) Run `bun run src/build.ts` this will create a `data.json` file in which you can tag images and change the output name.
1. Go to Cloudflare to the [pages tab](https://dash.cloudflare.com/?to=/:account/workers-and-pages) click create new application
1. Click on Pages -> Connect to git
1. Select the created repo
1. As command set `bun run build`
1. Output folder is `./dist`
1. And you're done!
