# Pic Compressor

Pic Compressor is a free, browser-based tool for compressing and converting images. Process images on your device, adjust the output to fit your needs, and download the results without creating an account.

## Features

- Batch process JPG, PNG, WebP, and GIF images.
- Choose WebP, JPG, PNG, or the original format for output.
- Adjust image dimensions and compression quality.
- Use presets for web optimization, high quality, or smaller file sizes.
- Download processed images individually or together.
- Keep image processing in the browser. Compression does not upload images to a server.
- Save your settings and language preference in browser storage.
- Leave feedback through GitHub Discussions using Giscus.

## Getting Started

You will need Node.js and npm installed.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server. |
| `npm run lint` | Run ESLint. |

## Tech Stack

- [Next.js](https://nextjs.org/) and React
- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) for client-side image compression
- [JSZip](https://stuk.github.io/jszip/) for downloading multiple results together
- [Giscus](https://giscus.app/) for discussions and feedback
