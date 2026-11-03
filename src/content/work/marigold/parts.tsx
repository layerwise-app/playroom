import type { CSSProperties, ReactNode } from 'react';
import { u } from '~/components/stage';
import { cn } from '~/lib/utils';
import { palette } from './theme';

/* ------------------------------------------------------------------ */
/* Ada's medications, as Northside's nurse entered them                */
/* ------------------------------------------------------------------ */

export type Tone = 'white' | 'yellow' | 'pink' | 'peach' | 'blue';
export type PillShape = 'round' | 'oval' | 'capsule';

export type Pill = {
  id: string;
  name: string;
  dose: string;
  /** How it looks, in the words Ada would use. */
  looks: string;
  /** What it's for, in plain language. */
  purpose: string;
  shape: PillShape;
  tones: [Tone] | [Tone, Tone];
  /** Drawn size in pill units (the drawing box is 48 × 30). */
  w: number;
  h: number;
  score?: boolean;
};

export const pills = {
  amlodipine: {
    id: 'amlodipine',
    name: 'Amlodipine',
    dose: '5 mg',
    looks: 'Small white round',
    purpose: 'for blood pressure',
    shape: 'round',
    tones: ['white'],
    w: 19,
    h: 19,
    score: true
  },
  metformin: {
    id: 'metformin',
    name: 'Metformin',
    dose: '500 mg',
    looks: 'Small yellow oval',
    purpose: 'for blood sugar',
    shape: 'oval',
    tones: ['yellow'],
    w: 27,
    h: 16
  },
  omeprazole: {
    id: 'omeprazole',
    name: 'Omeprazole',
    dose: '20 mg',
    looks: 'Pink-and-white capsule',
    purpose: 'for heartburn',
    shape: 'capsule',
    tones: ['pink', 'white'],
    w: 37,
    h: 15
  },
  atorvastatin: {
    id: 'atorvastatin',
    name: 'Atorvastatin',
    dose: '20 mg',
    looks: 'Peach oval',
    purpose: 'for cholesterol',
    shape: 'oval',
    tones: ['peach'],
    w: 33,
    h: 18
  },
  gabapentin: {
    id: 'gabapentin',
    name: 'Gabapentin',
    dose: '100 mg',
    looks: 'Small blue capsule',
    purpose: 'for nerve pain',
    shape: 'capsule',
    tones: ['blue', 'blue'],
    w: 30,
    h: 13
  }
} satisfies Record<string, Pill>;

export type SlotId = 'morning' | 'midday' | 'evening' | 'bedtime';

export type Slot = {
  id: SlotId;
  label: string;
  time: string;
  pills: Pill[];
};

export const slots: Slot[] = [
  {
    id: 'morning',
    label: 'Morning',
    time: '8:00 am',
    pills: [pills.amlodipine, pills.metformin, pills.omeprazole]
  },
  { id: 'midday', label: 'Midday', time: '1:00 pm', pills: [pills.metformin] },
  {
    id: 'evening',
    label: 'Evening',
    time: '6:00 pm',
    pills: [pills.metformin, pills.atorvastatin]
  },
  { id: 'bedtime', label: 'Bedtime', time: '9:00 pm', pills: [pills.gabapentin] }
];

export const slotById = (id: SlotId) => slots.find((slot) => slot.id === id) ?? slots[0];

export const pillCount = (slot: Slot) =>
  `${slot.pills.length} ${slot.pills.length === 1 ? 'pill' : 'pills'}`;

/* ------------------------------------------------------------------ */
/* Pill drawings: color and shape, the way people recognize them       */
/* ------------------------------------------------------------------ */

const tones: Record<Tone, { face: string; edge: string; line: string }> = {
  white: { face: '#FFFFFF', edge: '#D8CEBA', line: '#C7BBA3' },
  yellow: { face: '#F7D45E', edge: '#D5AC31', line: '#C49C25' },
  pink: { face: '#F3A5B7', edge: '#D7829A', line: '#C9748C' },
  peach: { face: '#F8C6A0', edge: '#DB9F74', line: '#CC9068' },
  blue: { face: '#9FC5EA', edge: '#6F9DCB', line: '#5F8EBD' }
};

