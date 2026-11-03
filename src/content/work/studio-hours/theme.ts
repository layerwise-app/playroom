import type { FontFamily } from '~/portfolio.config';

// Studio Hours' own palette and type: two risograph inks on newsprint.
// The card panel uses `color`.
export const color = '#FF48B0';
export const ink = '#1B1B3A';
export const palette = {
  pink: '#FF48B0',
  blue: '#0078BF',
  paper: '#F7F3EA',
  newsprint: '#EFE9DC',
  // Where the two inks overprint.
  overprint: '#5A3F93',
  ink: '#1B1B3A',
  inkSoft: '#55536B',
  white: '#FFFFFF'
};
export const fontFamily = '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif';
export const fonts: FontFamily[] = [
  {
    family: 'Bricolage Grotesque',
    fallback: 'ui-sans-serif, system-ui, sans-serif',
    files: [
      { src: '/fonts/bricolage-grotesque/bricolage-grotesque-wght.woff2', weight: '200 800', style: 'normal' }
    ]
  }
];
