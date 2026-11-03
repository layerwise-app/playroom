import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { palette } from './theme';

/*
 * Stand-ins for the guides' phone photos, drawn in greys and then put
 * through the same treatment Kittiwake gives every photo: soften, add grain,
 * map shadows to deep, mids to sea, highlights to sand.
 */

const channel = (hex: string, i: number) => (parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255).toFixed(3);
const ramp = [palette.deep, palette.sea, '#7E9E96', palette.sand];
const table = (i: number) => ramp.map((c) => channel(c, i)).join(' ');

export type SceneKind = 'headland' | 'harbour' | 'beach' | 'castle' | 'fields';

export function Scene({
  kind,
  className,
  style,
  grain = 0.24,
  seed = 3
}: {
  kind: SceneKind;
  className?: string;
  style?: CSSProperties;
  grain?: number;
  seed?: number;
}) {
  const id = `kw-duo-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg
      aria-hidden
      viewBox='0 0 400 280'
      preserveAspectRatio='xMidYMid slice'
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    >
      <defs>
        <filter id={id} x='0' y='0' width='100%' height='100%' colorInterpolationFilters='sRGB'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='0.55' result='soft' />
          <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed={seed} stitchTiles='stitch' result='noise' />
          <feColorMatrix
            in='noise'
            type='matrix'
            values='0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1'
            result='mono'
          />
          <feComposite in='soft' in2='mono' operator='arithmetic' k1='0' k2='1' k3={grain} k4={-grain / 2} result='grainy' />
          <feColorMatrix
            in='grainy'
            type='matrix'
            values='0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0'
            result='lum'
          />
          <feComponentTransfer in='lum'>
            <feFuncR type='table' tableValues={table(0)} />
            <feFuncG type='table' tableValues={table(1)} />
            <feFuncB type='table' tableValues={table(2)} />
          </feComponentTransfer>
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        <rect width='400' height='280' fill='#888' />
        {SCENES[kind](id)}
        <defs>
          <radialGradient id={`${id}-vig`} cx='0.5' cy='0.46' r='0.75'>
            <stop offset='0.55' stopColor='#000' stopOpacity='0' />
            <stop offset='1' stopColor='#000' stopOpacity='0.32' />
          </radialGradient>
          <linearGradient id={`${id}-low`} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0.5' stopColor='#000' stopOpacity='0' />
            <stop offset='1' stopColor='#000' stopOpacity='0.14' />
          </linearGradient>
        </defs>
        <rect width='400' height='280' fill={`url(#${id}-low)`} />
        <rect width='400' height='280' fill={`url(#${id}-vig)`} />
      </g>
    </svg>
  );
}

function Sky({ id, horizon, sun = [0.72, 0.28] }: { id: string; horizon: number; sun?: [number, number] }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor='#c9c9c9' />
          <stop offset='1' stopColor='#f1f1f1' />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx={sun[0]} cy={sun[1]} r='0.42'>
          <stop offset='0' stopColor='#ffffff' stopOpacity='0.95' />
          <stop offset='1' stopColor='#ffffff' stopOpacity='0' />
        </radialGradient>
      </defs>
      <rect width='400' height={horizon + 2} fill={`url(#${id}-sky)`} />
      <rect width='400' height='280' fill={`url(#${id}-sun)`} />
    </>
  );
}

function Sea({ id, horizon, glitter = 290 }: { id: string; horizon: number; glitter?: number }) {
  const lines: ReactNode[] = [];
  for (let i = 0; i < 26; i++) {
    const y = horizon + 3 + i * i * 0.22 + i * 2.2;
    const w = 6 + ((i * 37) % 23) + i * 0.8;
    const x = glitter - w / 2 + (((i * 53) % 31) - 15) * (0.4 + i * 0.05);
    lines.push(<rect key={i} x={x} y={y} width={w} height={0.9 + i * 0.05} rx='0.5' fill='#f4f4f4' opacity={0.85 - i * 0.025} />);
  }
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sea`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor='#a2a2a2' />
          <stop offset='1' stopColor='#575757' />
        </linearGradient>
      </defs>
      <rect y={horizon} width='400' height={280 - horizon} fill={`url(#${id}-sea)`} />
      {lines}
    </>
  );
}

function Walkers({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill='#151515'>
      <circle cx='0' cy='-9.2' r='1.5' />
      <path d='M-1.6 -7.4 h3.2 l0.5 5.2 h-1 l-0.4 4.6 h-1.4 l-0.4 -4.6 h-1 Z' />
      <rect x='-2.4' y='-7' width='1.2' height='3.6' rx='0.5' fill='#3a3a3a' />
      <circle cx='5.2' cy='-8.6' r='1.4' />
      <path d='M3.7 -7 h3 l0.5 4.8 h-0.9 l-0.4 4.6 h-1.4 l-0.4 -4.6 h-0.9 Z' />
    </g>
  );
}

