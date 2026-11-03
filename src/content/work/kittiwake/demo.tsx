import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { DemoCursor, useDirector } from '~/components/demo/director';
import { Stage, u } from '~/components/stage';
import type { DemoProps } from '~/content/types';
import { TagGlyph, Wordmark, soft } from './brand';
import { RouteMap } from './map';
import { dayAt, days, hoursLabel, stops } from './route';
import { fontFamily, palette } from './theme';

/** The finished state: day 3, Port Isaac to Tintagel, walked. */
const FINISHED_POS = 2;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** A number that can glide to a new value, one frame at a time, only while moving. */
function useGlide(initial: number) {
  const [value, setValue] = useState(initial);
  const ref = useRef(initial);
  const raf = useRef(0);
  const write = (v: number) => {
    ref.current = v;
    setValue(v);
  };
  const stop = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
  };
  const to = (target: number, duration: number) => {
    stop();
    const from = ref.current;
    if (duration <= 0 || Math.abs(from - target) < 0.001) {
      write(target);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      write(from + (target - from) * easeInOut(t));
      raf.current = t < 1 ? requestAnimationFrame(step) : 0;
    };
    raf.current = requestAnimationFrame(step);
  };
  // oxlint-disable-next-line react/exhaustive-effect-dependencies -- cancel the frame on unmount only
  useEffect(() => stop, []);
  return {
    value,
    ref,
    to,
    set: (v: number) => {
      stop();
      write(v);
    }
  };
}

