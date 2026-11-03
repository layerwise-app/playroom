import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { BrowserWindow, Phone } from '~/components/frames';
import { u } from '~/components/stage';
import type { Still } from '~/content/stills';
import { TideLine, Wordmark } from './brand';
import { pentireToBude, smoothPath, tideLine, tideMarks } from './route';
import { Scene } from './scenes';
import {
  BookingEmail,
  DifficultyPage,
  HeroExplorer,
  HomePage,
  LuggageTag,
  MobileDay,
  MobileTrip,
  Nav,
  TripPage,
  base,
  eyebrow
} from './screens';
import SeaTexture, { SEA_STILL_TIME } from './texture';
import { palette } from './theme';

/** Fixed moments of the sea, so every still is repeatable. */
const SEA = { home: 52, trip: 18, mobile: 74, cover: 61, brand: 27, hero: 88 };

function Ground({ children, color = '#E7DDCA', grain = true, style }: { children: ReactNode; color?: string; grain?: boolean; style?: CSSProperties }) {
  return (
    <div
      className='absolute inset-0 overflow-hidden'
      style={{ ...base, background: color, backgroundImage: grain ? 'var(--grain)' : undefined, ...style }}
    >
      {children}
    </div>
  );
}

function SeaGround({ time, density = 1, shade = 0, children }: { time: number; density?: number; shade?: number; children: ReactNode }) {
  return (
    <div className='absolute inset-0 overflow-hidden' style={{ ...base, background: palette.sea }}>
      <SeaTexture className='absolute inset-0' time={time} density={density} />
      {shade ? <div className='absolute inset-0' style={{ background: palette.deep, opacity: shade }} /> : null}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screens in frames                                                   */
/* ------------------------------------------------------------------ */

function HomeStill() {
  return (
    <Ground>
      <BrowserWindow url='kittiwake.co.uk' className='absolute' style={{ left: u(100), top: u(64), width: u(1240), height: u(900) }}>
        <HomePage seaTime={SEA.home} />
      </BrowserWindow>
    </Ground>
  );
}

function TripStill() {
  return (
    <SeaGround time={SEA.trip} density={1.3} shade={0.15}>
      <BrowserWindow url='kittiwake.co.uk/trips/cornwall' className='absolute' style={{ left: u(100), top: u(60), width: u(1240), height: u(900) }}>
        <TripPage />
      </BrowserWindow>
    </SeaGround>
  );
}

function DifficultyStill() {
  return (
    <Ground color={palette.deep} grain={false}>
      <BrowserWindow url='kittiwake.co.uk/trips/cornwall/how-hard' className='absolute' style={{ left: u(100), top: u(60), width: u(1240), height: u(900) }}>
        <DifficultyPage />
      </BrowserWindow>
    </Ground>
  );
}

function LuggageStill() {
  return (
    <Ground color='#E3D6BE'>
      <div className='absolute' style={{ left: u(70), top: u(170), transform: 'rotate(-3deg) scale(1.12)', transformOrigin: '0 0' }}>
        <BookingEmail />
      </div>
      <div className='absolute' style={{ left: u(812), top: u(286), transform: 'rotate(5deg) scale(1.15)', transformOrigin: '50% 0' }}>
        <LuggageTag />
      </div>
    </Ground>
  );
}

function MobileStill() {
  return (
    <SeaGround time={SEA.mobile} density={1.2}>
      <Phone width={430} height={900} screen={palette.sand} className='absolute' style={{ left: u(130), top: u(170) }}>
        <MobileTrip />
      </Phone>
      <Phone width={430} height={900} screen={palette.sand} className='absolute' style={{ left: u(640), top: u(110) }}>
        <MobileDay />
      </Phone>
    </SeaGround>
  );
}

/* ------------------------------------------------------------------ */
/* Cover                                                               */
/* ------------------------------------------------------------------ */

function Cover() {
  return (
    <SeaGround time={SEA.cover} density={1.25} shade={0.1}>
      <div className='absolute' style={{ left: u(64), top: u(92), transform: 'scale(0.64)', transformOrigin: '0 0' }}>
        <BrowserWindow url='kittiwake.co.uk/trips/cornwall' style={{ width: u(1240), height: u(900) }}>
          <TripPage />
        </BrowserWindow>
      </div>
      <div className='absolute' style={{ left: u(888), top: u(52), transform: 'scale(0.74)', transformOrigin: '0 0' }}>
        <Phone width={430} height={900} screen={palette.sand}>
          <MobileTrip />
        </Phone>
      </div>
      <div className='absolute' style={{ left: u(1150), top: u(214), transform: 'rotate(7deg) scale(0.78)', transformOrigin: '50% 0' }}>
        <LuggageTag />
      </div>
    </SeaGround>
  );
}

/* ------------------------------------------------------------------ */
/* Brand sheet                                                         */
/* ------------------------------------------------------------------ */

function Label({ n, title, children, light }: { n: string; title: string; children?: ReactNode; light?: boolean }) {
  return (
    <div style={{ color: light ? palette.sand : palette.ink }}>
      <p style={{ ...eyebrow, color: light ? palette.foam : palette.sea }}>
        {n} · {title}
      </p>
      {children ? (
        <p style={{ fontSize: u(15), lineHeight: 1.45, marginTop: u(6), maxWidth: u(420), color: light ? palette.foam : palette.inkSoft }}>
          {children}
        </p>
      ) : null}
    </div>
  );
}

function Panel({ children, style, tone = 'paper' }: { children: ReactNode; style?: CSSProperties; tone?: 'paper' | 'sea' }) {
  return (
    <div
      className='absolute overflow-hidden'
      style={{
        borderRadius: u(18),
        background: tone === 'paper' ? '#FAF6EE' : palette.sea,
        boxShadow: tone === 'paper' ? `0 0 0 1px ${palette.rule}` : 'none',
        ...style
      }}
    >
      {children}
    </div>
  );
}

/** Pentire Point to Bude, as on the map, turned 50° and laid level. */
function Construction() {
  const xs = pentireToBude.map((p) => p.x);
  const ys = pentireToBude.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX;
  const h = Math.max(...ys) - minY;
  const coast = smoothPath(pentireToBude.map((p) => ({ x: p.x - minX, y: p.y - minY })));
  const LW = 520;
  const LH = 46;
  const marks = tideMarks(LW, LH, [9, 19, 27, 32, 38, 46]);
  const names = ['Pentire Point', 'Port Isaac', 'Tintagel', 'Boscastle', 'Crackington', 'Bude'];
  const mapW = 190;
  const k = (w + 24) / mapW;
  return (
    <div className='absolute inset-0'>
      <div className='absolute' style={{ left: u(36), top: u(34) }}>
        <Label n='01' title='The tide-line'>
          The mark is the coast of our first route, Pentire Point to Bude, traced and turned to run level. The
          same line draws the maps and cuts the luggage tags.
        </Label>
      </div>
      <svg
        aria-hidden
        viewBox={`-12 -12 ${w + 24} ${h + 24}`}
        className='absolute'
        style={{ left: u(44), top: u(150), width: u(mapW), height: u((mapW * (h + 24)) / (w + 24)) }}
      >
        <path d={coast} fill='none' stroke={palette.ink} strokeWidth={1.6 * k} strokeLinejoin='round' />
        {[0, 10, 18, 23, 29, 37].map((i) => (
          <circle
            key={i}
            cx={pentireToBude[i].x - minX}
            cy={pentireToBude[i].y - minY}
            r={3.4 * k}
            fill={i === 0 ? palette.beak : palette.sand}
            stroke={palette.ink}
            strokeWidth={1.2 * k}
          />
        ))}
      </svg>
      <div className='absolute' style={{ left: u(44), top: u(412), fontSize: u(13), color: palette.inkSoft }}>
        As walked, heading north-east
      </div>
      <svg aria-hidden viewBox='0 0 80 60' className='absolute' style={{ left: u(250), top: u(228), width: u(80), height: u(60) }}>
        <path d='M8 44 C24 14 52 10 70 24' fill='none' stroke={palette.sea} strokeWidth='1.6' strokeDasharray='3 3' />
        <path d='M64 18 L71 25 L62 28' fill='none' stroke={palette.sea} strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
      <div className='absolute tabular' style={{ left: u(256), top: u(292), fontSize: u(13), color: palette.sea, fontWeight: 600 }}>
        turned 50°
      </div>
      <div className='absolute' style={{ left: u(344), top: u(206) }}>
        <svg aria-hidden viewBox={`-8 -8 ${LW + 16} ${LH + 44}`} style={{ width: u(LW + 16), height: u(LH + 44), display: 'block', overflow: 'visible' }}>
          <path d={tideLine(LW, LH)} fill='none' stroke={palette.ink} strokeWidth='2.4' strokeLinejoin='round' strokeLinecap='round' />
          {marks.map((m, i) => (
            <g key={names[i]}>
              {i === 0 ? null : <path d={`M${m.x} ${m.y + 6} V${LH + 12}`} stroke={palette.stone} strokeWidth='1' />}
              <circle cx={m.x} cy={m.y} r='3.6' fill={i === 0 ? palette.beak : palette.sand} stroke={palette.ink} strokeWidth='1.4' />
              <text
                x={i === 0 ? m.x - 4 : m.x}
                y={i === 0 ? -14 : LH + 28}
                textAnchor={i === 0 ? 'start' : i === 5 ? 'end' : 'middle'}
                fill={palette.inkSoft}
                style={{ fontSize: 12.5 }}
              >
                {names[i]}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className='absolute' style={{ left: u(344), top: u(332) }}>
        <Wordmark size={80} />
      </div>
    </div>
  );
}

function Favicon({ size }: { size: number }) {
  return (
    <svg aria-hidden viewBox='0 0 16 16' style={{ width: u(size), height: u(size), display: 'block' }}>
      <rect width='16' height='16' rx='3.6' fill={palette.deep} />
      <path
        d='M2.6 8.6 C3.8 6.2 5.2 6.4 6 8.4 C6.8 10.2 8.4 7.6 9.8 8.6 C11 9.4 11.8 8 13.4 7.4'
        fill='none'
        stroke={palette.sand}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle cx='2.9' cy='8.5' r='1.55' fill={palette.beak} />
    </svg>
  );
}

const swatches: { name: string; hex: string; note: string; ink?: string }[] = [
  { name: 'Sea', hex: palette.sea, note: 'The brand. Panels, the tag.' },
  { name: 'Deep', hex: palette.deep, note: 'Today, selected, buttons.' },
  { name: 'Foam', hex: palette.foam, note: 'Water on maps.', ink: palette.ink },
  { name: 'Sand', hex: palette.sand, note: 'Paper. Most of the site.', ink: palette.ink },
  { name: 'Stone', hex: palette.stone, note: 'Contours and rules.', ink: palette.ink },
  { name: 'Beak', hex: palette.beak, note: 'Only ever you: walker, eyelet.', ink: palette.ink }
];

function BrandSheet() {
  return (
    <Ground color={palette.sand}>
      <Panel style={{ left: u(40), top: u(40), width: u(900), height: u(500) }}>
        <Construction />
      </Panel>

      <Panel tone='sea' style={{ left: u(960), top: u(40), width: u(440), height: u(300) }}>
        <SeaTexture className='absolute inset-0' time={SEA.brand} density={1.1} />
        <div className='absolute inset-0 flex items-center justify-center'>
          <Wordmark size={54} color={palette.sand} />
        </div>
        <div className='absolute' style={{ left: u(24), top: u(22) }}>
          <p style={{ ...eyebrow, color: palette.foam }}>02 · On the sea</p>
        </div>
      </Panel>

      <Panel style={{ left: u(960), top: u(360), width: u(440), height: u(180) }}>
        <div className='absolute' style={{ left: u(24), top: u(22) }}>
          <Label n='03' title='Down to 16 px'>
            Three bumps survive: Pentire, Tintagel, Cambeak.
          </Label>
        </div>
        <div className='absolute flex items-end' style={{ left: u(24), bottom: u(20), gap: u(20) }}>
          {[64, 32, 16].map((s) => (
            <div key={s} className='flex flex-col items-start' style={{ gap: u(8) }}>
              <Favicon size={s} />
              <span className='tabular' style={{ fontSize: u(12), color: palette.inkSoft }}>
                {s} px
              </span>
            </div>
          ))}
          <div className='flex flex-col items-start' style={{ gap: u(8), marginLeft: u(6) }}>
            <div
              className='flex items-center'
              style={{
                gap: u(8),
                height: u(34),
                paddingInline: u(12),
                borderRadius: u(8),
                background: '#E7E3DB',
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                fontSize: u(12.5),
                color: '#333'
              }}
            >
              <Favicon size={16} />
              Kittiwake · Walk the coast
            </div>
            <span style={{ fontSize: u(12), color: palette.inkSoft }}>In a browser tab</span>
          </div>
        </div>
      </Panel>

      <Panel style={{ left: u(40), top: u(560), width: u(520), height: u(300) }}>
        <div className='absolute' style={{ left: u(24), top: u(22) }}>
          <Label n='04' title='Palette' />
        </div>
        <div className='absolute flex' style={{ left: u(24), right: u(24), top: u(58), bottom: u(18), gap: u(8) }}>
          {swatches.map((sw) => (
            <div key={sw.name} className='flex flex-1 flex-col'>
              <div
                className='flex flex-1 flex-col justify-end'
                style={{
                  background: sw.hex,
                  borderRadius: u(10),
                  padding: u(10),
                  color: sw.ink ?? palette.sand,
                  boxShadow: sw.hex === palette.sand ? `inset 0 0 0 1px ${palette.rule}` : 'none'
                }}
              >
                <p style={{ fontSize: u(14), fontWeight: 620 }}>{sw.name}</p>
                <p className='tabular' style={{ fontSize: u(11), opacity: 0.85, marginTop: u(2) }}>
                  {sw.hex}
                </p>
              </div>
              <p style={{ fontSize: u(11), color: palette.inkSoft, marginTop: u(8), lineHeight: 1.3, minHeight: u(43) }}>{sw.note}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel style={{ left: u(580), top: u(560), width: u(440), height: u(300) }}>
        <div className='absolute' style={{ left: u(24), top: u(22), right: u(24) }}>
          <Label n='05' title='Fraunces, softness 100' />
          <p style={{ fontSize: u(46), fontWeight: 540, lineHeight: 1, letterSpacing: '-0.02em', marginTop: u(18) }}>Walk the coast.</p>
          <p style={{ fontSize: u(16), lineHeight: 1.5, marginTop: u(14), color: palette.ink }}>
            Seven steep valleys in 14 km, each one down to a stream and back up. The café at Trebarwith is open until 5.
          </p>
          <div className='tabular flex' style={{ gap: u(26), marginTop: u(16), borderTop: `1px solid ${palette.rule}`, paddingTop: u(12) }}>
            {[
              ['5½', 'hours'],
              ['290', 'flights'],
              ['3 pm', 'bags in']
            ].map(([n, l]) => (
              <p key={l} style={{ fontSize: u(13), color: palette.inkSoft }}>
                <span style={{ display: 'block', fontSize: u(28), fontWeight: 560, color: palette.ink, lineHeight: 1.05 }}>{n}</span>
                {l}
              </p>
            ))}
          </div>
        </div>
      </Panel>

      <Panel style={{ left: u(1040), top: u(560), width: u(360), height: u(300) }}>
        <div className='absolute overflow-hidden' style={{ left: u(16), top: u(16), right: u(16), height: u(170), borderRadius: u(10) }}>
          <Scene kind='harbour' />
        </div>
        <div
          className='absolute'
          style={{
            left: u(16),
            right: u(16),
            top: u(194),
            height: u(8),
            borderRadius: u(4),
            background: `linear-gradient(90deg, ${palette.deep}, ${palette.sea} 34%, #7E9E96 67%, ${palette.sand})`,
            boxShadow: `inset 0 0 0 1px ${palette.rule}`
          }}
        />
        <div className='absolute' style={{ left: u(24), right: u(16), top: u(218) }}>
          <Label n='06' title='One photo treatment'>
            2,000 guide photos, one look: deep shadows, sand highlights, 8% grain.
          </Label>
        </div>
      </Panel>
    </Ground>
  );
}

/* ------------------------------------------------------------------ */
/* Hero scene (recorded as the case study video)                       */
/* ------------------------------------------------------------------ */

const HERO_LENGTH = 8;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/**
 * The homepage hero, full bleed at 1440 × 900: the live sea, the headline
 * settling, the route explorer sliding up and walking day 3. Mount it inside
 * a 1440 × 900 Stage, like a still; it plays once over 8 seconds and holds.
 * With `at` it freezes on that second (the poster is the last one).
 */
export function HeroScene({ at }: { at?: number }) {
  const [t, setT] = useState(at ?? 0);
  useEffect(() => {
    if (at !== undefined) {
      setT(at);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const e = Math.min(HERO_LENGTH, (now - start) / 1000);
      setT(e);
      if (e < HERO_LENGTH) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [at]);

  const rise = (a: number, b: number, distance: number, max = 1): CSSProperties => {
    const p = easeOut(span(t, a, b));
    return { opacity: p * max, transform: `translateY(${u((1 - p) * distance)})` };
  };
  const line = (a: number, b: number): CSSProperties => {
    const p = easeOut(span(t, a, b));
    return {
      display: 'block',
      opacity: p,
      transform: `translateY(${u((1 - p) * 34)})`,
      letterSpacing: `${-0.024 + (1 - p) * 0.03}em`
    };
  };
  const card = easeOut(span(t, 3.1, 4.7));
  const pos = 1 + easeInOut(span(t, 5.0, 7.2));

  return (
    <div className='absolute inset-0 overflow-hidden' style={{ ...base, background: palette.sea }}>
      <SeaTexture
        className='absolute inset-0'
        time={at !== undefined ? SEA.hero + at : undefined}
        start={SEA.hero}
        density={1.55}
        resolution={0.85}
      />
      <div
        aria-hidden
        className='absolute inset-0'
        style={{ background: 'linear-gradient(100deg, rgba(10,52,56,.82) 0%, rgba(10,52,56,.5) 40%, rgba(10,52,56,0) 66%)' }}
      />
      <div style={{ ...rise(0.1, 1.1, -10), paddingInline: u(40) }}>
        <Nav tone='sea' />
      </div>
      <div className='absolute' style={{ left: u(96), top: u(250), color: palette.sand }}>
        <p style={{ ...eyebrow, color: palette.foam, ...rise(0.5, 1.5, 12) }}>Self-guided coastal walks · Britain and Ireland</p>
        <h1 style={{ fontSize: u(86), fontWeight: 520, lineHeight: 0.98, marginTop: u(20) }}>
          <span style={line(0.7, 2.3)}>Walk the coast.</span>
          <span style={line(1.15, 2.75)}>We’ll carry the rest.</span>
        </h1>
        <p style={{ fontSize: u(21), lineHeight: 1.5, marginTop: u(26), maxWidth: u(540), ...rise(2.3, 3.2, 14, 0.92) }}>
          We book the inns, take your bags ahead every morning, and tell you exactly how long each day is. You
          bring boots.
        </p>
        <div className='flex' style={{ gap: u(12), marginTop: u(30), ...rise(2.7, 3.6, 14) }}>
          <span
            className='inline-flex items-center'
            style={{ height: u(50), paddingInline: u(24), borderRadius: u(25), background: palette.sand, color: palette.deep, fontSize: u(17), fontWeight: 600 }}
          >
            Find a trip
          </span>
          <span
            className='inline-flex items-center'
            style={{
              height: u(50),
              paddingInline: u(24),
              borderRadius: u(25),
              boxShadow: `inset 0 0 0 ${u(1.5)} rgba(243,235,221,.7)`,
              fontSize: u(17),
              fontWeight: 600
            }}
          >
            How hard is it?
          </span>
        </div>
      </div>
      <div className='absolute' style={{ right: u(96), top: u(236), opacity: card, transform: `translateY(${u((1 - card) * 140)})` }}>
        <HeroExplorer pos={pos} selected={t >= 4.9 ? 3 : 2} />
      </div>
      <div
        className='absolute flex items-center'
        style={{ left: u(96), bottom: u(44), gap: u(14), color: palette.foam, fontSize: u(14), ...rise(3.4, 4.4, 8) }}
      >
        <TideLine width={60} color={palette.foam} stroke={1.4} dot={false} />
        <span>Cornwall · Pembrokeshire · Northumberland · Dingle</span>
      </div>
    </div>
  );
}

export const stills: Still[] = [
  { key: 'cover', width: 1440, height: 756, render: () => <Cover /> },
  { key: 'home', width: 1440, height: 900, render: () => <HomeStill /> },
  { key: 'trip', width: 1440, height: 900, render: () => <TripStill /> },
  { key: 'difficulty', width: 1440, height: 900, render: () => <DifficultyStill /> },
  { key: 'brandSheet', width: 1440, height: 900, render: () => <BrandSheet /> },
  { key: 'luggageTag', width: 1200, height: 1200, render: () => <LuggageStill /> },
  { key: 'mobile', width: 1200, height: 1200, render: () => <MobileStill /> },
  { key: 'heroPoster', width: 1440, height: 900, render: () => <HeroScene at={HERO_LENGTH} /> },
  { key: 'seaStill', width: 1040, height: 832, render: () => <SeaTexture time={SEA_STILL_TIME} /> }
];