function Cottage({ x, y, w = 12, h = 8, roof = 5, light = '#dedede' }: { x: number; y: number; w?: number; h?: number; roof?: number; light?: string }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={light} />
      <path d={`M${x - 0.8} ${y - h} L${x + w / 2} ${y - h - roof} L${x + w + 0.8} ${y - h} Z`} fill='#2a2a2a' />
      <rect x={x + w * 0.2} y={y - h * 0.62} width={w * 0.16} height={h * 0.28} fill='#555' />
      <rect x={x + w * 0.62} y={y - h * 0.62} width={w * 0.16} height={h * 0.28} fill='#555' />
    </g>
  );
}

const SCENES: Record<SceneKind, (id: string) => ReactNode> = {
  // Tintagel Island from the mainland cliff, two walkers on the path.
  headland: (id) => (
    <>
      <Sky id={id} horizon={116} />
      <Sea id={id} horizon={116} glitter={300} />
      <path d='M0 117 L0 101 C22 98 44 96 66 99 C86 102 104 106 122 109 C136 111 146 114 152 117 Z' fill='#acacac' />
      <path
        d='M190 156 C196 132 204 114 214 104 C228 95 252 91 276 93 C294 95 306 100 314 109 C322 120 326 138 332 156 Z'
        fill='#5c5c5c'
      />
      <path d='M214 104 C228 95 252 91 276 93 C294 95 306 100 314 109 C300 104 284 101 266 101 C246 101 228 103 214 104 Z' fill='#7d7d7d' />
      <path d='M238 156 C240 140 244 128 250 120 L256 156 Z' fill='#4a4a4a' />
      <path d='M186 157 C206 154 228 158 250 155 C272 153 302 158 336 155' stroke='#f2f2f2' strokeWidth='2.4' fill='none' opacity='0.9' />
      <path d='M0 280 L0 166 C40 158 92 164 132 176 C172 188 206 200 242 214 C282 230 332 236 400 230 L400 280 Z' fill='#2b2b2b' />
      <path
        d='M0 166 C40 158 92 164 132 176 C172 188 206 200 242 214 C282 230 332 236 400 230 L400 246 C332 252 272 246 232 230 C192 214 152 200 112 190 C72 180 32 178 0 182 Z'
        fill='#5e5e5e'
      />
      <path d='M400 262 C350 258 300 250 262 237 C222 223 182 207 142 195 C112 187 82 183 52 183' stroke='#d2d2d2' strokeWidth='2.4' fill='none' strokeLinecap='round' />
      <Walkers x={166} y={203} s={1.25} />
    </>
  ),
  // Port Isaac: cottages stacked down to the harbour.
  harbour: (id) => (
    <>
      <Sky id={id} horizon={92} sun={[0.5, 0.2]} />
      <Sea id={id} horizon={92} glitter={210} />
      <path d='M0 280 L0 58 C40 60 82 78 122 108 C152 130 172 160 184 198 L184 280 Z' fill='#585858' />
      <path d='M400 280 L400 66 C360 70 322 92 292 120 C268 142 252 170 242 202 L242 280 Z' fill='#474747' />
      <rect x='176' y='196' width='72' height='84' fill='#8e8e8e' />
      <path d='M176 212 h72 M176 230 h72 M176 252 h72' stroke='#b4b4b4' strokeWidth='0.8' />
      <path d='M150 199 L250 196' stroke='#dadada' strokeWidth='3' />
      {[
        [8, 80], [24, 84], [42, 92], [60, 100], [16, 108], [34, 114], [52, 122], [72, 112], [88, 126],
        [104, 138], [70, 140], [46, 146], [118, 156], [92, 158], [132, 172], [108, 176], [150, 188]
      ].map(([x, y], i) => (
        <Cottage key={i} x={x} y={y} w={11 + (i % 3) * 2} h={7 + (i % 2) * 2} light={i % 4 === 0 ? '#c8c8c8' : '#e2e2e2'} />
      ))}
      {[[300, 112], [318, 104], [336, 98], [282, 130], [356, 96], [300, 138], [268, 156]].map(([x, y], i) => (
        <Cottage key={i} x={x} y={y} w={12} h={8} light='#d4d4d4' />
      ))}
      <path d='M196 236 c4 3 14 3 18 0 l-2 4 h-14 Z' fill='#f0f0f0' />
      <path d='M206 236 v-10' stroke='#2a2a2a' strokeWidth='0.8' />
      <path d='M222 258 c4 3 12 3 16 0 l-2 4 h-12 Z' fill='#202020' />
      <path d='M184 266 c3 2 10 2 13 0 l-1.5 3 h-10 Z' fill='#e8e8e8' />
    </>
  ),
  // A long beach at low tide, surf lines and wet sand.
  beach: (id) => (
    <>
      <Sky id={id} horizon={118} sun={[0.3, 0.3]} />
      <ellipse cx='260' cy='40' rx='70' ry='9' fill='#f6f6f6' opacity='0.7' />
      <ellipse cx='110' cy='62' rx='50' ry='6' fill='#f6f6f6' opacity='0.6' />
      <Sea id={id} horizon={118} glitter={120} />
      <path d='M0 150 C80 146 160 152 240 148 C300 145 350 150 400 147' stroke='#f2f2f2' strokeWidth='2' fill='none' />
      <path d='M0 162 C70 158 150 165 230 160 C300 157 350 162 400 159' stroke='#f2f2f2' strokeWidth='3' fill='none' />
      <path d='M0 168 L400 166 L400 200 L0 204 Z' fill='#b9b9b9' />
      <path d='M0 172 C90 170 200 174 400 170' stroke='#e9e9e9' strokeWidth='1.2' fill='none' />
      <path d='M0 202 L400 198 L400 280 L0 280 Z' fill='#d9d9d9' />
      <path d='M300 118 C320 104 352 98 400 100 L400 166 L312 166 Z' fill='#4b4b4b' />
      <path d='M0 280 L0 226 C30 214 70 214 104 226 C132 236 150 254 160 280 Z' fill='#6a6a6a' />
      {Array.from({ length: 22 }, (_, i) => (
        <path key={i} d={`M${6 + i * 6.6} ${232 + Math.abs(11 - i) * 1.6} l${(i % 3) - 1} -${8 + (i % 4) * 3}`} stroke='#3a3a3a' strokeWidth='1' />
      ))}
      <Walkers x={236} y={214} s={0.8} />
    </>
  ),
  // A castle on its rock above a beach (Northumberland).
  castle: (id) => (
    <>
      <Sky id={id} horizon={128} sun={[0.22, 0.26]} />
      <Sea id={id} horizon={128} glitter={90} />
      <path d='M0 170 C80 166 200 172 400 166 L400 280 L0 280 Z' fill='#d6d6d6' />
      <path d='M0 158 C90 156 200 160 400 154' stroke='#f2f2f2' strokeWidth='2.6' fill='none' />
      <path d='M180 168 C200 140 230 128 270 126 C320 124 360 130 400 132 L400 170 Z' fill='#5a5a5a' />
      <path
        d='M214 128 V112 h6 v-5 h4 v5 h10 V96 h5 v-4 h4 v4 h5 v16 h12 v-8 h4 v-4 h4 v4 h4 v8 h16 v-6 h5 v6 h18 v16 Z'
        fill='#3a3a3a'
      />
      <path d='M0 280 L0 232 C40 222 90 224 130 236 C160 246 180 262 186 280 Z' fill='#7a7a7a' />
      {Array.from({ length: 18 }, (_, i) => (
        <path key={i} d={`M${8 + i * 7} ${238 + Math.abs(9 - i) * 1.4} l${(i % 3) - 1} -${7 + (i % 4) * 3}`} stroke='#454545' strokeWidth='1' />
      ))}
    </>
  ),
  // Fields and stone walls running to the cliff edge, islands offshore.
  fields: (id) => (
    <>
      <Sky id={id} horizon={98} sun={[0.62, 0.2]} />
      <Sea id={id} horizon={98} glitter={260} />
      <path d='M54 99 C72 90 98 88 118 94 L126 99 Z' fill='#8a8a8a' />
      <path d='M304 99 C312 94 324 93 332 97 L336 99 Z' fill='#9a9a9a' />
      <path d='M0 280 L0 112 C80 112 160 116 230 124 C280 130 318 140 340 156 L336 280 Z' fill='#646464' />
      <path d='M340 156 C318 140 280 130 230 124 L230 126 C276 134 306 146 324 164 C340 182 346 220 344 280 L336 280 Z' fill='#7a7a7a' />
      <path d='M340 156 C356 172 364 214 366 280 L344 280 C346 220 340 182 324 164 Z' fill='#353535' />
      <path
        d='M0 124 C80 124 160 128 236 136 M0 142 C80 142 170 148 262 160 M0 170 C90 170 180 178 286 194 M0 214 C100 214 200 224 306 244'
        stroke='#a4a4a4'
        strokeWidth='1.5'
        fill='none'
      />
      <path d='M60 112 L36 280 M150 114 L150 280 M228 124 L262 280' stroke='#a4a4a4' strokeWidth='1.5' fill='none' />
      <path d='M318 280 C322 240 316 200 296 176 C276 156 248 142 214 134' stroke='#d8d8d8' strokeWidth='2.4' fill='none' strokeLinecap='round' />
      <Walkers x={286} y={172} s={0.95} />
    </>
  )
};
