import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Experiment, Segmented, Slider } from '~/components/play/controls';
import { cn } from '~/lib/utils';
import { portfolio } from '~/portfolio.config';

/* ---------------------------------------------------------------- 01 ---- */

export function NestedRadii() {
  const [padding, setPadding] = useState(14);
  const [mode, setMode] = useState<'concentric' | 'same'>('concentric');
  const outer = 30;
  const inner = mode === 'concentric' ? Math.max(outer - padding, 0) : outer;
  return (
    <Experiment
      number={1}
      title='Nested corners'
      note='A rounded box inside a rounded box only looks right when the inner radius is the outer radius minus the padding.'
    >
      <div className='flex h-52 items-center justify-center rounded-2xl bg-surface'>
        <div
          className='w-[13.5rem] bg-ink transition-[padding,border-radius] duration-200'
          style={{ padding, borderRadius: outer }}
        >
          <div
            className='flex h-24 items-end justify-between bg-paper px-3 pb-2.5 text-[0.75rem] text-ink-soft transition-[border-radius] duration-200'
            style={{ borderRadius: inner }}
          >
            <span>inner</span>
            <span className='tabular font-medium text-ink'>{inner}px</span>
          </div>
        </div>
      </div>
      <div className='mt-5 grid gap-4'>
        <Slider label='Padding' value={padding} min={0} max={28} onChange={setPadding} format={(v) => `${v}px`} />
        <Segmented
          label='Inner radius'
          value={mode}
          onChange={setMode}
          options={[
            { value: 'concentric', label: `Outer − padding` },
            { value: 'same', label: 'Same as outer' }
          ]}
        />
      </div>
    </Experiment>
  );
}

/* ---------------------------------------------------------------- 02 ---- */

const HOLD_MS = 1100;

export function HoldToConfirm() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const frame = useRef(0);
  const progressRef = useRef(0);
  const holding = useRef(false);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const animate = (direction: 1 | -1) => {
    cancelAnimationFrame(frame.current);
    let last = performance.now();
    const step = (now: number) => {
      const delta = (now - last) / (direction === 1 ? HOLD_MS : HOLD_MS / 3);
      last = now;
      progressRef.current = Math.min(1, Math.max(0, progressRef.current + delta * direction));
      setProgress(progressRef.current);
      if (direction === 1 && progressRef.current >= 1) {
        holding.current = false;
        setDone(true);
        return;
      }
      if (direction === -1 && progressRef.current <= 0) return;
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };

  const start = () => {
    if (done || holding.current) return;
    holding.current = true;
    animate(1);
  };
  const stop = () => {
    if (!holding.current) return;
    holding.current = false;
    animate(-1);
  };
  const reset = () => {
    progressRef.current = 0;
    setProgress(0);
    setDone(false);
  };

  return (
    <Experiment
      number={3}
      title='Hold to confirm'
      note='For actions you can’t undo. Holding is a decision; a dialog is a reflex. Let go early and nothing happens.'
    >
      <div className='flex h-40 flex-col items-center justify-center gap-3 rounded-2xl bg-surface px-4'>
        {done ? (
          <div className='text-center' role='status'>
            <p className='font-medium text-ink'>48 photos deleted.</p>
            <button type='button' onClick={reset} className='link mt-1 text-[0.875rem] text-ink-soft'>
              Bring them back
            </button>
          </div>
        ) : (
          <>
            <button
              type='button'
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                start();
              }}
              onPointerUp={stop}
              onPointerCancel={stop}
              onLostPointerCapture={stop}
              onKeyDown={(event) => {
                if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
                  event.preventDefault();
                  start();
                }
              }}
              onKeyUp={(event) => {
                if (event.key === ' ' || event.key === 'Enter') stop();
              }}
              onContextMenu={(event) => event.preventDefault()}
              className='relative touch-none overflow-hidden rounded-full border border-[#9f2a1d] bg-paper px-6 py-3 text-[0.9375rem] font-medium text-[#9f2a1d] select-none'
            >
              <span
                aria-hidden
                className='absolute inset-0 origin-left bg-[#9f2a1d]'
                style={{ transform: `scaleX(${progress})` }}
              />
              <span
                aria-hidden
                className='absolute inset-0 flex items-center justify-center px-6 text-paper'
                style={{ clipPath: `inset(0 ${100 - progress * 100}% 0 0)` }}
              >
                Hold to delete 48 photos
              </span>
              <span className='relative'>Hold to delete 48 photos</span>
            </button>
            <p className='text-[0.8125rem] text-ink-muted'>Press and hold, or hold Space.</p>
          </>
        )}
      </div>
    </Experiment>
  );
}

/* ---------------------------------------------------------------- 03 ---- */

type Box = { x: number; y: number; w: number; h: number };
const SNAP = 6;

