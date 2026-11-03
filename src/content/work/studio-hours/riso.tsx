import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { u } from '~/components/stage';
import { palette } from './theme';

/*
 * Risograph print primitives. A print is two ink layers (the library riso's
 * pink and blue drums) on paper. Each layer gets ink grain and rough edges
 * from an SVG filter, the blue drum is printed slightly out of register, and
 * where blue lands on pink the overprint color shows through a mask of the
 * pink layer. Ink layers multiply onto the paper so its tooth shows.
 */

export type Ids = {
  /** Halftone screen: use as `mask={ids.screen}` on a shape to print it as a tint. */
  screen: string;
  /** A coarser screen for big areas. */
  coarse: string;
};

type Layer = ReactNode | ((ids: Ids) => ReactNode);

const render = (layer: Layer | undefined, ids: Ids) =>
  typeof layer === 'function' ? layer(ids) : layer;

function useSvgId(prefix: string) {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

const svgUrl = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' '))}")`;

/** Newsprint tooth: fine dark specks plus faint horizontal fibers. Tile it. */
export const paperGrain = svgUrl(`
<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>
  <filter id='a' x='0' y='0'>
    <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='11' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 0.16 0 0 0 0 0.14 0 0 0 0 0.2 0 0 0 0.9 -0.42'/>
  </filter>
  <filter id='b' x='0' y='0'>
    <feTurbulence type='fractalNoise' baseFrequency='0.035 0.45' numOctaves='2' seed='4' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 0.3 0 0 0 0 0.25 0 0 0 0 0.2 0 0 0 0.34 -0.15'/>
  </filter>
  <rect width='220' height='220' filter='url(#b)'/>
  <rect width='220' height='220' filter='url(#a)'/>
</svg>`);

/** Ink grain for flat color fills done in CSS (notes, chips). */
export const inkGrain = svgUrl(`
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
  <filter id='a' x='0' y='0'>
    <feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' seed='3' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.1 -0.62'/>
  </filter>
  <rect width='160' height='160' filter='url(#a)'/>
</svg>`);

/** CSS background for a flat riso surface: grain over a color. */
export function riso(color: string, size = 180, grain: 'paper' | 'ink' = 'paper'): CSSProperties {
  return {
    backgroundColor: color,
    backgroundImage: grain === 'paper' ? paperGrain : `${inkGrain}, ${paperGrain}`,
    backgroundSize: grain === 'paper' ? `${u(size)} ${u(size)}` : `${u(size * 0.7)} ${u(size * 0.7)}, ${u(size)} ${u(size)}`
  };
}

/** Pale screen tints of each ink, for notes and quiet fills. */
export const tint = {
  pink: '#FCCFE3',
  blue: '#C9E0EF',
  over: '#DCD3E6',
  paper: palette.paper
};

/** Darker versions of each ink, for small text on its tint (all at least 4.5:1). */
export const deep = {
  pink: '#9A2C78',
  blue: '#075C96',
  over: '#4E3585'
};

type RisoPrintProps = {
  /** viewBox size. */
  width: number;
  height: number;
  pink?: Layer;
  blue?: Layer;
  paper?: string;
  /** Blue drum offset from the pink, in viewBox units. */
  shift?: [number, number];
  /** Blue drum rotation in degrees. */
  skew?: number;
  seed?: number;
  /** `pink` or `blue` prints one drum's master in black, the way the generator exports it. */
  mode?: 'both' | 'pink' | 'blue';
  /** Grain size: higher numbers mean finer grain. */
  grain?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
  /** Drawn on the paper under both inks. */
  under?: ReactNode;
  /** Multiply the inks onto what's behind. Turn off to print onto a colored field. */
  blend?: boolean;
};

