import type { ReactNode } from 'react';

/**
 * A still image rendered from a project's React screens. Each project's
 * `stills.tsx` lists them; they're captured at 2× and processed with
 * `pnpm add-images` into the images its case study uses.
 */
export type Still = {
  /** File name and key in `images.ts`, like `cover` or `review-panel`. */
  key: string;
  /** Size in stage units; captured at this many CSS pixels. */
  width: number;
  height: number;
  render: () => ReactNode;
};
