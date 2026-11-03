import type { CSSProperties, ReactNode } from 'react';
import { BrowserWindow, Phone } from '~/components/frames';
import { u } from '~/components/stage';
import type { Still } from '~/content/stills';
import { CritNightPoster, NightMarketPoster, RisoPrint, TypeTeaPoster, paperGrain, riso } from './riso';
import {
  CritNightSheet,
  CritWallScreen,
  EventsScreen,
  KitPage,
  MemberCardBack,
  MemberCardFront,
  PosterGeneratorScreen
} from './screens';
import { fontFamily, palette } from './theme';

const shadow = (depth: number) =>
  `0 ${u(1)} ${u(2)} rgba(27,27,58,.14), 0 ${u(depth)} ${u(depth * 1.6)} ${u(-depth * 0.7)} rgba(27,27,58,.5)`;

/** A full-bleed field of one ink, with grain. */
function Field({ color, children, grain = 'ink' }: { color: string; children: ReactNode; grain?: 'ink' | 'paper' }) {
  return (
    <div className='absolute inset-0 overflow-hidden' style={{ ...riso(color, 260, grain), fontFamily, color: palette.ink }}>
      {children}
    </div>
  );
}

function Place({ x, y, w, h, rot = 0, children, style }: { x: number; y: number; w?: number; h?: number; rot?: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className='absolute'
      style={{ left: u(x), top: u(y), width: w ? u(w) : undefined, height: h ? u(h) : undefined, transform: rot ? `rotate(${rot}deg)` : undefined, ...style }}
    >
      {children}
    </div>
  );
}

/** Render a screen at its natural size, scaled. */
function Scaled({ w, h, scale, children }: { w: number; h: number; scale: number; children: ReactNode }) {
  return (
    <div style={{ width: u(w * scale), height: u(h * scale) }}>
      <div style={{ width: u(w), height: u(h), transform: `scale(${scale})`, transformOrigin: '0 0' }}>{children}</div>
    </div>
  );
}

function Tape({ style }: { style: CSSProperties }) {
  return (
    <span
      aria-hidden
      className='absolute'
      style={{
        width: u(84),
        height: u(26),
        background: 'rgba(250, 247, 238, 0.7)',
        backgroundImage: paperGrain,
        backgroundSize: `${u(160)} ${u(160)}`,
        boxShadow: '0 0 0 1px rgba(27,27,58,.06)',
        ...style
      }}
    />
  );
}

function Taped({ children, depth = 22 }: { children: ReactNode; depth?: number }) {
  return (
    <div className='relative'>
      <div style={{ boxShadow: shadow(depth) }}>{children}</div>
      <Tape style={{ left: u(-22), top: u(-8), transform: 'rotate(-34deg)' }} />
      <Tape style={{ right: u(-22), top: u(-8), transform: 'rotate(32deg)' }} />
    </div>
  );
}

const fill = { width: '100%', height: 'auto' } as const;

/* ------------------------------------------------------------------ */

function Cover() {
  return (
    <Field color={palette.pink}>
      <Place x={350} y={74}>
        <BrowserWindow url='studiohours.ashby.edu/wall' style={{ width: u(1240 * 0.66), height: u(790 * 0.66) }}>
          <Scaled w={1240} h={760} scale={0.66}>
            <div className='relative' style={{ width: u(1240), height: u(760) }}>
              <CritWallScreen />
            </div>
          </Scaled>
        </BrowserWindow>
      </Place>
      <Place x={92} y={112} w={330} rot={-5}>
        <Taped depth={30}>
          <NightMarketPoster style={fill} />
        </Taped>
      </Place>
      <Place x={1098} y={150} rot={3}>
        <Phone width={300} height={620} screen={palette.paper}>
          <EventsScreen />
        </Phone>
      </Place>
    </Field>
  );
}

