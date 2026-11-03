import type { ComponentType } from 'react';
import type { FontFamily } from '~/portfolio.config';

/** An image processed by `pnpm add-images`. Import it from the folder's `images.ts`. */
export type ImageAsset = {
  /** WebP files from narrowest to widest (a GIF has one entry, served as-is). */
  sources: { src: string; width: number }[];
  width: number;
  height: number;
  /** A tiny blurred preview shown while the image loads. */
  blur: string;
  animated?: boolean;
  /** A 1200 × 630 JPG for link previews. Written for images named `cover`. */
  og?: string;
};

export type Figure = { image: ImageAsset; alt: string; label?: string };

export type Metric = {
  value: string;
  label: string;
  detail?: string;
};

/**
 * The building blocks of a case study body. Text fields accept `*asterisks*`
 * for the serif italic.
 */
export type Block =
  /** Mounts the project's live demo (see `preview`). */
  | { type: 'demo'; caption?: string }
  | {
      type: 'image';
      image: ImageAsset;
      alt: string;
      caption?: string;
      /** `wide` runs past the text column; `full` fills the page width. */
      size?: 'column' | 'wide' | 'full';
    }
  | { type: 'imagePair'; images: [Figure, Figure]; caption?: string }
  | {
      type: 'video';
      /** An imported .mp4 or a `public/` path. */
      src: string;
      poster: ImageAsset;
      /** What happens in the video, for people who can't watch it. */
      alt: string;
      caption?: string;
    }
  | { type: 'text'; heading?: string; body: string[] }
  | { type: 'quote'; text: string; name: string; role: string }
  | { type: 'beforeAfter'; before: Figure; after: Figure; caption?: string }
  | { type: 'metrics'; items: Metric[]; caption?: string };

/** Props every live demo receives. */
export type DemoProps = {
  /** `card` on the work wall, `feature` on the case study page. */
  variant?: 'card' | 'feature';
};

/**
 * What runs in the project's card on the home page and at the top of its case
 * study: a live demo component, a still image, or a looping video.
 */
export type Preview =
  | { type: 'demo'; Demo: ComponentType<DemoProps>; label: string }
  | { type: 'image'; image: ImageAsset; alt: string }
  | { type: 'video'; src: string; poster: ImageAsset; alt: string };

export type Project = {
  /** The URL: `/work/<slug>`. Match the file name. */
  slug: string;
  /** Position on the work wall, lowest first. */
  order: number;
  title: string;
  /** One line for the card, finishing "Title —". */
  summary: string;
  client: string;
  year: string;
  role: string;
  team: string[];
  theme: {
    /** The project's one saturated color: card panel and case study accents. */
    color: string;
    /** Text and controls drawn directly on `color`. */
    ink: string;
    /** Optional texture drawn behind the preview, like a photograph or shader. */
    Texture?: ComponentType<{ className?: string }>;
  };
  /** Typefaces the project's own screens use. */
  fonts?: FontFamily[];
  /** The share image and the still used wherever motion isn't wanted. */
  cover: { image: ImageAsset; alt: string };
  preview: Preview;
  problem: {
    /** What the client asked for, and why it mattered. */
    brief: string;
    /** What made it hard. */
    constraint: string;
  };
  decisions: { title: string; body: string }[];
  outcome: { summary: string; metrics?: Metric[] };
  blocks: Block[];
};

export function defineProject(project: Project): Project {
  return project;
}

export type EssayBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string };

export type Essay = {
  /** The URL: `/writing/<slug>`. Match the file name. */
  slug: string;
  title: string;
  /** One or two sentences for the list and link previews. */
  dek: string;
  /** ISO date, like `2026-03-14`. */
  date: string;
  body: EssayBlock[];
};

export function defineEssay(essay: Essay): Essay {
  return essay;
}
