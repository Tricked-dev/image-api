# Image API

Create a api for images with [Cloudflare pages](https://pages.cloudflare.com) and [Bun](https://bun.sh/).

Live demo <https://borzoi-1am.pages.dev/>

## Getting started

You will need Bun installed and a Cloudflare account.

1. Create a repo with this as a template and clone it locally
1. Edit branding.json to add a description, title and possible change the format used png is used by default and gifs will stay gifs (png,webp,jpg) are all accepted formats
1. Delete data.json and empty the images folder
1. Drop images into the images folder
1. (optional) Run `bun run src/build.ts` this will create a `data.json` file in which you can tag images and change the output name.
1. Go to Cloudflare to the [pages tab](https://dash.cloudflare.com/?to=/:account/workers-and-pages) click create new application
1. Click on Pages -> Connect to git
1. Select the created repo
1. As command set `bun run build`
1. Output folder is `./dist`
1. And you're done!

## Debugging

### Something went wrong installing the "sharp" module

I tried making a permanent fix but it didn't work so for now you can fix it by removing the node_modules and bun.lockb folders at the same time

`rm -rf bun.lockb node_modules`

And doing `bun i` again

## Customizing

You can customize the look and stuff by editing the pug templates inside `src/ui`

## Contributing

Feel free to add new borzoi's for this kind of demo but also borzoi api!

Any pull requests are welcome! even if its as small as fixing typos or as big as redesign!

## License

MIT
