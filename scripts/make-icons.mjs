#!/usr/bin/env node
// Makes every favicon and app icon from public/logo.svg.
//
//   pnpm icons
//
// Writes public/logo.png (1024 × 1024), favicon.svg, favicon.ico (16, 32, and
// 48 px), favicon-16x16.png, favicon-32x32.png, favicon.png (32 px),
// apple-touch-icon.png (180 px, filled to the edges because iOS rounds its own
// corners), android-chrome-192x192.png, and android-chrome-512x512.png.
//
// Small icons look sharpest when the logo's lines sit on whole pixels at 16
// and 32 px: on a 1024 canvas, put edges on multiples of 64.

import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicFile = (name) => path.join(root, 'public', name);

const svg = await readFile(publicFile('logo.svg'));
const { width: base = 1024 } = await sharp(svg).metadata();

/** Renders the logo at four times the size and scales it down, for smooth edges. */
function render(size) {
  return sharp(svg, { density: (72 * size * 4) / base }).resize(size, size).png();
}

/** An .ico file holding PNG images, which every current browser reads. */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + 16 * index;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

/** The logo's background, read from the middle of its top edge. */
async function backgroundColor() {
  const { data } = await render(64).raw().toBuffer({ resolveWithObject: true });
  const at = (2 * 64 + 32) * 4;
  return data[at + 3] === 255 ? { r: data[at], g: data[at + 1], b: data[at + 2] } : '#ffffff';
}

const pngs = {
  'logo.png': 1024,
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'favicon.png': 32,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512
};
for (const [name, size] of Object.entries(pngs)) {
  await render(size).toFile(publicFile(name));
}

await render(180).flatten({ background: await backgroundColor() }).toFile(publicFile('apple-touch-icon.png'));

const icoImages = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, data: await render(size).toBuffer() }))
);
await writeFile(publicFile('favicon.ico'), ico(icoImages));

await copyFile(publicFile('logo.svg'), publicFile('favicon.svg'));

console.log(`Made ${Object.keys(pngs).length + 3} icons from public/logo.svg.`);
