import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import type { ReactNode } from 'react';
import { cn } from '~/lib/utils';

export type DemoRuntime = {
  /** The loop should be playing right now. */
  autoplay: boolean;
  /** Someone is using the demo: hovering, touching, or focused inside it. */
  engaged: boolean;
  /** Show the finished state and never animate (reduced motion, stills). */
  still: boolean;
  /** The device has a mouse or trackpad. */
  canHover: boolean;
};

// Without a shell (server render, stills), a demo shows its finished state.
const DemoRuntimeContext = createContext<DemoRuntime>({
  autoplay: false,
  engaged: false,
  still: true,
  canHover: true
});

export function useDemoRuntime() {
  return useContext(DemoRuntimeContext);
}

const LEAVE_GRACE_MS = 900;
const TOUCH_IDLE_MS = 9000;

/**
 * Runs a live demo: plays its loop while it is on screen, and hands it to the
 * visitor when they hover, touch, or tab into it. The loop pauses off screen,
 * in background tabs, and entirely with `prefers-reduced-motion`.
 */
export function DemoShell({
  label,
  className,
  children,
  after
}: {
  label: string;
  className?: string;
  children: ReactNode;
  /** Rendered after the demo, outside its hover area, with access to `useDemoRuntime()`. */
  after?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [engaged, setEngaged] = useState(false);
  const hovering = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => {
      setReducedMotion(motion.matches);
      setCanHover(hover.matches);
    };
    sync();
    motion.addEventListener('change', sync);
    hover.addEventListener('change', sync);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      motion.removeEventListener('change', sync);
      hover.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          clearTimeout(timer.current);
          setEngaged(false);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const engage = useCallback(() => {
    clearTimeout(timer.current);
    setEngaged(true);
  }, []);

  const release = useCallback((delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      // Keyboard focus holds the demo; focus left behind by a mouse click doesn't.
      const active = document.activeElement;
      const focusInside = !!active && !!ref.current?.contains(active) && active.matches(':focus-visible');
      if (!hovering.current && !focusInside) setEngaged(false);
    }, delay);
  }, []);

  const runtime: DemoRuntime = {
    autoplay: mounted && visible && pageVisible && !engaged && !reducedMotion,
    engaged,
    still: reducedMotion,
    canHover
  };

  return (
    <DemoRuntimeContext.Provider value={runtime}>
      {/* The handlers only watch for a visitor arriving; the demo's own controls are the interactive parts. */}
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={ref}
        role='group'
        aria-label={label}
        className={cn('relative', className)}
        onPointerEnter={(event) => {
          if (event.pointerType === 'touch') return;
          hovering.current = true;
          engage();
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'touch') return;
          hovering.current = false;
          release(LEAVE_GRACE_MS);
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== 'touch') return;
          engage();
          release(TOUCH_IDLE_MS);
        }}
        onFocus={engage}
        onBlur={(event) => {
          if (!ref.current?.contains(event.relatedTarget as Node | null)) {
            release(LEAVE_GRACE_MS);
          }
        }}
        onKeyDown={() => {
          if (!canHover) release(TOUCH_IDLE_MS);
        }}
      >
        {children}
      </div>
      {after}
    </DemoRuntimeContext.Provider>
  );
}
