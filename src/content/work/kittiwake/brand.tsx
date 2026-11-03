import type { CSSProperties } from 'react';
import { u } from '~/components/stage';
import { tideLine } from './route';
import { palette } from './theme';

/** Fraunces with the Softness axis all the way up. */
export const soft: CSSProperties = { fontVariationSettings: '"SOFT" 100, "WONK" 0' };

const LINE_W = 100;
const LINE_H = 9;
const lineD = tideLine(LINE_W, LINE_H);

/** The tide-line: the coast from Pentire Point to Bude, laid level. */
export function TideLine({
  width,
  color = palette.ink,
  stroke = 1.6,
  dot = true,
  className,
  style
}: {
  /** Width in stage units. */
  width: number;
  color?: string;
  stroke?: number;
  dot?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const h = (width * LINE_H) / LINE_W;
  const k = LINE_W / width;
  return (
    <svg
      aria-hidden
      viewBox={`-2 -2 ${LINE_W + 4} ${LINE_H + 4}`}
      className={className}
      style={{ width: u(width + 4 / k), height: u(h + 4 / k), display: 'block', overflow: 'visible', ...style }}
    >
      <path d={lineD} fill='none' stroke={color} strokeWidth={stroke * k} strokeLinecap='round' strokeLinejoin='round' />
      {dot ? <circle cx={0} cy={startY} r={stroke * k * 1.9} fill={palette.beak} stroke={color} strokeWidth={stroke * k * 0.55} /> : null}
    </svg>
  );
}

const startY = Number(lineD.split(/[MC ]/).filter(Boolean)[1]);

/** The wordmark: Kittiwake in soft Fraunces, set on its tide-line. */
export function Wordmark({
  size = 22,
  color = palette.ink,
  lineColor,
  dot = true,
  className,
  style
}: {
  /** Cap size in stage units. */
  size?: number;
  color?: string;
  lineColor?: string;
  dot?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const width = size * 4.55;
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', flexDirection: 'column', color, lineHeight: 1, ...style }}
    >
      <span
        style={{
          ...soft,
          fontSize: u(size),
          fontWeight: 620,
          letterSpacing: '-0.012em',
          lineHeight: 1
        }}
      >
        Kittiwake
      </span>
      <TideLine
        width={width}
        color={lineColor ?? color}
        stroke={Math.max(1.1, size * 0.05)}
        dot={dot}
        style={{ marginTop: u(size * 0.08), marginLeft: u(size * 0.02) }}
      />
    </span>
  );
}

/** A small luggage tag, for "your bags". */
export function TagGlyph({
  size = 16,
  color = palette.ink,
  fill = palette.sand,
  style
}: {
  size?: number;
  color?: string;
  fill?: string;
  style?: CSSProperties;
}) {
  return (
    <svg aria-hidden viewBox='0 0 16 16' style={{ width: u(size), height: u(size), display: 'block', flexShrink: 0, ...style }}>
      <path
        d='M2.2 5.2 L5.6 1.8 H13 a1.2 1.2 0 0 1 1.2 1.2 V13 a1.2 1.2 0 0 1 -1.2 1.2 H5.6 L2.2 10.8 Z'
        transform='rotate(90 8 8)'
        fill={fill}
        stroke={color}
        strokeWidth='1.3'
        strokeLinejoin='round'
      />
      <circle cx='8' cy='4.6' r='1.25' fill={palette.beak} stroke={color} strokeWidth='0.9' />
      <path d='M5.4 9.4 H10.6 M5.4 11.6 H9' stroke={color} strokeWidth='1.1' strokeLinecap='round' />
    </svg>
  );
}