export function RisoPrint({
  width,
  height,
  pink,
  blue,
  paper = palette.paper,
  shift = [1.4, -1],
  skew = 0.25,
  seed = 3,
  mode = 'both',
  grain = 0.9,
  label,
  className,
  style,
  under,
  blend = true
}: RisoPrintProps) {
  const id = useSvgId('riso');
  const ids: Ids = { screen: `url(#${id}-scr)`, coarse: `url(#${id}-crs)` };
  const blueT = `translate(${shift[0]} ${shift[1]}) rotate(${skew} ${width / 2} ${height / 2})`;
  const master = mode !== 'both';
  const masterInk = '#1D1C1F';
  const pad = 20;
  const multiply: CSSProperties = blend ? { mixBlendMode: 'multiply' } : {};

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ display: 'block', ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <filter
          id={`${id}-ink`}
          filterUnits='userSpaceOnUse'
          x={-pad}
          y={-pad}
          width={width + pad * 2}
          height={height + pad * 2}
          colorInterpolationFilters='sRGB'
        >
          <feTurbulence type='fractalNoise' baseFrequency='0.07' numOctaves='2' seed={seed} result='warp' />
          <feDisplacementMap in='SourceGraphic' in2='warp' scale='1.8' xChannelSelector='R' yChannelSelector='G' result='rough' />
          <feTurbulence type='fractalNoise' baseFrequency={grain} numOctaves='2' seed={seed + 5} result='grain' />
          <feColorMatrix in='grain' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4.4 3.55' result='speck' />
          <feTurbulence type='fractalNoise' baseFrequency='0.011' numOctaves='2' seed={seed + 9} result='mottle' />
          <feColorMatrix in='mottle' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.75 0.66' result='density' />
          <feComposite in='speck' in2='density' operator='arithmetic' k1='1' k2='0' k3='0' k4='0' result='mask' />
          <feComposite in='rough' in2='mask' operator='in' />
        </filter>
        <filter id={`${id}-tooth`} x='0' y='0' width='100%' height='100%' colorInterpolationFilters='sRGB'>
          <feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' seed={seed + 2} />
          <feColorMatrix values='0 0 0 0 0.2  0 0 0 0 0.17  0 0 0 0 0.22  0 0 0 0.7 -0.33' />
        </filter>
        <pattern id={`${id}-dot`} width='3.2' height='3.2' patternUnits='userSpaceOnUse' patternTransform='rotate(22)'>
          <circle cx='1.6' cy='1.6' r='0.95' fill='#fff' />
        </pattern>
        <pattern id={`${id}-dot2`} width='5' height='5' patternUnits='userSpaceOnUse' patternTransform='rotate(-15)'>
          <circle cx='2.5' cy='2.5' r='1.25' fill='#fff' />
        </pattern>
        <mask id={`${id}-scr`} maskUnits='userSpaceOnUse' x={-pad} y={-pad} width={width + pad * 2} height={height + pad * 2}>
          <rect x={-pad} y={-pad} width={width + pad * 2} height={height + pad * 2} fill={`url(#${id}-dot)`} />
        </mask>
        <mask id={`${id}-crs`} maskUnits='userSpaceOnUse' x={-pad} y={-pad} width={width + pad * 2} height={height + pad * 2}>
          <rect x={-pad} y={-pad} width={width + pad * 2} height={height + pad * 2} fill={`url(#${id}-dot2)`} />
        </mask>
        {mode === 'both' && pink && blue ? (
          <mask id={`${id}-pk`} maskUnits='userSpaceOnUse' x={-pad} y={-pad} width={width + pad * 2} height={height + pad * 2}>
            <g color='#fff' fill='#fff' filter={`url(#${id}-ink)`}>
              {render(pink, ids)}
            </g>
          </mask>
        ) : null}
      </defs>

      <rect width={width} height={height} fill={master ? '#FFFFFF' : paper} />
      {master || paper === 'transparent' ? null : <rect width={width} height={height} filter={`url(#${id}-tooth)`} />}
      {under}

      {mode !== 'blue' && pink ? (
        <g
          color={master ? masterInk : palette.pink}
          fill={master ? masterInk : palette.pink}
          filter={`url(#${id}-ink)`}
          style={multiply}
        >
          {render(pink, ids)}
        </g>
      ) : null}
      {mode !== 'pink' && blue ? (
        <g transform={master ? undefined : blueT}>
          <g
            color={master ? masterInk : palette.blue}
            fill={master ? masterInk : palette.blue}
            filter={`url(#${id}-ink)`}
            style={multiply}
          >
            {render(blue, ids)}
          </g>
        </g>
      ) : null}
      {mode === 'both' && pink && blue ? (
        <g mask={`url(#${id}-pk)`}>
          <g transform={blueT}>
            <g color={palette.overprint} fill={palette.overprint} filter={`url(#${id}-ink)`}>
              {render(blue, ids)}
            </g>
          </g>
        </g>
      ) : null}
    </svg>
  );
}