/** A painted block wall in a campus hallway. */
function BlockWall() {
  return (
    <svg aria-hidden className='absolute inset-0' style={{ width: '100%', height: '100%' }} viewBox='0 0 1440 810' preserveAspectRatio='none'>
      <defs>
        <pattern id='sh-blocks' width='240' height='120' patternUnits='userSpaceOnUse' y='-40'>
          <path d='M0 0.5 H240 M0 60.5 H240 M0.5 0 V60 M120.5 60 V120' stroke='rgba(27,27,58,.09)' strokeWidth='2' fill='none' />
          <path d='M0 2.5 H240 M0 62.5 H240' stroke='rgba(255,255,255,.5)' strokeWidth='1.5' fill='none' />
        </pattern>
        <linearGradient id='sh-light' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor='#fff' stopOpacity='.18' />
          <stop offset='1' stopColor='#1B1B3A' stopOpacity='.08' />
        </linearGradient>
      </defs>
      <rect width='1440' height='810' fill='url(#sh-blocks)' />
      <rect width='1440' height='810' fill='url(#sh-light)' />
    </svg>
  );
}

function PosterSeries() {
  const w = 372;
  return (
    <Field color='#E9E4D8' grain='paper'>
      <BlockWall />
      <Place x={86} y={128} w={w} rot={-1.4}>
        <Taped>
          <NightMarketPoster style={fill} />
        </Taped>
      </Place>
      <Place x={534} y={112} w={w} rot={0.7}>
        <Taped>
          <CritNightPoster style={fill} />
        </Taped>
      </Place>
      <Place x={982} y={134} w={w} rot={-0.5}>
        <Taped>
          <TypeTeaPoster style={fill} />
        </Taped>
      </Place>
    </Field>
  );
}

function CritWall() {
  return (
    <Field color={palette.blue}>
      <Place x={100} y={55}>
        <BrowserWindow url='studiohours.ashby.edu/wall' style={{ width: u(1240), height: u(790) }}>
          <CritWallScreen />
        </BrowserWindow>
      </Place>
    </Field>
  );
}

function EventsMobile() {
  return (
    <Field color={palette.pink}>
      <Place x={590} y={-40} w={560} h={560}>
        <RisoPrint
          width={560}
          height={560}
          paper='transparent'
          seed={41}
          grain={0.6}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          blend={false}
          pink={<circle cx={150} cy={410} r={300} />}
          blue={<rect x={150} y={-20} width={520} height={430} />}
        />
      </Place>
      <Place x={405} y={150}>
        <Phone width={390} height={880} screen={palette.paper}>
          <EventsScreen />
        </Phone>
      </Place>
    </Field>
  );
}

function MemberCard() {
  const scale = 1.3;
  return (
    <Field color={palette.blue}>
      <Place x={150} y={190} rot={-6}>
        <div style={{ boxShadow: shadow(30), borderRadius: u(18 * scale) }}>
          <Scaled w={520} h={328} scale={scale}>
            <MemberCardFront />
          </Scaled>
        </div>
      </Place>
      <Place x={400} y={610} rot={4}>
        <div style={{ boxShadow: shadow(34), borderRadius: u(18 * scale) }}>
          <Scaled w={520} h={328} scale={scale}>
            <MemberCardBack />
          </Scaled>
        </div>
      </Place>
    </Field>
  );
}

function PosterGenerator() {
  return (
    <Field color={palette.pink}>
      <Place x={80} y={50}>
        <BrowserWindow url='studiohours.ashby.edu/poster' style={{ width: u(1280), height: u(800) }}>
          <PosterGeneratorScreen />
        </BrowserWindow>
      </Place>
    </Field>
  );
}

function Kit() {
  return (
    <Field color={palette.newsprint} grain='paper'>
      <Place x={664} y={90}>
        <BrowserWindow url='studiohours.ashby.edu/kit' style={{ width: u(700), height: u(720) }}>
          <KitPage />
        </BrowserWindow>
      </Place>
      <Place x={92} y={70} rot={-2.2}>
        <div style={{ boxShadow: shadow(28) }}>
          <CritNightSheet />
        </div>
      </Place>
    </Field>
  );
}

export const stills: Still[] = [
  { key: 'cover', width: 1440, height: 756, render: () => <Cover /> },
  { key: 'posterSeries', width: 1440, height: 810, render: () => <PosterSeries /> },
  { key: 'critWall', width: 1440, height: 900, render: () => <CritWall /> },
  { key: 'memberCard', width: 1200, height: 1200, render: () => <MemberCard /> },
  { key: 'eventsMobile', width: 1200, height: 1200, render: () => <EventsMobile /> },
  { key: 'posterGenerator', width: 1440, height: 900, render: () => <PosterGenerator /> },
  { key: 'kit', width: 1440, height: 900, render: () => <Kit /> }
];
