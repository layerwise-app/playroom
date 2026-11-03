import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addImages, fileName, keyName } from './add-images.mjs';

let dir: string;
const quiet = () => {};

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'add-images-'));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

async function png(name: string, width: number, height: number) {
  const file = path.join(dir, name);
  await sharp({ create: { width, height, channels: 3, background: '#e8552f' } }).png().toFile(file);
  return file;
}

describe('add-images', () => {
  it('names files and keys predictably', () => {
    expect(fileName('/x/Review Panel@2x.png')).toBe('review-panel');
    expect(fileName('donorMobile.png')).toBe('donor-mobile');
    expect(keyName('review-panel')).toBe('reviewPanel');
  });

  it('writes 800, 1600, and 2880 px WebP files, sizes, and a blur preview', async () => {
    const folder = path.join(dir, 'project');
    await addImages({ folder, files: [await png('Review Panel.png', 3000, 1875)], log: quiet });
    const files = (await readdir(path.join(folder, 'images'))).sort();
    expect(files).toEqual(['manifest.json', 'review-panel-1600.webp', 'review-panel-2880.webp', 'review-panel-800.webp']);
    for (const width of [800, 1600, 2880]) {
      const meta = await sharp(path.join(folder, 'images', `review-panel-${width}.webp`)).metadata();
      expect(meta.format).toBe('webp');
      expect(meta.width).toBe(width);
    }
    const manifest = JSON.parse(await readFile(path.join(folder, 'images', 'manifest.json'), 'utf8'));
    expect(manifest.reviewPanel).toMatchObject({ width: 2880, height: 1800 });
    expect(manifest.reviewPanel.blur).toMatch(/^data:image\/webp;base64,/);
    const module = await readFile(path.join(folder, 'images.ts'), 'utf8');
    expect(module).toContain("import reviewPanel2880 from './images/review-panel-2880.webp';");
    expect(module).toContain('reviewPanel: {');
  });

  it('never upscales a small image', async () => {
    const folder = path.join(dir, 'project');
    await addImages({ folder, files: [await png('small.png', 1200, 800)], log: quiet });
    const files = (await readdir(path.join(folder, 'images'))).filter((f) => f.endsWith('.webp'));
    expect(files.sort()).toEqual(['small-800.webp']);
  });

  it('adds a 1200 × 630 share image for the cover', async () => {
    const folder = path.join(dir, 'project');
    await addImages({ folder, files: [await png('cover.png', 2880, 1512)], log: quiet });
    const meta = await sharp(path.join(folder, 'images', 'cover-og.jpg')).metadata();
    expect([meta.format, meta.width, meta.height]).toEqual(['jpeg', 1200, 630]);
    expect(await readFile(path.join(folder, 'images.ts'), 'utf8')).toContain('og: coverOg');
  });

  it('copies GIFs untouched', async () => {
    const folder = path.join(dir, 'project');
    const gif = path.join(dir, 'loop.gif');
    await sharp({ create: { width: 64, height: 48, channels: 3, background: '#2448d8' } }).gif().toFile(gif);
    await addImages({ folder, files: [gif], log: quiet });
    const original = await readFile(gif);
    const copied = await readFile(path.join(folder, 'images', 'loop.gif'));
    expect(copied.equals(original)).toBe(true);
    const manifest = JSON.parse(await readFile(path.join(folder, 'images', 'manifest.json'), 'utf8'));
    expect(manifest.loop).toMatchObject({ width: 64, height: 48, animated: true });
  });

  it('rejects SVG before writing anything', async () => {
    const folder = path.join(dir, 'project');
    const svg = path.join(dir, 'logo.svg');
    await writeFile(svg, '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>');
    await expect(addImages({ folder, files: [await png('ok.png', 900, 600), svg], log: quiet })).rejects.toThrow(/SVG/);
    await expect(readdir(path.join(folder, 'images'))).rejects.toThrow();
  });

  it('keeps earlier images when adding more, and replaces one with the same name', async () => {
    const folder = path.join(dir, 'project');
    await addImages({ folder, files: [await png('a.png', 2000, 1000), await png('b.png', 900, 900)], log: quiet });
    await addImages({ folder, files: [await png('a.png', 900, 450)], log: quiet });
    const files = (await readdir(path.join(folder, 'images'))).filter((f) => f.endsWith('.webp')).sort();
    expect(files).toEqual(['a-800.webp', 'b-800.webp']);
    const manifest = JSON.parse(await readFile(path.join(folder, 'images', 'manifest.json'), 'utf8'));
    expect(Object.keys(manifest).sort()).toEqual(['a', 'b']);
  });
});