export function PillArt({
  pill,
  size = 48,
  className,
  style
}: {
  pill: Pill;
  /** Width of the drawing box in stage units. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const cx = 24;
  const cy = 14;
  const lift = 1.7;
  const [a, b = a] = pill.tones;
  const ta = tones[a];
  const tb = tones[b];
  let body: ReactNode;

  if (pill.shape === 'round' || pill.shape === 'oval') {
    const rx = pill.w / 2;
    const ry = pill.h / 2;
    body = (
      <>
        <ellipse cx={cx} cy={cy + lift} rx={rx} ry={ry} fill={ta.edge} />
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={ta.face}
          stroke={ta.edge}
          strokeWidth={0.7}
        />
        {pill.score ? (
          <line
            x1={cx - rx * 0.62}
            y1={cy}
            x2={cx + rx * 0.62}
            y2={cy}
            stroke={ta.line}
            strokeWidth={0.9}
            strokeLinecap='round'
          />
        ) : null}
        <ellipse
          cx={cx - rx * 0.32}
          cy={cy - ry * 0.48}
          rx={rx * 0.34}
          ry={ry * 0.17}
          fill='#FFFFFF'
          opacity={a === 'white' ? 0 : 0.5}
        />
      </>
    );
  } else {
    const r = pill.h / 2;
    const x0 = cx - pill.w / 2;
    const x2 = cx + pill.w / 2;
    const top = cy - r;
    const bottom = cy + r;
    const left = (dy: number) =>
      `M ${cx} ${top + dy} H ${x0 + r} A ${r} ${r} 0 0 0 ${x0 + r} ${bottom + dy} H ${cx} Z`;
    const right = (dy: number) =>
      `M ${cx} ${top + dy} H ${x2 - r} A ${r} ${r} 0 0 1 ${x2 - r} ${bottom + dy} H ${cx} Z`;
    body = (
      <>
        <path d={left(lift)} fill={ta.edge} />
        <path d={right(lift)} fill={tb.edge} />
        <path d={left(0)} fill={ta.face} stroke={ta.edge} strokeWidth={0.7} />
        <path d={right(0)} fill={tb.face} stroke={tb.edge} strokeWidth={0.7} />
        <line
          x1={cx}
          y1={top + 0.4}
          x2={cx}
          y2={bottom - 0.4}
          stroke={b === a ? ta.line : ta.edge}
          strokeWidth={0.8}
        />
        <rect
          x={x0 + r * 0.8}
          y={top + pill.h * 0.2}
          width={pill.w - r * 1.6}
          height={pill.h * 0.13}
          rx={pill.h * 0.065}
          fill='#FFFFFF'
          opacity={0.55}
        />
      </>
    );
  }

  return (
    <svg
      viewBox='0 0 48 30'
      aria-hidden
      className={cn('block shrink-0', className)}
      style={{ width: u(size), height: u((size * 30) / 48), overflow: 'visible', ...style }}
    >
      <ellipse
        cx={cx}
        cy={cy + pill.h / 2 + 4.2}
        rx={pill.w * 0.46}
        ry={1.5}
        fill='rgba(90,64,20,0.13)'
      />
      {body}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The day ring: four times of day, answers "did I already take it?"   */
/* ------------------------------------------------------------------ */

export type DoseState = 'done' | 'due' | 'later';

const ringColors = {
  track: '#E7D8B6',
  due: palette.marigold,
  done: palette.green
};

function arcPath(r: number, start: number, end: number) {
  const point = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return `${(50 + r * Math.sin(rad)).toFixed(3)} ${(50 - r * Math.cos(rad)).toFixed(3)}`;
  };
  return `M ${point(start)} A ${r} ${r} 0 0 1 ${point(end)}`;
}

export function DayRing({
  size,
  thickness,
  states,
  selected,
  gap = 9,
  pulse = false,
  children,
  className,
  style
}: {
  size: number;
  /** Stroke width in stage units. */
  thickness: number;
  states: Record<SlotId, DoseState>;
  selected?: SlotId | null;
  /** Visible gap between segments, in degrees. */
  gap?: number;
  /** Breathe the segment that's due now (live demo only). */
  pulse?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const sw = (thickness * 100) / size;
  const r = 50 - sw / 2 - 2;
  const capDeg = ((sw / r) * 180) / Math.PI;
  const half = (gap + capDeg) / 2;

  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: u(size), height: u(size), ...style }}
    >
      <svg viewBox='0 0 100 100' aria-hidden className='absolute inset-0 size-full' style={{ overflow: 'visible' }}>
        {slots.map((slot, i) => {
          const d = arcPath(r, i * 90 + half, (i + 1) * 90 - half);
          const state = states[slot.id];
          const isSelected = selected === slot.id;
          const width = isSelected ? sw * 1.45 : sw;
          return (
            <g key={slot.id}>
              <path
                d={d}
                fill='none'
                stroke={state === 'due' ? ringColors.due : ringColors.track}
                strokeWidth={width}
                strokeLinecap='round'
                className={pulse && state === 'due' ? 'mg-due' : undefined}
                style={{ transition: 'stroke 500ms ease, stroke-width 300ms ease' }}
              />
              <path
                d={d}
                fill='none'
                stroke={ringColors.done}
                strokeWidth={width}
                strokeLinecap='round'
                pathLength={100}
                strokeDasharray='100 100'
                style={{
                  strokeDashoffset: state === 'done' ? 0 : 100,
                  opacity: state === 'done' ? 1 : 0,
                  transition:
                    state === 'done'
                      ? 'stroke-dashoffset 1100ms cubic-bezier(0.45, 0, 0.2, 1) 150ms, opacity 1ms linear 150ms, stroke-width 300ms ease'
                      : 'stroke-dashoffset 500ms ease, opacity 1ms linear 500ms, stroke-width 300ms ease'
                }}
              />
            </g>
          );
        })}
      </svg>
      {children ? (
        <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
          {children}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small functional glyphs                                             */
/* ------------------------------------------------------------------ */

type GlyphProps = { size?: number; color?: string; className?: string; style?: CSSProperties };

export function CheckGlyph({ size = 16, color = 'currentColor', className, style }: GlyphProps) {
  return (
    <svg
      viewBox='0 0 16 16'
      aria-hidden
      className={cn('block shrink-0', className)}
      style={{ width: u(size), height: u(size), ...style }}
    >
      <path
        d='M3.2 8.6 L6.6 11.8 L12.9 4.6'
        fill='none'
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

/** A soft chime: a small bell-less dot with two sound arcs. */
export function ChimeGlyph({
  size = 18,
  color = 'currentColor',
  ringing = false,
  className,
  style
}: GlyphProps & { ringing?: boolean }) {
  return (
    <svg
      viewBox='0 0 18 18'
      aria-hidden
      className={cn('block shrink-0', className)}
      style={{ width: u(size), height: u(size), overflow: 'visible', ...style }}
    >
      <circle cx={5.5} cy={9} r={2.6} fill={color} />
      <path
        d='M9.6 5.6 Q11.4 9 9.6 12.4'
        fill='none'
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap='round'
        className={ringing ? 'mg-wave mg-wave-1' : undefined}
      />
      <path
        d='M12.6 3.4 Q15.6 9 12.6 14.6'
        fill='none'
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap='round'
        className={ringing ? 'mg-wave mg-wave-2' : undefined}
      />
    </svg>
  );
}

export function SpeakerGlyph({ size = 18, color = 'currentColor', className, style }: GlyphProps) {
  return (
    <svg
      viewBox='0 0 18 18'
      aria-hidden
      className={cn('block shrink-0', className)}
      style={{ width: u(size), height: u(size), ...style }}
    >
      <path d='M2.5 6.6 H5.4 L9.4 3.4 V14.6 L5.4 11.4 H2.5 Z' fill={color} strokeLinejoin='round' />
      <path
        d='M12 6.2 Q13.6 9 12 11.8 M14.3 4.2 Q17 9 14.3 13.8'
        fill='none'
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap='round'
      />
    </svg>
  );
}

export function TextGlyph({ size = 18, color = 'currentColor', className, style }: GlyphProps) {
  return (
    <svg
      viewBox='0 0 18 18'
      aria-hidden
      className={cn('block shrink-0', className)}
      style={{ width: u(size), height: u(size), ...style }}
    >
      <path
        d='M3 4.2 H15 Q16 4.2 16 5.2 V11.6 Q16 12.6 15 12.6 H8.2 L4.6 15.4 V12.6 H3 Q2 12.6 2 11.6 V5.2 Q2 4.2 3 4.2 Z'
        fill='none'
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin='round'
      />
    </svg>
  );
}

export function ResetGlyph({ size = 14, color = 'currentColor', className, style }: GlyphProps) {
  return (
    <svg
      viewBox='0 0 16 16'
      aria-hidden
      className={cn('block shrink-0', className)}
      style={{ width: u(size), height: u(size), ...style }}
    >
      <path
        d='M3.4 8.2 A4.8 4.8 0 1 0 5 4.4'
        fill='none'
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap='round'
      />
      <path d='M2.4 2.6 L5.6 4 L3.6 6.8' fill='none' stroke={color} strokeWidth={1.8} strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

export function PhoneGlyph({ size = 16, color = 'currentColor', className, style }: GlyphProps) {
  return (
    <svg
      viewBox='0 0 16 16'
      aria-hidden
      className={cn('block shrink-0', className)}
      style={{ width: u(size), height: u(size), ...style }}
    >
      <path
        d='M4.6 1.8 L6.6 4.8 L5.3 6.4 Q6.6 9.3 9.6 10.7 L11.2 9.4 L14.2 11.4 L13.2 13.6 Q12.6 14.4 11.4 14.2 Q4.4 12.6 1.8 4.6 Q1.6 3.4 2.4 2.8 Z'
        fill={color}
      />
    </svg>
  );
}

/** The Marigold mark: a small flower of four petals around a dot. */
export function MarigoldMark({ size = 16, className, style }: Omit<GlyphProps, 'color'>) {
  return (
    <svg
      viewBox='0 0 20 20'
      aria-hidden
      className={cn('block shrink-0', className)}
      style={{ width: u(size), height: u(size), ...style }}
    >
      {[0, 45, 90, 135].map((deg) => (
        <ellipse
          key={deg}
          cx={10}
          cy={10}
          rx={8.6}
          ry={3.6}
          fill={palette.marigold}
          transform={`rotate(${deg} 10 10)`}
          opacity={0.92}
        />
      ))}
      <circle cx={10} cy={10} r={3.1} fill={palette.green} />
    </svg>
  );
}

/** Keyframes the screens share. Rendered once per stage. */
export function MarigoldStyles() {
  return (
    <style>{`
@keyframes mg-due { 0%, 100% { opacity: 1 } 50% { opacity: .5 } }
@keyframes mg-pulse { 0% { box-shadow: 0 0 0 0 rgba(244,166,33,.55) } 100% { box-shadow: 0 0 0 calc(var(--u) * 16) rgba(244,166,33,0) } }
@keyframes mg-wave { 0%, 100% { opacity: 1 } 50% { opacity: .2 } }
@keyframes mg-arrive { 0% { opacity: 0; transform: translateY(calc(var(--u) * 6)) } 100% { opacity: 1; transform: none } }
@keyframes mg-glow { 0% { background-color: #FFE9B8 } 100% { background-color: rgba(255,233,184,0) } }
.mg-due { animation: mg-due 2.4s ease-in-out infinite }
.mg-wave { animation: mg-wave 1.2s ease-in-out 3 }
.mg-wave-2 { animation-delay: .25s }
.mg-pulse { animation: mg-pulse 1.8s ease-out 2 }
.mg-focus:focus-visible { outline: 2px solid #1E3A2E; outline-offset: 2px }
.mg-focus-ink:focus-visible { outline: 2px solid #1F1A12; outline-offset: 2px }
.mg-press { transition: transform 120ms ease }
.mg-press:active { transform: scale(.98) }
.mg-arrive { animation: mg-arrive 700ms cubic-bezier(.2,.8,.2,1) both, mg-glow 2.4s ease-out both }
`}</style>
  );
}
