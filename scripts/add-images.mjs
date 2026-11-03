#!/usr/bin/env node
// Adds images to a content folder, ready for the site to show.
//
//   pnpm add-images <folder> <image> [more images…]
//   pnpm add-images src/content/work/openhand ~/Desktop/screens/*.png
//
// For each image it writes WebP versions 800, 1600, and 2880 px wide (never
// wider than the original) to <folder>/images/, measures it, and makes a tiny
// blurred preview. GIFs are copied untouched. An image named `cover` also gets
// a 1200 × 630 JPG for link previews. SVGs are rejected: export a PNG instead.
//
// Then it rewrites <folder>/images.ts, so a case study can use
// `images.reviewPanel` for `review-panel.png`. Adding an image with the same
// name replaces it.

import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const WIDTHS = [800, 1600, 2880];
export const OG_SIZE = { width: 1200, height: 630 };
const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tif', '.tiff']);

/** `Review Panel@2x.png` → `review-panel` */
export function fileName(file) {
  return path
    .basename(file, path.extname(file))
    .replace(/@\dx$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** `review-panel` → `reviewPanel` */
export function keyName(name) {
  const key = name.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
  return /^[0-9]/.test(key) ? `image${key}` : key;
}

async function blurPreview(input) {
  const buffer = await sharp(input, { pages: 1 })
    .resize({ width: 24 })
    .blur(0.6)
    .webp({ quality: 45 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString('base64')}`;
}

/**
 * Processes `files` into `<folder>/images/` and rewrites `<folder>/images.ts`.
 * Returns the manifest entries it wrote.
 */
export async function addImages({ folder, files, log = console.log }) {
  if (!folder || !files?.length) {
    throw new Error('Usage: pnpm add-images <folder> <image> [more images…]');
  }
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.svg') {
      throw new Error(`${file}: SVG isn't supported. Export it as a PNG (2x) and add that instead.`);
    }
    if (ext !== '.gif' && !RASTER.has(ext)) {
      throw new Error(`${file}: unsupported file type "${ext}". Use PNG, JPG, WebP, AVIF, TIFF, or GIF.`);
    }
  }

  const outDir = path.join(folder, 'images');
  await mkdir(outDir, { recursive: true });
  const manifestPath = path.join(outDir, 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8').catch(() => '{}'));
  const written = [];

  for (const file of files) {
    const name = fileName(file);
    if (!name) throw new Error(`${file}: can't make a file name from this.`);
    const key = keyName(name);
    const ext = path.extname(file).toLowerCase();
    const meta = await sharp(file, { pages: 1 }).metadata();
    const sourceWidth = meta.autoOrient?.width ?? meta.width;
    const sourceHeight = meta.autoOrient?.height ?? meta.pageHeight ?? meta.height;
    if (!sourceWidth || !sourceHeight) throw new Error(`${file}: couldn't read its size.`);

    // Remove files from an earlier version of this image.
    for (const existing of await readdir(outDir)) {
      if (existing === `${name}.gif` || existing.startsWith(`${name}-`) && /^-(\d+|og)\.(webp|jpg)$/.test(existing.slice(name.length))) {
        await rm(path.join(outDir, existing));
      }
    }

    const entry = { name, width: sourceWidth, height: sourceHeight, blur: await blurPreview(file) };

    if (ext === '.gif') {
      await copyFile(file, path.join(outDir, `${name}.gif`));
      entry.files = [{ file: `${name}.gif`, width: sourceWidth }];
      entry.animated = true;
    } else {
      const widths = WIDTHS.filter((width) => width <= sourceWidth);
      if (!widths.length) widths.push(sourceWidth);
      entry.files = [];
      for (const width of widths) {
        const out = `${name}-${width}.webp`;
        await sharp(file).rotate().resize({ width }).webp({ quality: 82, effort: 5 }).toFile(path.join(outDir, out));
        entry.files.push({ file: out, width });
      }
      const largest = widths[widths.length - 1];
      entry.width = largest;
      entry.height = Math.round((sourceHeight / sourceWidth) * largest);
    }

    if (name === 'cover') {
      const og = `${name}-og.jpg`;
      await sharp(file, { pages: 1 })
        .rotate()
        .resize({ ...OG_SIZE, fit: 'cover', position: 'centre' })
        .jpeg({ quality: 84, mozjpeg: true })
        .toFile(path.join(outDir, og));
      entry.og = og;
    }

    manifest[key] = entry;
    written.push({ key, ...entry });
    log(`  ${key}: ${entry.files.map((f) => f.file).join(', ')}${entry.og ? `, ${entry.og}` : ''}`);
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);
  await writeFile(path.join(folder, 'images.ts'), imagesModule(sorted));
  log(`Updated ${path.join(folder, 'images.ts')}`);
  return written;
}

/** The TypeScript module that imports every image in the manifest. */
export function imagesModule(manifest) {
  const imports = [];
  const entries = [];
  for (const [key, entry] of Object.entries(manifest)) {
    const sources = entry.files.map((source) => {
      const id = `${key}${entry.animated ? 'Gif' : source.width}`;
      imports.push(`import ${id} from './images/${source.file}';`);
      return `{ src: ${id}, width: ${source.width} }`;
    });
    const lines = [
      `    sources: [${sources.join(', ')}]`,
      `    width: ${entry.width}`,
      `    height: ${entry.height}`,
      `    blur: '${entry.blur}'`
    ];
    if (entry.animated) lines.push(`    animated: true`);
    if (entry.og) {
      imports.push(`import ${key}Og from './images/${entry.og}';`);
      lines.push(`    og: ${key}Og`);
    }
    entries.push(`  ${key}: {\n${lines.join(',\n')}\n  }`);
  }
  return [
    '// Generated by `pnpm add-images`. Don’t edit by hand: run it again to add or replace an image.',
    "import type { ImageAsset } from '~/content/types';",
    ...imports,
    '',
    `export const images = {\n${entries.join(',\n')}\n} satisfies Record<string, ImageAsset>;`,
    ''
  ].join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [folder, ...files] = process.argv.slice(2);
  addImages({ folder, files }).catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