/*
 * The mark: a pink disc (the event) and a blue square (the information) whose
 * corner sits on the disc's center. Where they overprint is a quarter of the
 * disc: fifteen minutes on a clock face, the length of one crit.
 */
export function LogoMark({
  size = 24,
  flat = false,
  style
}: {
  size?: number;
  /** Flat vector without grain, for small UI sizes. */
  flat?: boolean;
  style?: CSSProperties;
}) {
  if (flat) {
    return (
      <svg viewBox='0 0 32 32' aria-hidden style={{ width: u(size), height: u(size), display: 'block', flexShrink: 0, ...style }}>
        <circle cx='13' cy='19' r='11' fill={palette.pink} />
        <rect x='13' y='3' width='16' height='16' fill={palette.blue} />
        <path d='M13 19 L13 8 A11 11 0 0 1 24 19 Z' fill={palette.overprint} />
      </svg>
    );
  }
  return (
    <span style={{ display: 'block', width: u(size), height: u(size), flexShrink: 0, ...style }}>
      <RisoPrint
        width={32}
        height={32}
        paper='transparent'
        shift={[0.6, -0.4]}
        skew={0}
        grain={2.2}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        pink={<circle cx='13' cy='19' r='11' />}
        blue={<rect x='13' y='3' width='16' height='16' />}
      />
    </span>
  );
}

