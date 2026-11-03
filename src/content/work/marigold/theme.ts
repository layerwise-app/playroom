import type { FontFamily } from '~/portfolio.config';

// Marigold's own palette and type. The card panel uses `color`.
export const color = '#F4A621';
export const ink = '#2A2110';
export const palette = {
  marigold: '#F4A621',
  marigoldDeep: '#C77A00',
  cream: '#FFF8EB',
  butter: '#FFE9B8',
  green: '#1E3A2E',
  greenSoft: '#DDE8E0',
  ink: '#1F1A12',
  inkSoft: '#5C5446',
  rule: '#EFE3C8',
  coral: '#E86F51',
  white: '#FFFFFF'
};
export const fontFamily = '"Atkinson Hyperlegible Next", ui-sans-serif, system-ui, sans-serif';
export const fonts: FontFamily[] = [
  {
    family: 'Atkinson Hyperlegible Next',
    fallback: 'ui-sans-serif, system-ui, sans-serif',
    files: [
      {
        src: '/fonts/atkinson-hyperlegible-next/atkinson-hyperlegible-next-wght.woff2',
        weight: '200 800',
        style: 'normal'
      }
    ]
  }
];