export function SmartGuides() {
  const frameRef = useRef<HTMLDivElement>(null);
  // Position of the movable layer in px, set once the frame is measured.
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const layer = { w: 92, h: 40 };

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => setSize({ w: frame.clientWidth, h: frame.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const anchor: Box = { x: Math.round(size.w * 0.14), y: 28, w: 64, h: 64 };
  const current = pos ?? { x: Math.round(size.w * 0.55), y: Math.round(size.h * 0.62) };

  const snap = (x: number, y: number, useSnap: boolean) => {
    const xs = [
      { at: size.w / 2 - layer.w / 2, line: size.w / 2 },
      { at: anchor.x, line: anchor.x },
      { at: anchor.x + anchor.w / 2 - layer.w / 2, line: anchor.x + anchor.w / 2 }
    ];
    const ys = [
      { at: size.h / 2 - layer.h / 2, line: size.h / 2 },
      { at: anchor.y + anchor.h / 2 - layer.h / 2, line: anchor.y + anchor.h / 2 },
      { at: anchor.y, line: anchor.y }
    ];
    let gx: number | null = null;
    let gy: number | null = null;
    for (const option of xs) {
      if (Math.abs(x - option.at) <= (useSnap ? SNAP : 0.5)) {
        x = option.at;
        gx = option.line;
        break;
      }
    }
    for (const option of ys) {
      if (Math.abs(y - option.at) <= (useSnap ? SNAP : 0.5)) {
        y = option.at;
        gy = option.line;
        break;
      }
    }
    return {
      x: Math.min(Math.max(0, x), size.w - layer.w),
      y: Math.min(Math.max(0, y), size.h - layer.h),
      gx,
      gy
    };
  };

  const placed = snap(current.x, current.y, false);

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const frame = frameRef.current!.getBoundingClientRect();
    drag.current = {
      dx: event.clientX - frame.left - current.x,
      dy: event.clientY - frame.top - current.y
    };
    setDragging(true);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const frame = frameRef.current!.getBoundingClientRect();
    const next = snap(event.clientX - frame.left - drag.current.dx, event.clientY - frame.top - drag.current.dy, true);
    setPos({ x: next.x, y: next.y });
  };
  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 10 : 1;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    const next = snap(current.x + move[0], current.y + move[1], false);
    setPos({ x: next.x, y: next.y });
  };

  const gapX =
    placed.gy !== null && placed.x > anchor.x + anchor.w ? Math.round(placed.x - (anchor.x + anchor.w)) : null;
  const gapY =
    placed.gx !== null && placed.y > anchor.y + anchor.h ? Math.round(placed.y - (anchor.y + anchor.h)) : null;

  return (
    <Experiment
      number={2}
      title='Smart guides'
      note='Drag the button. It snaps to the frame’s center and to the logo, and shows the gap. Arrow keys nudge by 1, Shift by 10.'
    >
      <div ref={frameRef} className='relative h-60 overflow-hidden rounded-2xl bg-surface'>
        {size.w > 0 ? (
          <>
            <span
              aria-hidden
              className='absolute rounded-xl border border-ink/15 bg-paper'
              style={{ left: anchor.x, top: anchor.y, width: anchor.w, height: anchor.h }}
            >
              <span className='serif absolute inset-0 flex items-center justify-center text-[1.75rem] text-ink'>
                p
              </span>
            </span>
            {placed.gx !== null ? (
              <span aria-hidden className='absolute top-0 bottom-0 w-px bg-[#D92D20]' style={{ left: placed.gx }} />
            ) : null}
            {placed.gy !== null ? (
              <span aria-hidden className='absolute right-0 left-0 h-px bg-[#D92D20]' style={{ top: placed.gy }} />
            ) : null}
            {gapX !== null && placed.gy !== null ? (
              <span
                aria-hidden
                className='absolute -translate-x-1/2 -translate-y-[130%] rounded-[3px] bg-[#D92D20] px-1 font-mono text-[0.625rem] leading-[1.45] font-medium text-white'
                style={{ left: anchor.x + anchor.w + gapX / 2, top: placed.gy }}
              >
                {gapX}
              </span>
            ) : null}
            {gapY !== null && placed.gx !== null ? (
              <span
                aria-hidden
                className='absolute translate-x-1.5 -translate-y-1/2 rounded-[3px] bg-[#D92D20] px-1 font-mono text-[0.625rem] leading-[1.45] font-medium text-white'
                style={{ left: placed.gx, top: anchor.y + anchor.h + gapY / 2 }}
              >
                {gapY}
              </span>
            ) : null}
            <button
              type='button'
              aria-label={`Movable button at ${Math.round(placed.x)}, ${Math.round(placed.y)}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              className={cn(
                'absolute flex touch-none items-center justify-center rounded-full bg-ink text-[0.8125rem] font-medium text-paper select-none',
                dragging ? 'cursor-grabbing shadow-[0_10px_24px_-10px_rgba(17,17,17,0.6)]' : 'cursor-grab'
              )}
              style={{ left: placed.x, top: placed.y, width: layer.w, height: layer.h }}
            >
              Donate
            </button>
          </>
        ) : null}
      </div>
    </Experiment>
  );
}

/* ---------------------------------------------------------------- 04 ---- */

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}
function luminance([r, g, b]: [number, number, number]) {
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function toHex(rgb: [number, number, number]) {
  return `#${rgb.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}
// Measured against the page color from portfolio.config.ts.
const PAPER_LUMINANCE = luminance(
  [1, 3, 5].map((i) => parseInt(portfolio.colors.paper.slice(i, i + 2), 16) / 255) as [number, number, number]
);

export function ContrastFinder() {
  const [lightness, setLightness] = useState(42);
  const rgb = hslToRgb(60, 0.02, lightness / 100);
  const ratio = (PAPER_LUMINANCE + 0.05) / (luminance(rgb) + 0.05);
  const checks = [
    { label: 'Body text', need: 4.5 },
    { label: 'Large text', need: 3 },
    { label: 'Enhanced', need: 7 }
  ];
  return (
    <Experiment
      number={4}
      title='The lightest gray that passes'
      note='Designers love pale gray text. Slide until it fails, then come back one step.'
    >
      <div className='rounded-xl bg-paper p-4 shadow-[inset_0_0_0_1px_rgba(17,17,17,0.08)]'>
        <p className='text-[0.9375rem] leading-[1.5]' style={{ color: toHex(rgb) }}>
          Your appointment is confirmed for Thursday at 2:30 pm. We’ll text you the morning before.
        </p>
        <p className='tabular mt-4 flex items-baseline gap-2'>
          <span className='text-[1.75rem] leading-none font-medium tracking-[-0.04em] text-ink'>{ratio.toFixed(2)}</span>
          <span className='font-mono text-[0.75rem] text-ink-muted'>: 1 on this page · {toHex(rgb)}</span>
        </p>
      </div>
      <ul className='mt-3 flex flex-wrap gap-1.5 text-[0.75rem]'>
        {checks.map((check) => {
          const pass = ratio >= check.need;
          return (
            <li
              key={check.label}
              className={cn(
                'rounded-full px-2.5 py-0.5 font-medium',
                pass ? 'bg-[#dfe8dc] text-[#24461f]' : 'bg-[#f6dcd7] text-[#8a2516]'
              )}
            >
              {check.label} {check.need}:1 · {pass ? 'passes' : 'fails'}
            </li>
          );
        })}
      </ul>
      <div className='mt-4'>
        <Slider label='Text lightness' value={lightness} min={8} max={78} onChange={setLightness} format={(v) => `${v}%`} />
      </div>
    </Experiment>
  );
}

/* ---------------------------------------------------------------- 05 ---- */

export function OpticalCenter() {
  const [mode, setMode] = useState<'geometric' | 'optical'>('geometric');
  const [guides, setGuides] = useState(true);
  const shift = mode === 'optical' ? 7 : 0;
  return (
    <Experiment
      number={6}
      title='Optical center'
      note='A triangle centered by its box looks shifted left; its weight sits near the flat side. Nudge it by eye, not by math.'
    >
      <div className='relative flex h-48 items-center justify-center rounded-2xl bg-surface'>
        <div className='relative flex size-32 items-center justify-center rounded-full bg-ink'>
          <svg
            viewBox='0 0 40 46'
            className='h-12 w-auto transition-transform duration-300 ease-[var(--ease-settle)]'
            style={{ transform: `translateX(${shift}%)` }}
            aria-hidden
          >
            <path d='M2 2 L38 23 L2 44 Z' fill='var(--paper)' />
          </svg>
          {guides ? (
            <>
              <span aria-hidden className='absolute top-0 bottom-0 left-1/2 w-px bg-[#D92D20]/80' />
              <span aria-hidden className='absolute right-0 left-0 top-1/2 h-px bg-[#D92D20]/80' />
            </>
          ) : null}
        </div>
      </div>
      <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
        <Segmented
          label='Centering'
          value={mode}
          onChange={setMode}
          options={[
            { value: 'geometric', label: 'By the box' },
            { value: 'optical', label: 'By eye' }
          ]}
        />
        <label className='inline-flex cursor-pointer items-center gap-2 text-[0.875rem] text-ink-soft'>
          <input
            type='checkbox'
            checked={guides}
            onChange={(event) => setGuides(event.target.checked)}
            className='size-4 accent-[var(--ink)]'
          />
          Center lines
        </label>
      </div>
    </Experiment>
  );
}

/* ---------------------------------------------------------------- 06 ---- */

const CURVES = {
  linear: { label: 'Linear', points: [0, 0, 1, 1] },
  out: { label: 'Ease out', points: [0.2, 0.8, 0.2, 1] },
  inOut: { label: 'In and out', points: [0.65, 0, 0.35, 1] },
  overshoot: { label: 'Overshoot', points: [0.3, 1.45, 0.45, 1] }
} as const;
type CurveName = keyof typeof CURVES;

export function EasingFeel() {
  const [curve, setCurve] = useState<CurveName>('out');
  const [duration, setDuration] = useState(600);
  const [side, setSide] = useState<'left' | 'right'>('left');
  const [x1, y1, x2, y2] = CURVES[curve].points;
  const timing = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  const map = (x: number, y: number) => `${8 + x * 84} ${92 - y * 72}`;
  return (
    <Experiment
      number={5}
      title='Feel the curve'
      note='The same 600 ms feels quick or sluggish depending on where the time is spent. Run it a few times.'
    >
      <div className='grid grid-cols-[6.5rem_1fr] items-center gap-4 rounded-2xl bg-surface p-4'>
        <svg viewBox='0 0 100 100' className='w-full' aria-hidden>
          <rect x='8' y='20' width='84' height='72' fill='none' stroke='currentColor' className='text-ink/15' />
          <line x1={8} y1={92} x2={8 + x1 * 84} y2={92 - y1 * 72} stroke='var(--accent)' strokeWidth='1' />
          <line x1={92} y1={20} x2={8 + x2 * 84} y2={92 - y2 * 72} stroke='var(--accent)' strokeWidth='1' />
          <path d={`M ${map(0, 0)} C ${map(x1, y1)} ${map(x2, y2)} ${map(1, 1)}`} fill='none' stroke='var(--ink)' strokeWidth='2' />
          <circle cx={8 + x1 * 84} cy={92 - y1 * 72} r='2.5' fill='var(--accent)' />
          <circle cx={8 + x2 * 84} cy={92 - y2 * 72} r='2.5' fill='var(--accent)' />
        </svg>
        <div className='relative h-10 rounded-full bg-paper'>
          <span
            aria-hidden
            className='absolute top-1 size-8 rounded-full bg-ink'
            style={{
              left: side === 'left' ? '0.25rem' : 'calc(100% - 2.25rem)',
              transitionProperty: 'left',
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: timing
            }}
          />
        </div>
      </div>
      <div className='mt-5 grid gap-4'>
        <div className='flex flex-wrap items-center gap-3'>
          <Segmented
            label='Curve'
            value={curve}
            onChange={setCurve}
            options={(Object.keys(CURVES) as CurveName[]).map((key) => ({ value: key, label: CURVES[key].label }))}
          />
        </div>
        <div className='grid grid-cols-[1fr_auto] items-end gap-4'>
          <Slider label='Duration' value={duration} min={150} max={1500} step={50} onChange={setDuration} format={(v) => `${v} ms`} />
          <button
            type='button'
            onClick={() => setSide((value) => (value === 'left' ? 'right' : 'left'))}
            className='rounded-full bg-ink px-5 py-2 text-[0.875rem] font-medium text-paper'
          >
            Run
          </button>
        </div>
        <code className='tabular block text-[0.8125rem] text-ink-muted'>{timing}</code>
      </div>
    </Experiment>
  );
}

/* ---------------------------------------------------------------- 07 ---- */

export function BalancedHeadline() {
  const [width, setWidth] = useState(88);
  const [wrap, setWrap] = useState<'wrap' | 'balance'>('wrap');
  return (
    <Experiment
      number={7}
      title='Balanced headlines'
      note='Narrow the column. Normal wrapping leaves a word stranded on the last line; balance shares the words out.'
    >
      <div className='rounded-2xl bg-surface p-4'>
        <div className='rounded-xl bg-white p-4 shadow-[inset_0_0_0_1px_rgba(17,17,17,0.08)]' style={{ width: `${width}%` }}>
          <p
            className='text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.015em] text-ink'
            style={{ textWrap: wrap }}
          >
            The agent should have a cursor, not a chat window
          </p>
        </div>
      </div>
      <div className='mt-5 grid gap-4'>
        <Slider label='Column width' value={width} min={45} max={100} onChange={setWidth} format={(v) => `${v}%`} />
        <Segmented
          label='Wrapping'
          value={wrap}
          onChange={setWrap}
          options={[
            { value: 'wrap', label: 'Normal' },
            { value: 'balance', label: 'Balance' }
          ]}
        />
      </div>
    </Experiment>
  );
}