/** Wordmark set in Bricolage at its heaviest, tight. */
export function Wordmark({
  size = 16,
  color = palette.ink,
  style
}: {
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontSize: u(size),
        fontWeight: 800,
        letterSpacing: '-0.035em',
        lineHeight: 0.9,
        color,
        whiteSpace: 'nowrap',
        ...style
      }}
    >
      Studio Hours
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Posters. All are 300 × 450 (2:3, the library's 11 × 17 trimmed).   */
/* ------------------------------------------------------------------ */

const W = 300;
const H = 450;

type PosterProps = {
  className?: string;
  style?: CSSProperties;
  mode?: RisoPrintProps['mode'];
  seed?: number;
  shift?: [number, number];
};


/** Text that is stretched to an exact width so layouts never depend on font load timing. */
function Fit({
  x,
  y,
  w,
  size,
  children,
  weight = 800,
  anchor
}: {
  x: number;
  y: number;
  w?: number;
  size: number;
  children: string;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      textLength={w}
      lengthAdjust={w ? 'spacingAndGlyphs' : undefined}
      textAnchor={anchor}
      fill='currentColor'
      style={{ letterSpacing: weight >= 700 ? '-0.02em' : '0' }}
    >
      {children}
    </text>
  );
}

function Lantern({ cx, cy, r, ids, screen }: { cx: number; cy: number; r: number; ids: Ids; screen?: boolean }) {
  return (
    <g>
      <rect x={cx - r * 0.32} y={cy - r - 7} width={r * 0.64} height={8} rx={1.5} />
      <circle cx={cx} cy={cy} r={r} mask={screen ? ids.coarse : undefined} />
      <rect x={cx - r * 0.24} y={cy + r - 2} width={r * 0.48} height={7} rx={1.5} />
    </g>
  );
}

const FINAL_LANTERNS = [
  { cx: 60, cy: 100, r: 32, hang: 51 },
  { cx: 156, cy: 120, r: 44, hang: 63 },
  { cx: 248, cy: 96, r: 30, hang: 48 }
];

const LANTERNS = [
  { cx: 66, cy: 132, r: 42, hang: 64 },
  { cx: 160, cy: 112, r: 31, hang: 82 },
  { cx: 238, cy: 146, r: 45, hang: 70 }
];

/**
 * Noor's Night Market poster. `draft` is the version on the crit wall: pink
 * lanterns under a blue title, so the title goes muddy where they overprint.
 * `final` is the version printed after crit: pink only marks the time.
 */
export function NightMarketPoster({ version = 'final', className, style, mode, seed = 3, shift }: PosterProps & { version?: 'draft' | 'final' }) {
  const draft = version === 'draft';
  return (
    <RisoPrint
      width={W}
      height={H}
      seed={seed}
      mode={mode}
      shift={shift ?? [1.6, -1.1]}
      className={className}
      style={style}
      label={draft ? 'Draft poster: Night Market, Friday 7pm, the Quad' : 'Poster: Night Market, Friday 7pm, North Quad'}
      pink={(ids) =>
        draft ? (
          <>
            {LANTERNS.map((l) => (
              <Lantern key={l.cx} {...l} ids={ids} />
            ))}
            <Fit x={16} y={376} w={268} size={98}>FRI 7PM</Fit>
          </>
        ) : (
          <>
            <Fit x={16} y={268} w={268} size={98}>FRI 7PM</Fit>
            <circle cx={268} cy={430} r={11} />
          </>
        )
      }
      blue={(ids) =>
        draft ? (
          <>
            <path d='M-6 50 Q 150 108 306 42' fill='none' stroke='currentColor' strokeWidth='2.2' />
            {LANTERNS.map((l) => (
              <line key={l.cx} x1={l.cx} x2={l.cx} y1={l.hang - 22} y2={l.cy - l.r - 6} stroke='currentColor' strokeWidth='1.6' />
            ))}
            <Fit x={16} y={214} w={268} size={78}>NIGHT</Fit>
            <Fit x={16} y={282} w={268} size={78}>MARKET</Fit>
            <Fit x={16} y={414} size={25}>THE QUAD</Fit>
            <Fit x={284} y={414} size={15} weight={600} anchor='end'>12 stalls · free</Fit>
            <Fit x={16} y={436} size={11} weight={500}>Studio Hours × Ashby Food Co-op</Fit>
          </>
        ) : (
          <>
            <path d='M-6 30 Q 150 96 306 24' fill='none' stroke='currentColor' strokeWidth='2' />
            {FINAL_LANTERNS.map((l) => (
              <g key={l.cx}>
                <line x1={l.cx} x2={l.cx} y1={l.hang - 3} y2={l.cy - l.r - 6} stroke='currentColor' strokeWidth='1.6' />
                <rect x={l.cx - l.r * 0.32} y={l.cy - l.r - 7} width={l.r * 0.64} height={8} rx={1.5} />
                <circle cx={l.cx} cy={l.cy} r={l.r} mask={ids.coarse} />
                <circle cx={l.cx} cy={l.cy} r={l.r} fill='none' stroke='currentColor' strokeWidth='2.2' />
                <rect x={l.cx - l.r * 0.24} y={l.cy + l.r - 2} width={l.r * 0.48} height={7} rx={1.5} />
              </g>
            ))}
            <Fit x={16} y={340} w={268} size={66}>NIGHT</Fit>
            <Fit x={16} y={398} w={268} size={66}>MARKET</Fit>
            <Fit x={16} y={424} size={24}>NORTH QUAD</Fit>
            <Fit x={16} y={441} size={12} weight={600}>by the clock tower · 12 stalls · free</Fit>
            <rect x={268} y={414} width={16} height={16} />
          </>
        )
      }
    />
  );
}

/** Crit Night: the mark, blown up. The overprinted quarter is the 15 minutes. */
export function CritNightPoster({ className, style, mode, seed = 8, shift }: PosterProps) {
  return (
    <RisoPrint
      width={W}
      height={H}
      seed={seed}
      mode={mode}
      shift={shift ?? [-1.2, 1.3]}
      skew={-0.3}
      className={className}
      style={style}
      label='Poster: Crit Night, Thursdays 6:30, Hale Hall B14'
      pink={(ids) => (
        <>
          <circle cx={128} cy={196} r={112} />
          <circle cx={128} cy={196} r={140} fill='none' stroke='currentColor' strokeWidth='1.4' strokeDasharray='1.6 6.7' />
          <Fit x={16} y={398} size={30}>THURSDAYS 6:30</Fit>
          <rect x={16} y={52} width={74} height={12} mask={ids.screen} />
        </>
      )}
      blue={() => (
        <>
          <rect x={128} y={36} width={156} height={160} />
          <Fit x={16} y={44} size={13} weight={600}>15 minutes each</Fit>
          <Fit x={16} y={362} w={268} size={52}>CRIT NIGHT</Fit>
          <Fit x={16} y={423} size={19}>HALE HALL B14</Fit>
          <Fit x={16} y={441} size={12.5} weight={600}>Bring anything unfinished.</Fit>
        </>
      )}
    />
  );
}

/** Type & Tea: a pink teacup with the title overprinted across it. */
export function TypeTeaPoster({ className, style, mode, seed = 14, shift }: PosterProps) {
  return (
    <RisoPrint
      width={W}
      height={H}
      seed={seed}
      mode={mode}
      shift={shift ?? [1.1, 1.5]}
      skew={0.35}
      className={className}
      style={style}
      label='Poster: Type and Tea, Wednesday 4pm, Library second floor'
      pink={(ids) => (
        <>
          <path d='M40 196 H244 C244 290 196 334 142 334 C88 334 40 290 40 196 Z' />
          <circle cx={248} cy={240} r={27} fill='none' stroke='currentColor' strokeWidth='13' />
          <ellipse cx={142} cy={346} rx={124} ry={13} />
          {[96, 142, 188].map((x, i) => (
            <path
              key={x}
              d={`M${x} 178 c-14 -16 14 -26 0 -44 c-14 -18 14 -26 0 -44`}
              fill='none'
              stroke='currentColor'
              strokeWidth='7'
              strokeLinecap='round'
              mask={i === 1 ? undefined : ids.screen}
            />
          ))}
          <Fit x={16} y={404} size={36}>WED 4PM</Fit>
        </>
      )}
      blue={() => (
        <>
          <Fit x={16} y={52} size={13} weight={600}>Studio Hours presents</Fit>
          <Fit x={16} y={262} w={268} size={84}>TYPE &amp;</Fit>
          <Fit x={16} y={324} w={268} size={84}>TEA</Fit>
          <Fit x={16} y={424} size={17}>LIBRARY 2F READING ROOM</Fit>
          <Fit x={16} y={441} size={12} weight={600}>Bring a type specimen. We bring the tea.</Fit>
          <rect x={232} y={380} width={52} height={7} />
        </>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* The 15-minute format as a clock ring: show 2, ask 3, notes 7, pick 3. */
/* ------------------------------------------------------------------ */

export const FORMAT = [
  { at: 0, min: 2, name: 'Show it', ink: 'pink' as const },
  { at: 2, min: 3, name: 'Ask', ink: 'blue' as const },
  { at: 5, min: 7, name: 'Notes', ink: 'both' as const },
  { at: 12, min: 3, name: 'Pick one', ink: 'pink' as const }
];

/** A donut segment from minute `a` to minute `b` of a 15-minute clock. */
export function segment(cx: number, cy: number, r0: number, r1: number, a: number, b: number, gap = 0.12) {
  const ang = (m: number) => (m / 15) * Math.PI * 2 - Math.PI / 2;
  const s = ang(a + gap);
  const e = ang(b - gap);
  const large = e - s > Math.PI ? 1 : 0;
  const p = (r: number, t: number) => `${(cx + r * Math.cos(t)).toFixed(2)} ${(cy + r * Math.sin(t)).toFixed(2)}`;
  return `M${p(r1, s)} A${r1} ${r1} 0 ${large} 1 ${p(r1, e)} L${p(r0, e)} A${r0} ${r0} 0 ${large} 0 ${p(r0, s)} Z`;
}

/** Ink layers for the format ring, to pass to `RisoPrint`. */
export function formatRing(cx: number, cy: number, r0: number, r1: number) {
  return {
    pink: FORMAT.filter((f) => f.ink !== 'blue').map((f) => (
      <path key={f.at} d={segment(cx, cy, r0, r1, f.at, f.at + f.min)} />
    )),
    blue: FORMAT.filter((f) => f.ink !== 'pink').map((f) => (
      <path key={f.at} d={segment(cx, cy, r0, r1, f.at, f.at + f.min)} />
    ))
  };
}
