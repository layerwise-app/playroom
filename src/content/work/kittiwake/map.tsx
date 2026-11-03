import { useEffect, useId, useRef } from 'react';
import type { CSSProperties } from 'react';
import { u } from '~/components/stage';
import {
  ROUTE_LENGTH,
  dayAt,
  eastCoastPath,
  eastLandPath,
  lengthAt,
  pointAt,
  routePath,
  stopLengths,
  stopPoints,
  stops,
  westCoastPath,
  westLandPath
} from './route';
import { palette } from './theme';

/** The part of the coast the trip map shows, in map units. */
export const ROUTE_VIEW = { x: 6, y: 0, w: 322, h: 362 };

type View = { x: number; y: number; w: number; h: number };

const CONTOURS = [
  { dx: 9, dy: 7, opacity: 0.9 },
  { dx: 20, dy: 15, opacity: 0.6 },
  { dx: 34, dy: 25, opacity: 0.35 }
];

const ECHOES = [
  { dx: -5.5, dy: -4.5, opacity: 0.42 },
  { dx: -11, dy: -9, opacity: 0.26 },
  { dx: -16.5, dy: -13.5, opacity: 0.14 }
];

/**
 * The trip map in the tide-line style: one line for the coast, echoed out to
 * sea. The route rides the coast itself: past days in sea, today in deep,
 * the walker in beak yellow, and a tag at tonight's inn.
 */
