import type { FontFamily } from '~/portfolio.config';

// Openhand's own palette and type. The card panel uses `color`.
export const color = '#E8552F';
export const ink = '#2B1A14';
export const palette = {
  vermilion: '#E8552F',
  ember: '#C23F1D',
  cream: '#FFF7F0',
  peach: '#FFE2D3',
  ink: '#2B1A14',
  inkSoft: '#6E554B',
  rule: '#F0DCD0',
  kept: '#2F7D4F',
  white: '#FFFFFF'
};
export const fontFamily = '"Figtree", ui-sans-serif, system-ui, sans-serif';
export const fonts: FontFamily[] = [
  {
    family: 'Figtree',
    fallback: 'ui-sans-serif, system-ui, sans-serif',
    files: [{ src: '/fonts/figtree/figtree-wght.woff2', weight: '300 900', style: 'normal' }]
  }
];
