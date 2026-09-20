import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdir, writeFile } from "node:fs/promises";

const SOURCE = "assets/logo-source.png";
const BACKGROUND = "#ffffff";

// Remove the empty white border around the logo
const trimmed = await sharp(SOURCE).trim({ threshold: 25 }).png().toBuffer();

// Square white tile with the logo centred inside
async function tile(size, pad) {
  const inner = Math.round(size * (1 - pad * 2));
  const logo = await sharp(trimmed)
    .resize({ width: inner, height: inner, fit: "inside" })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
}

await mkdir("public/images/brand", { recursive: true });

// favicon.ico (16, 32, 48)
const ico = await pngToIco([
  await tile(16, 0.08),
  await tile(32, 0.1),
  await tile(48, 0.1),
]);
await writeFile("src/app/favicon.ico", ico);

// Browser tab icon (192 = multiple of 48, as Google recommends)
await writeFile("src/app/icon.png", await tile(192, 0.12));

// iPhone home screen icon
await writeFile("src/app/apple-icon.png", await tile(180, 0.14));

// Logo for Google (structured data) and the web manifest
await writeFile("public/logo.png", await tile(512, 0.14));

// Logo used by Navbar, Footer, Admin and the share image
await writeFile("public/images/brand/logo-tile.png", await tile(256, 0.14));

console.log("Done: favicon.ico, icon.png, apple-icon.png, logo.png, logo-tile.png");