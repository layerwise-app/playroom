import type { FontFamily } from '~/portfolio.config';

// Kittiwake's own palette and type. The card panel shows the sea texture over `color`.
export const color = '#0E5A5E';
export const ink = '#F3EBDD';
export const palette = {
  sea: '#0E5A5E',
  deep: '#0A3438',
  foam: '#DCEDE6',
  sand: '#F3EBDD',
  stone: '#D9CDB8',
  ink: '#10292B',
  inkSoft: '#4A5E5F',
  beak: '#F2C230',
  rule: '#E3D8C4',
  white: '#FFFFFF'
};
// Fraunces with the Softness axis turned up: set `fontVariationSettings: '"SOFT" 100'`.
export const fontFamily = '"Fraunces", ui-serif, Georgia, serif';
export const fonts: FontFamily[] = [
  {
    family: 'Fraunces',
    fallback: 'ui-serif, Georgia, serif',
    files: [{ src: '/fonts/fraunces/fraunces-soft.woff2', weight: '100 900', style: 'normal' }]
  }
];