export function RouteMap({
  pos,
  width,
  view = ROUTE_VIEW,
  labels = 'all',
  sea = palette.foam,
  land = '#EEE4D1',
  showBags = true,
  showScale = true,
  className,
  style
}: {
  /** 0 is Padstow, 5 is Bude; fractional while walking. */
  pos: number;
  /** Rendered width in stage units, so strokes and labels keep their size. */
  width: number;
  view?: View;
  labels?: 'all' | 'leg' | 'none';
  sea?: string;
  land?: string;
  showBags?: boolean;
  showScale?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const clipId = `kw-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const k = view.w / width; // map units per stage unit
  const day = dayAt(pos);
  const night = day - 1;
  const from = Math.max(0, day - 2);
  const nowLen = lengthAt(pos);
  const legStart = day >= 2 ? stopLengths[from] : 0;
  const walker = pointAt(nowLen);
  const bags = stopPoints[night];

  const bagsRef = useRef<SVGGElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    bagsRef.current?.animate(
      [
        { transform: 'translateY(0) scale(1)' },
        { transform: `translateY(${-14 * k}px) scale(1.08)`, offset: 0.45 },
        { transform: 'translateY(0) scale(1)' }
      ],
      { duration: 620, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)' }
    );
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- the bags bounce when the night changes
  }, [night, k]);

  const label = (i: number) => {
    if (labels === 'none') return false;
    if (labels === 'all') return true;
    return i === night || (day >= 2 && i === from);
  };

  return (
    <svg
      viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
      className={className}
      style={{ display: 'block', width: u(width), height: u((width * view.h) / view.w), ...style }}
      role='img'
      aria-label={`Map of the coast path from Padstow to Bude. ${
        day === 1 ? 'Day 1, arriving in Padstow.' : `Day ${day}, ${stops[from].name} to ${stops[night].name}.`
      }`}
    >
      <rect x={view.x - 30} y={view.y - 30} width={view.w + 60} height={view.h + 60} fill={sea} />
      <defs>
        <clipPath id={clipId}>
          <path d='M-60 -60 H400 V440 H84 V316 H-60 Z' />
        </clipPath>
      </defs>
      {/* Tide-lines: the coast echoed out to sea, kept out of the estuary. */}
      <g fill='none' stroke={palette.sea} strokeWidth={0.9 * k} strokeLinejoin='round' clipPath={`url(#${clipId})`}>
        {ECHOES.map((e) => (
          <g key={e.dx} transform={`translate(${e.dx * k * 0.9} ${e.dy * k * 0.9})`} opacity={e.opacity}>
            <path d={eastCoastPath} />
            <path d={westCoastPath} />
          </g>
        ))}
      </g>
      <path d={westLandPath} fill={land} />
      <path d={eastLandPath} fill={land} />
      {/* Inland, the same line again, fainter: the land's own contours. */}
      <g fill='none' stroke={palette.stone} strokeWidth={0.9 * k} clipPath={`url(#${clipId})`}>
        {CONTOURS.map((e) => (
          <path key={e.dx} d={eastCoastPath} transform={`translate(${e.dx * k} ${e.dy * k})`} opacity={e.opacity} />
        ))}
      </g>
      <g fill='none' stroke={palette.ink} strokeWidth={1.25 * k} strokeLinejoin='round' strokeLinecap='round'>
        <path d={eastCoastPath} />
        <path d={westCoastPath} />
      </g>

      {/* Days already walked, then today so far. */}
      <path
        d={routePath}
        pathLength={ROUTE_LENGTH}
        fill='none'
        stroke={palette.sea}
        strokeOpacity={0.55}
        strokeWidth={3 * k}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeDasharray={`${legStart} ${ROUTE_LENGTH * 2}`}
      />
      {nowLen > legStart ? (
        <path
          d={routePath}
          pathLength={ROUTE_LENGTH}
          fill='none'
          stroke={palette.deep}
          strokeWidth={3.6 * k}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeDasharray={`0 ${legStart} ${nowLen - legStart} ${ROUTE_LENGTH * 2}`}
        />
      ) : null}

      {stopPoints.map((p, i) => {
        const on = i === night || (day >= 2 && i === from);
        const align = mapLabel[i];
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={(on ? 3.6 : 2.9) * k}
              fill={i < night || (i === 0 && day > 1) ? palette.sea : palette.sand}
              stroke={palette.ink}
              strokeWidth={1.2 * k}
            />
            {label(i) ? (
              <text
                x={p.x + align.dx * k}
                y={p.y + align.dy * k}
                textAnchor={align.anchor}
                fill={on ? palette.ink : palette.inkSoft}
                stroke={i === 2 || i >= 4 ? sea : land}
                strokeWidth={3.2 * k}
                strokeLinejoin='round'
                paintOrder='stroke'
                style={{ fontSize: 11.5 * k, fontWeight: on ? 640 : 480, fontVariationSettings: '"SOFT" 100' }}
              >
                {align.short ? stops[i].short : stops[i].name}
              </text>
            ) : null}
          </g>
        );
      })}

      {showBags ? (
        <g style={{ transform: `translate(${bags.x}px, ${bags.y}px)`, transition: 'transform 620ms cubic-bezier(0.3, 0.7, 0.4, 1)' }}>
          <g ref={bagsRef}>
            <g transform={`translate(${-7 * k} ${-21.5 * k}) scale(${k})`}>
              <path d='M7 22 V18' stroke={palette.ink} strokeWidth='1.2' />
              <rect x='0' y='3' width='14' height='15' rx='2.4' fill={palette.ink} />
              <path d='M4.4 3 V1.4 a1 1 0 0 1 1 -1 h3.2 a1 1 0 0 1 1 1 V3' fill='none' stroke={palette.ink} strokeWidth='1.3' />
              <path d='M4 7.5 V14 M10 7.5 V14' stroke={palette.beak} strokeWidth='1.3' strokeLinecap='round' />
            </g>
          </g>
        </g>
      ) : null}

      <g transform={`translate(${walker.x} ${walker.y})`}>
        <circle r={7.5 * k} fill={palette.beak} opacity={0.28} />
        <circle r={4.6 * k} fill={palette.beak} stroke={palette.ink} strokeWidth={1.4 * k} />
      </g>

      {showScale ? (
        <g transform={`translate(${view.x + view.w - 14 * k} ${view.y + view.h - 14 * k})`} fill={palette.inkSoft}>
          <path d={`M${-50} 0 H0`} stroke={palette.inkSoft} strokeWidth={1.2 * k} />
          <path d={`M${-50} ${-3 * k} V0 M0 ${-3 * k} V0`} stroke={palette.inkSoft} strokeWidth={1.2 * k} />
          <text x={-25} y={-5 * k} textAnchor='middle' style={{ fontSize: 11 * k }}>
            5 km
          </text>
        </g>
      ) : null}
    </svg>
  );
}

/** Where each stop's name sits, in stage units from the stop. */
const mapLabel: { dx: number; dy: number; anchor: 'start' | 'end' | 'middle'; short?: boolean }[] = [
  { dx: 9, dy: 4, anchor: 'start' },
  { dx: 2, dy: 17, anchor: 'start' },
  { dx: -8, dy: 2, anchor: 'end' },
  { dx: 8, dy: 9, anchor: 'start' },
  { dx: -8, dy: 2, anchor: 'end', short: true },
  { dx: -8, dy: 4, anchor: 'end' }
];
