import type { CSSProperties } from 'react';
import type { ImageAsset } from '~/content/types';
import { cn } from '~/lib/utils';

/**
 * A responsive image from `pnpm add-images`. Its box is sized from the image's
 * own dimensions before it loads, so nothing moves, and a tiny blurred preview
 * fills the box in the meantime.
 */
export function Picture({
  image,
  alt,
  sizes = '100vw',
  priority = false,
  className,
  style
}: {
  image: ImageAsset;
  alt: string;
  /** The `sizes` attribute: how wide the image is drawn at each breakpoint. */
  sizes?: string;
  /** Load right away; use for the first image on a page. */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const sources = image.sources;
  const fallback = sources[Math.min(1, sources.length - 1)] ?? sources[0];
  return (
    <img
      src={fallback?.src}
      srcSet={
        image.animated || sources.length < 2
          ? undefined
          : sources.map((source) => `${source.src} ${source.width}w`).join(', ')
      }
      sizes={image.animated ? undefined : sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding='async'
      fetchPriority={priority ? 'high' : undefined}
      className={cn('block h-auto w-full', className)}
      style={{
        aspectRatio: `${image.width} / ${image.height}`,
        backgroundImage: `url(${image.blur})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style
      }}
    />
  );
}
