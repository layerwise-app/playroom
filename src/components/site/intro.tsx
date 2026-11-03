import { useEffect, useRef, useState } from 'react';
import { RichText } from '~/components/rich-text';
import { portfolio } from '~/portfolio.config';

/*
 * The home intro: a short greeting selected like a frame on a design canvas,
 * then two lines about the owner. Behind it, faint construction marks (smart
 * guides along the frame's edges, a spacing redline, and a construction
 * circle) draw in and settle back as the page loads. The text itself is
 * never animated, so it reads on the first frame.
 */

/** Space between the frame and the lines under it; the redline measures it. */
const GAP = 'clamp(2.25rem, 4.5vw, 3.25rem)';

export function Intro() {
  const frameRef = useRef<HTMLSpanElement>(null);
  const linesRef = useRef<HTMLParagraphElement>(null);
  const [size, setSize] = useState<{ w: number; h: number; gap: number } | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const lines = linesRef.current;
    if (!frame || !lines) return;
    const measure = () => {
      const box = frame.getBoundingClientRect();
      const gap = lines.getBoundingClientRect().top - box.bottom;
      setSize({ w: Math.round(box.width), h: Math.round(box.height), gap: Math.round(gap) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(lines);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby='intro-greeting' className='relative isolate overflow-hidden'>
      <div className='page flex flex-col items-center pt-[clamp(4.5rem,11vw,8.5rem)] pb-[clamp(3.5rem,8vw,6rem)] text-center'>
        <h1 id='intro-greeting' className='relative flex'>
          <span
            ref={frameRef}
            className='relative inline-block px-[0.55em] py-[0.3em] text-[clamp(1.3125rem,2.1vw,1.625rem)] leading-none font-medium tracking-[-0.025em] whitespace-nowrap text-ink'
          >
            {portfolio.greeting}
            <Construction gap={size?.gap} />
            <span aria-hidden className='intro-border' />
            {(['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0'] as const).map(
              (corner) => (
                <span key={corner} aria-hidden className={`intro-handle ${corner}`} />
              )
            )}
            <span
              aria-hidden
              className='intro-tag absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 rounded-[3px] bg-accent px-1 py-px font-mono text-[0.625rem] leading-[1.35] font-medium tracking-normal text-accent-ink transition-opacity duration-300'
              style={{ opacity: size ? 1 : 0 }}
            >
              {size ? `${size.w} × ${size.h}` : '0 × 0'}
            </span>
          </span>
        </h1>
        <p
          ref={linesRef}
          className='max-w-[36rem] text-[clamp(1.0625rem,1.55vw,1.25rem)] leading-[1.5] tracking-[-0.015em] text-ink'
          style={{ marginTop: GAP }}
        >
          <RichText text={portfolio.intro} />
          <span className='mt-1 block text-ink-muted'>{portfolio.previously}</span>
        </p>
      </div>
    </section>
  );
}

/** The faint marks behind the frame: guides, a redline, and a circle. */
function Construction({ gap }: { gap?: number }) {
  return (
    <span aria-hidden className='intro-construction -z-10'>
      <span className='intro-guide-x top-0' />
      <span className='intro-guide-x top-full' />
      {/* Vertical guides stop where the lines start, like a smart guide between two layers. */}
      <span className='intro-guide-y left-0' style={{ bottom: `calc(-1 * ${GAP})` }} />
      <span className='intro-guide-y left-full' style={{ bottom: `calc(-1 * ${GAP})` }} />
      {/* Spacing redline from the frame down to the first line. */}
      <span
        className='intro-redline absolute top-full left-[calc(100%+1.25rem)] hidden border-l border-accent sm:block'
        style={{ height: GAP }}
      >
        <span className='absolute top-0 -left-[4px] w-[7px] border-t border-accent' />
        <span className='absolute bottom-0 -left-[4px] w-[7px] border-t border-accent' />
        <span
          className='absolute top-1/2 left-1.5 -translate-y-1/2 font-mono text-[0.625rem] leading-none font-medium text-accent transition-opacity duration-300'
          style={{ opacity: gap ? 1 : 0 }}
        >
          {gap ?? 0}
        </span>
      </span>
      <svg
        className='absolute top-1/2 left-1/2 size-[min(44rem,140vw)] -translate-x-1/2 -translate-y-1/2 overflow-visible'
        viewBox='-50 -50 100 100'
      >
        <circle className='intro-draw' r='49.5' pathLength={1} opacity={0.55} />
        <circle className='intro-draw' r='30' pathLength={1} opacity={0.4} style={{ animationDelay: '0.35s' }} />
        <line className='intro-draw' x1='-35' y1='-35' x2='35' y2='35' pathLength={1} opacity={0.3} style={{ animationDelay: '0.5s' }} />
        <line className='intro-draw' x1='35' y1='-35' x2='-35' y2='35' pathLength={1} opacity={0.3} style={{ animationDelay: '0.6s' }} />
      </svg>
    </span>
  );
}
