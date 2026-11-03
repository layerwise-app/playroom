import { useEffect, useRef, useState } from 'react';
import { Picture } from '~/components/picture';
import type { ImageAsset } from '~/content/types';
import { cn } from '~/lib/utils';

/**
 * A muted looping video that plays only while on screen, never plays by itself
 * with reduced motion, and always has a pause button.
 */
export function LoopVideo({
  src,
  poster,
  alt,
  className,
  sizes = '100vw'
}: {
  src: string;
  poster: ImageAsset;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setUserPaused(true);
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.25
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (visible && !userPaused) {
      video.play().catch(() => setPaused(true));
    } else {
      video.pause();
    }
  }, [visible, userPaused]);

  const posterSrc = poster.sources[Math.min(1, poster.sources.length - 1)]?.src;

  return (
    <div className={cn('relative', className)}>
      {mounted ? (
        <video
          ref={ref}
          src={src}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload='metadata'
          aria-label={alt}
          width={poster.width}
          height={poster.height}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          className='block h-auto w-full'
          style={{
            aspectRatio: `${poster.width} / ${poster.height}`,
            backgroundImage: `url(${poster.blur})`,
            backgroundSize: 'cover'
          }}
        />
      ) : (
        <Picture image={poster} alt={alt} sizes={sizes} />
      )}
      <button
        type='button'
        onClick={() => setUserPaused((value) => !value)}
        className='absolute right-3 bottom-3 rounded-full bg-ink/80 px-3 py-1.5 text-[0.8125rem] font-medium text-paper transition-colors hover:bg-ink'
        aria-label={paused ? 'Play video' : 'Pause video'}
      >
        {paused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
}
