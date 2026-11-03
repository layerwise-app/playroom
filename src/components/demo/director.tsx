import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { at, u } from '~/components/stage';
import { useDemoRuntime } from './runtime';

export type CursorState = {
  x: number;
  y: number;
  visible: boolean;
  pressed: boolean;
  /** Milliseconds for the current move. */
  duration: number;
};

type Target =
  | string
  | {
      x: number;
      y: number;
    };

type MoveOptions = {
  /** Milliseconds. Defaults to a speed based on distance. */
  duration?: number;
  /** Where on the target to land, 0–1 from its top-left. Defaults to the center. */
  anchor?: [number, number];
  /** Extra offset in stage units. */
  offset?: [number, number];
};

/**
 * What a demo script can do. Every method rejects when the loop is
 * interrupted, so a script can be written top to bottom with `await`.
 */
export type Director = {
  signal: AbortSignal;
  wait(ms: number): Promise<void>;
  /** Glide the cursor to an element with `data-target="name"`, or to stage coordinates. */
  move(target: Target, options?: MoveOptions): Promise<void>;
  /** Show the cursor at a spot without gliding there. */
  appear(target: Target, options?: Omit<MoveOptions, 'duration'>): Promise<void>;
  hide(): void;
  /** A click: press down and release. */
  press(): Promise<void>;
  down(): void;
  up(): void;
  /** Stage coordinates of an element, for drags or positioning. */
  point(target: Target, options?: Omit<MoveOptions, 'duration'>): { x: number; y: number };
  /** Call `onText` with a growing prefix of `text`, like someone typing. */
  type(
    text: string,
    onText: (partial: string) => void,
    options?: { cps?: number }
  ): Promise<void>;
};

const isAbort = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError';

/**
 * The autoplay loop for a live demo.
 *
 * `script` plays one pass of the loop. It starts from, and should end on, the
 * demo's finished state: the state the reducer starts in, which is what the
 * server renders and what people with reduced motion see. A pass usually holds
 * the finished state for a moment, resets, then builds back up.
 *
 * Attach `rootRef` to the Stage (`innerRef`) and render `<DemoCursor>` inside it.
 */
export function useDirector(script: (d: Director) => Promise<void>) {
  const runtime = useDemoRuntime();
  const rootRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    visible: false,
    pressed: false,
    duration: 0
  });
  // `update()` below keeps this in step with `cursor`.
  const cursorRef = useRef(cursor);
  const scriptRef = useRef(script);
  useLayoutEffect(() => {
    scriptRef.current = script;
  });

  useEffect(() => {
    if (!runtime.autoplay) return;
    const controller = new AbortController();
    const { signal } = controller;

    const update = (next: Partial<CursorState>) => {
      cursorRef.current = { ...cursorRef.current, ...next };
      setCursor(cursorRef.current);
    };

    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        if (signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          return;
        }
        const id = setTimeout(resolve, ms);
        signal.addEventListener(
          'abort',
          () => {
            clearTimeout(id);
            reject(new DOMException('Aborted', 'AbortError'));
          },
          { once: true }
        );
      });

    const point: Director['point'] = (target, options = {}) => {
      const [ox, oy] = options.offset ?? [0, 0];
      if (typeof target !== 'string') return { x: target.x + ox, y: target.y + oy };
      const root = rootRef.current;
      const element = root?.querySelector<HTMLElement>(`[data-target="${target}"]`);
      if (!root || !element) {
        throw new Error(`Demo target "${target}" not found`);
      }
      const rootBox = root.getBoundingClientRect();
      const box = element.getBoundingClientRect();
      const stageWidth = parseFloat(
        getComputedStyle(root).getPropertyValue('--stage-w')
      );
      const scale = rootBox.width / stageWidth;
      const [ax, ay] = options.anchor ?? [0.5, 0.5];
      return {
        x: (box.left + box.width * ax - rootBox.left) / scale + ox,
        y: (box.top + box.height * ay - rootBox.top) / scale + oy
      };
    };

    const director: Director = {
      signal,
      wait,
      point,
      async move(target, options = {}) {
        const next = point(target, options);
        const current = cursorRef.current;
        if (!current.visible) {
          update({ ...next, visible: true, duration: 0 });
          await wait(220);
          return;
        }
        const distance = Math.hypot(next.x - current.x, next.y - current.y);
        const duration =
          options.duration ?? Math.min(1100, Math.max(380, 320 + distance * 1.5));
        update({ ...next, duration });
        await wait(duration);
      },
      async appear(target, options = {}) {
        update({ ...point(target, options), visible: true, duration: 0 });
        await wait(220);
      },
      hide() {
        update({ visible: false, pressed: false });
      },
      async press() {
        update({ pressed: true });
        await wait(150);
        update({ pressed: false });
        await wait(110);
      },
      down() {
        update({ pressed: true });
      },
      up() {
        update({ pressed: false });
      },
      async type(text, onText, options = {}) {
        const cps = options.cps ?? 24;
        for (let i = 1; i <= text.length; i++) {
          onText(text.slice(0, i));
          const pause = /[,.!?]/.test(text[i - 1] ?? '') ? 3 : 1;
          await wait((1000 / cps) * pause * (0.7 + Math.random() * 0.6));
        }
      }
    };

    (async () => {
      try {
        await wait(500);
        while (!signal.aborted) {
          await scriptRef.current(director);
        }
      } catch (error) {
        if (!isAbort(error)) console.error(error);
      }
    })();

    return () => {
      controller.abort();
      update({ visible: false, pressed: false });
    };
  }, [runtime.autoplay]);

  return {
    rootRef,
    cursor,
    /** The loop is playing. */
    playing: runtime.autoplay,
    /** A visitor has taken over. */
    engaged: runtime.engaged,
    /** Finished state only (reduced motion or a still render). */
    still: runtime.still,
    canHover: runtime.canHover
  };
}

