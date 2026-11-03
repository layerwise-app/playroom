import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { cn } from '~/lib/utils';

const TABS = [
  { to: '/', label: 'Work', match: (path: string) => path === '/' || path.startsWith('/work') },
  { to: '/play', label: 'Play', match: (path: string) => path.startsWith('/play') },
  { to: '/about', label: 'About', match: (path: string) => path.startsWith('/about') },
  { to: '/writing', label: 'Writing', match: (path: string) => path.startsWith('/writing') }
] as const;

/** Distance from the top of the viewport when stuck, in px (matches `top-3`). */
const STICKY_TOP = 12;

/**
 * The sticky Work / Play / About / Writing bar. The pill slides to the active
 * tab; every tab is the same width, so its position is pure CSS and correct in
 * the server render.
 *
 * `tabs` mode is for the home layout, where the bar sits under the intro:
 * switching tabs keeps the bar where it is instead of jumping to the top.
 */
export function TabBar({ mode }: { mode: 'tabs' | 'nav' }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const active = TABS.findIndex((tab) => tab.match(pathname));
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < STICKY_TOP + 1),
      { rootMargin: `-${STICKY_TOP + 1}px 0px 0px 0px`, threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const keepPlace = () => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const top = sentinel.getBoundingClientRect().top + window.scrollY - STICKY_TOP;
    if (window.scrollY > top + 1) {
      requestAnimationFrame(() => window.scrollTo({ top, behavior: 'instant' }));
    }
  };

  return (
    <>
      <div ref={sentinelRef} aria-hidden className='h-px' />
      <nav
        aria-label='Sections'
        className='pointer-events-none sticky top-3 z-40 -mt-px flex justify-center px-4'
      >
        <div
          data-stuck={stuck || undefined}
          className={cn(
            'pointer-events-auto relative grid grid-cols-4 rounded-full bg-surface/90 p-[3px] backdrop-blur-md',
            'shadow-[inset_0_0_0_1px_rgba(17,17,17,0.05)] transition-shadow duration-300',
            'data-[stuck]:shadow-[inset_0_0_0_1px_rgba(17,17,17,0.06),0_8px_24px_-12px_rgba(17,17,17,0.28)]'
          )}
        >
          <span
            aria-hidden
            className='absolute top-[3px] bottom-[3px] left-[3px] w-[calc((100%-6px)/4)] rounded-full bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.06),0_1px_3px_rgba(17,17,17,0.12)] transition-[transform,opacity] duration-[460ms] ease-[cubic-bezier(0.3,1.25,0.45,1)]'
            style={{
              transform: `translateX(${Math.max(active, 0) * 100}%)`,
              opacity: active < 0 ? 0 : 1
            }}
          />
          {TABS.map((tab, index) => (
            <Link
              key={tab.to}
              to={tab.to}
              resetScroll={mode === 'nav'}
              onClick={mode === 'tabs' ? keepPlace : undefined}
              aria-current={index === active ? 'page' : undefined}
              className={cn(
                'relative z-10 w-[4.5rem] rounded-full py-1.5 text-center text-[0.875rem] font-medium tracking-[-0.01em] transition-colors duration-300 sm:w-[5.25rem]',
                index === active ? 'text-ink' : 'text-ink-muted hover:text-ink'
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
