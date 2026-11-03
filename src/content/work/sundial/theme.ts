import type { FontFamily } from '~/portfolio.config';

// Sundial's own palette and type. The card panel uses `color`.
export const color = '#2448D8';
export const ink = '#FFFFFF';
export const palette = {
  cobalt: '#2448D8',
  cobaltDeep: '#16308F',
  ice: '#EEF2FF',
  paper: '#FFFFFF',
  ink: '#121A33',
  inkSoft: '#56607A',
  rule: '#E1E6F2',
  conflict: '#D63A2A',
  conflictTint: '#FDECEA',
  // One tint per room, so a class's room reads at a glance.
  rooms: {
    kiln: { fill: '#F6E1D3', ink: '#7A3517', name: 'Kiln room' },
    studioA: { fill: '#DFEBD8', ink: '#2F5321', name: 'Studio A' },
    studioB: { fill: '#E4E0F5', ink: '#3E3375', name: 'Studio B' },
    room4: { fill: '#F3EBCF', ink: '#6A5512', name: 'Room 4' },
    music: { fill: '#D9EAF3', ink: '#1C4E68', name: 'Music room' }
  }
};
export const fontFamily = '"IBM Plex Sans Condensed", "Arial Narrow", ui-sans-serif, sans-serif';
export const fonts: FontFamily[] = [
  {
    family: 'IBM Plex Sans Condensed',
    fallback: '"Arial Narrow", ui-sans-serif, sans-serif',
    files: [
      { src: '/fonts/ibm-plex-sans-condensed/ibm-plex-sans-condensed-400.woff2', weight: '400', style: 'normal' },
      { src: '/fonts/ibm-plex-sans-condensed/ibm-plex-sans-condensed-500.woff2', weight: '500', style: 'normal' },
      { src: '/fonts/ibm-plex-sans-condensed/ibm-plex-sans-condensed-600.woff2', weight: '600', style: 'normal' }
    ]
  }
];