/** Fade and lift content in when `token` changes. */
function Swap({ token, children, className }: { token: string | number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    ref.current?.animate(
      [
        { opacity: 0, transform: 'translateY(4px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 320, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
    );
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- a new token replays the fade
  }, [token]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

const BTN = 30;
const RAIL_W = 440;

export default function KittiwakeDemo({ variant = 'card' }: DemoProps) {
  const glide = useGlide(FINISHED_POS);
  const pos = glide.value;
  const [selected, setSelected] = useState(dayAt(FINISHED_POS));
  const stillRef = useRef(false);

  /** Walk (or rewind) to the end of a day. */
  const go = (target: number) => {
    const next = Math.max(1, Math.min(6, target));
    const from = glide.ref.current;
    const to = next - 1;
    const legs = Math.abs(to - from);
    const duration = stillRef.current
      ? 0
      : to > from
        ? 700 + 780 * Math.min(legs, 4)
        : 420 + 160 * legs;
    setSelected(next);
    glide.to(to, duration);
  };

  /** Drag the walker along the days (the loop's version of a scrub). */
  const scrubTo = (to: number, duration: number, signal: AbortSignal) => {
    const from = glide.ref.current;
    const start = performance.now();
    return new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (signal.aborted) return resolve();
        const t = Math.min(1, (now - start) / duration);
        const v = from + (to - from) * easeInOut(t);
        glide.set(v);
        setSelected(dayAt(v));
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  };

  const d = useDirector(async (x) => {
    await x.wait(1700);
    await x.move('day-1');
    await x.press();
    go(1);
    await x.wait(1300);
    await x.move('day-2');
    await x.press();
    go(2);
    await x.wait(2900);
    await x.move('day-3');
    await x.press();
    go(3);
    await x.wait(2900);
    // Drag along the days to Bude, watching the bags hop ahead.
    x.down();
    const scrub = scrubTo(5, 2600, x.signal);
    await x.move('day-6', { duration: 2600 });
    await scrub;
    x.up();
    await x.wait(1900);
    await x.move('day-3');
    await x.press();
    go(3);
    await x.wait(1600);
    x.hide();
    await x.wait(600);
  });
  useLayoutEffect(() => {
    stillRef.current = d.still;
  });

  const day = days[selected - 1];
  const night = stops[selected - 1];

  /* Rail: buttons for each day, and a drag along the line between them. */
  const railRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef<{ id: number; x: number; active: boolean } | null>(null);

  const posFromX = (clientX: number) => {
    const rect = railRef.current!.getBoundingClientRect();
    const inset = (rect.width * (BTN / 2)) / RAIL_W;
    const f = (clientX - rect.left - inset) / (rect.width - inset * 2);
    return Math.max(0, Math.min(5, f * 5));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, active: false };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    if (!state.active && Math.abs(event.clientX - state.x) > 5) {
      state.active = true;
      railRef.current?.setPointerCapture(event.pointerId);
    }
    if (state.active) {
      const v = posFromX(event.clientX);
      glide.set(v);
      setSelected(dayAt(v));
    }
  };
  const endDrag = () => {
    drag.current = null;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: selected + 1,
      ArrowDown: selected + 1,
      ArrowLeft: selected - 1,
      ArrowUp: selected - 1,
      Home: 1,
      End: 6
    };
    const target = keys[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = Math.max(1, Math.min(6, target));
    go(next);
    buttons.current[next - 1]?.focus();
  };

  const fill = pos / 5;

  return (
    <Stage
      width={520}
      height={416}
      innerRef={d.rootRef}
      style={{ fontFamily, color: palette.ink, ...soft }}
      data-variant={variant}
    >
      <div
        className='absolute flex flex-col'
        style={{
          left: u(22),
          top: u(20),
          right: u(22),
          bottom: u(20),
          background: palette.sand,
          borderRadius: u(18),
          padding: `${u(14)} ${u(18)} ${u(12)}`,
          boxShadow: `0 ${u(18)} ${u(40)} ${u(-18)} rgba(4, 24, 26, 0.6), 0 ${u(2)} ${u(5)} rgba(4, 24, 26, 0.18)`
        }}
      >
        <div className='flex items-end justify-between' style={{ height: u(30) }}>
          <Wordmark size={19} />
          <p style={{ fontSize: u(13), fontWeight: 540, paddingBottom: u(9) }}>
            Cornwall’s North Coast <span style={{ color: palette.inkSoft }}>· 6 days</span>
          </p>
        </div>

        <div className='flex' style={{ marginTop: u(12), gap: u(16), height: u(241) }}>
          <div
            className='relative shrink-0 overflow-hidden'
            style={{ width: u(214), borderRadius: u(12), boxShadow: `inset 0 0 0 1px ${palette.rule}` }}
          >
            <RouteMap pos={pos} width={214} />
          </div>

          <div className='flex min-w-0 flex-1 flex-col'>
            <Swap token={selected}>
              <p
                className='tabular'
                style={{
                  fontSize: u(11.5),
                  fontWeight: 640,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: palette.sea
                }}
              >
                Day {selected} of 6 · {day.km} km
              </p>
              <h3
                style={{
                  fontSize: u(21),
                  fontWeight: 600,
                  lineHeight: 1.08,
                  letterSpacing: '-0.01em',
                  marginTop: u(6),
                  minHeight: u(46),
                  textWrap: 'balance'
                }}
              >
                {day.title}
              </h3>
              <p style={{ fontSize: u(12.5), lineHeight: 1.36, color: palette.inkSoft, marginTop: u(6), minHeight: u(34) }}>
                {day.note}
              </p>
            </Swap>

            <div
              className='mt-auto grid'
              style={{
                gridTemplateColumns: '1fr 1fr',
                paddingTop: u(10),
                borderTop: `1px solid ${palette.rule}`,
                columnGap: u(10)
              }}
            >
              <Stat
                value={hoursLabel(day.hours)}
                label={selected === 1 ? 'hours, if you like' : 'hours of walking'}
                meter={day.hours / 7}
              />
              <Stat value={String(day.flights)} label='flights of stairs' meter={day.flights / 315} />
            </div>

            <div
              className='flex items-start'
              style={{ gap: u(8), marginTop: u(10), paddingTop: u(10), borderTop: `1px solid ${palette.rule}`, minHeight: u(45) }}
            >
              <TagGlyph size={17} style={{ marginTop: u(1) }} />
              <Swap token={selected}>
                <p style={{ fontSize: u(12.5), lineHeight: 1.34 }}>
                  {day.bags.replace(/ by .*/, '')}
                  {selected > 1 ? (
                    <>
                      {' '}
                      by <span className='tabular' style={{ fontWeight: 640 }}>{night.bagsBy}</span>
                    </>
                  ) : null}
                </p>
              </Swap>
            </div>
          </div>
        </div>

        {/* The day buttons inside are the focusable radios. */}
        {/* oxlint-disable-next-line jsx-a11y/interactive-supports-focus */}
        <div
          ref={railRef}
          role='radiogroup'
          aria-label='Day of the trip'
          className='relative'
          style={{ marginTop: u(12), height: u(48), touchAction: 'pan-y', cursor: 'ew-resize' }}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            aria-hidden
            className='absolute'
            style={{
              left: u(BTN / 2),
              right: u(BTN / 2),
              top: u(BTN / 2 - 1),
              height: u(2),
              borderRadius: u(1),
              background: palette.stone
            }}
          >
            <div className='absolute inset-y-0 left-0' style={{ width: `${fill * 100}%`, background: palette.sea, borderRadius: u(1) }} />
            <div
              className='absolute'
              style={{
                left: `${fill * 100}%`,
                top: '50%',
                width: u(11),
                height: u(11),
                marginLeft: u(-5.5),
                marginTop: u(-5.5),
                borderRadius: '50%',
                background: palette.beak,
                boxShadow: `0 0 0 ${u(1.4)} ${palette.ink}`
              }}
            />
          </div>
          {days.map((dd, i) => {
            const on = selected === dd.day;
            const past = dd.day < selected;
            return (
              <div
                key={dd.day}
                className='absolute flex flex-col items-center'
                style={{ left: u(BTN / 2 + (i * (RAIL_W - BTN)) / 5), top: 0, width: 0 }}
              >
                <button
                  ref={(el) => {
                    buttons.current[i] = el;
                  }}
                  type='button'
                  role='radio'
                  aria-checked={on}
                  aria-label={`Day ${dd.day}: ${dd.title}`}
                  tabIndex={on ? 0 : -1}
                  data-target={`day-${dd.day}`}
                  onClick={() => go(dd.day)}
                  className='tabular relative flex shrink-0 items-center justify-center rounded-full transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A3438]'
                  style={{
                    width: u(BTN),
                    height: u(BTN),
                    fontSize: u(13.5),
                    fontWeight: 650,
                    cursor: 'pointer',
                    background: on ? palette.deep : palette.sand,
                    color: on ? palette.sand : past ? palette.sea : palette.inkSoft,
                    boxShadow: on ? 'none' : `inset 0 0 0 ${u(1.5)} ${past ? palette.sea : palette.stone}`
                  }}
                >
                  {dd.day}
                </button>
                <span
                  aria-hidden
                  className='whitespace-nowrap'
                  style={{
                    fontSize: u(11),
                    marginTop: u(4),
                    color: on ? palette.ink : palette.inkSoft,
                    fontWeight: on ? 620 : 460
                  }}
                >
                  {stops[i].short}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <DemoCursor cursor={d.cursor} color={palette.ink} ink={palette.sand} />
    </Stage>
  );
}

function Stat({ value, label, meter }: { value: string; label: string; meter: number }) {
  return (
    <div className='min-w-0'>
      <p className='tabular' style={{ fontSize: u(26), fontWeight: 560, lineHeight: 1, letterSpacing: '-0.01em' }}>
        {value}
      </p>
      <p style={{ fontSize: u(11.5), color: palette.inkSoft, marginTop: u(4), lineHeight: 1.2 }}>{label}</p>
      <div aria-hidden className='flex' style={{ gap: u(2), marginTop: u(7) }}>
        {Array.from({ length: 7 }, (_, i) => {
          const amount = Math.max(0, Math.min(1, meter * 7 - i));
          return (
            <span
              key={i}
              className='relative overflow-hidden'
              style={{ width: u(11), height: u(4), borderRadius: u(1), background: palette.rule }}
            >
              <span
                className='absolute inset-y-0 left-0 transition-[width] duration-300'
                style={{ width: `${amount * 100}%`, background: palette.sea }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
