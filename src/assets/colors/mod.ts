// Run: deno run --allow-read --allow-net --allow-write mod.ts

import { Image } from 'https://deno.land/x/imagescript/mod.ts';

const numberOfAssetsPerPage = 250; // Max 250
const numberOfPages = 4;

const pathCryptoColors = './crypto.json';

const cryptoColors = JSON.parse(Deno.readTextFileSync(pathCryptoColors));

for (
  const page of new Array(numberOfPages).fill(0).map((_, index) => index + 1)
) {
  try {
    const result = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${numberOfAssetsPerPage}&page=${page}&sparkline=false`,
    );

    const assets = await result.json();

    await Promise.all(assets.map(async (asset: any) => {
      const arrayBuffer = await (await fetch(asset.image)).arrayBuffer();

      const bytes = new Uint8Array(arrayBuffer);

      if (bytes) {
        const image = await Image.decode(bytes);

        const colorToRGB = (color: number) => {
          const [r, g, b, a] = Image.colorToRGBA(color);
          return {
            r,
            g,
            b,
            a,
          };
        };

        const color = colorToRGB(image.dominantColor());

        cryptoColors[asset.id] = color;
      }
    }));
  } catch (error) {
    console.log(page, error);
  }
}

Deno.writeTextFileSync(
  pathCryptoColors,
  JSON.stringify(cryptoColors, null, 2),
);
