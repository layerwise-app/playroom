import { useEffect, useRef, useState } from 'react';
import type { Role } from '~/content/about';

const CHAR_MS = 16;
const ROW_STAGGER_MS = 150;

/**
 * The experience list types itself in once, the first time it scrolls into
 * view. The server renders it finished, and it stays finished with reduced
 * motion or if it's already on screen when the page loads. Space for every
 * character is reserved from the start, so nothing moves while it types.
 */
export function ExperienceList({ roles }: { roles: Role[] }) {
  const ref = useRef<HTMLOListElement>(null);
  // `null` = finished. A number = milliseconds since typing started.
  const [elapsed, setElapsed] = useState<number | null>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = list.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    setElapsed(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const total = totalDuration(roles);
        const tick = (now: number) => {
          const time = now - start;
          if (time >= total) {
            setElapsed(null);
            return;
          }
          setElapsed(time);
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );
    observer.observe(list);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [roles]);

  return (
    <ol ref={ref} className='border-t border-rule'>
      {roles.map((role, index) => {
        const cells = [role.years, role.title, role.place];
        let remaining =
          elapsed === null ? Infinity : Math.max(0, (elapsed - index * ROW_STAGGER_MS) / CHAR_MS);
        const typing = elapsed !== null && remaining > 0 && remaining < cells.join('').length;
        return (
          <li
            key={`${role.years}-${role.place}`}
            className='grid grid-cols-[6.5rem_1fr] gap-x-6 gap-y-0.5 border-b border-rule py-3.5 sm:grid-cols-[8.5rem_1fr_1fr] sm:py-4'
          >
            {cells.map((text, cell) => {
              const shown = Math.min(text.length, Math.floor(remaining));
              remaining -= text.length;
              const caret = typing && shown > 0 && shown < text.length;
              return (
                <span
                  key={cell}
                  className={
                    cell === 0
                      ? 'pt-px font-mono text-[0.8125rem] text-ink-muted'
                      : cell === 1
                        ? 'font-medium text-ink'
                        : 'col-start-2 text-ink-soft sm:col-start-auto'
                  }
                >
                  <span className='sr-only'>{text}</span>
                  <span aria-hidden>
                    {text.slice(0, shown)}
                    {caret ? (
                      <span className='relative inline-block w-0'>
                        <span className='absolute -top-[0.85em] left-px h-[1.05em] w-[2px] bg-accent' />
                      </span>
                    ) : null}
                    <span className='invisible'>{text.slice(shown)}</span>
                  </span>
                </span>
              );
            })}
          </li>
        );
      })}
    </ol>
  );
}

function totalDuration(roles: Role[]) {
  const longest = Math.max(
    ...roles.map((role, index) => index * ROW_STAGGER_MS + (role.years + role.title + role.place).length * CHAR_MS)
  );
  return longest + 60;
}
