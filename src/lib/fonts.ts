import type { FontFamily, FontFile } from '~/portfolio.config';

/** Latin, Latin-1, Latin Extended-A, and common punctuation: what the font files hold. */
const UNICODE_RANGE =
  'U+0000-017F, U+2013-2014, U+2018-201E, U+2022, U+2026, U+2032-2033, U+2039-203A, U+20AC, U+2122, U+2190-2193, U+2197-2198, U+2212, U+2248, U+2264-2265';

/**
 * `@font-face` rules for a set of families.
 *
 * Every font uses `font-display: optional` and the files the first screen needs
 * are preloaded, so text renders immediately and never jumps when a font
 * arrives late: a slow first visit keeps the fallback for that page view.
 */
export function fontFaceCss(families: FontFamily[]): string {
  return families
    .flatMap((family) =>
      family.files.map(
        (file) =>
          `@font-face{font-family:${JSON.stringify(family.family)};src:url(${JSON.stringify(file.src)}) format("woff2");font-weight:${file.weight};font-style:${file.style};font-display:optional;unicode-range:${UNICODE_RANGE};}`
      )
    )
    .join('\n');
}

/** CSS `font-family` value for a family, with its fallback stack. */
export function fontStack(family: FontFamily): string {
  return `${JSON.stringify(family.family)}, ${family.fallback}`;
}

/** `<link rel="preload">` tags for font files. */
export function fontPreloads(files: FontFile[]) {
  return files.map((file) => ({
    rel: 'preload',
    href: file.src,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous' as const
  }));
}