/**
 * The cursor a demo's loop moves around. `arrow` is a pointer with an optional
 * name tag; `touch` is a fingertip for phone screens.
 */
export function DemoCursor({
  cursor,
  kind = 'arrow',
  label,
  color = '#111111',
  ink = '#FFFFFF'
}: {
  cursor: CursorState;
  kind?: 'arrow' | 'touch';
  label?: string;
  color?: string;
  ink?: string;
}) {
  return (
    <div
      aria-hidden
      className='demo-cursor'
      style={{
        transform: at(cursor.x, cursor.y),
        transitionDuration: `${cursor.duration}ms, 200ms`,
        opacity: cursor.visible ? 1 : 0
      }}
    >
      {kind === 'arrow' ? (
        <div
          style={{
            transform: cursor.pressed ? 'scale(0.86)' : 'scale(1)',
            transformOrigin: '0 0',
            transition: 'transform 120ms ease'
          }}
        >
          <svg
            viewBox='0 0 14 20'
            style={{ width: u(15), height: u(21), display: 'block', overflow: 'visible' }}
          >
            <path
              d='M1 1 L1 16.2 L4.9 12.6 L7.6 18.6 L10.3 17.4 L7.7 11.6 L13 11.3 Z'
              fill={color}
              stroke={ink}
              strokeWidth='1.3'
              strokeLinejoin='round'
            />
          </svg>
          {label ? (
            <span
              style={{
                position: 'absolute',
                left: u(13),
                top: u(17),
                background: color,
                color: ink,
                fontSize: u(11),
                fontWeight: 600,
                lineHeight: 1,
                padding: `${u(4)} ${u(7)}`,
                borderRadius: u(6),
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em'
              }}
            >
              {label}
            </span>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            left: u(-17),
            top: u(-17),
            width: u(34),
            height: u(34),
            borderRadius: '50%',
            background: `color-mix(in srgb, ${color} 28%, transparent)`,
            border: `${u(1.5)} solid color-mix(in srgb, ${color} 55%, transparent)`,
            transform: cursor.pressed ? 'scale(0.78)' : 'scale(1)',
            transition: 'transform 140ms ease, background 140ms ease'
          }}
        />
      )}
    </div>
  );
}
