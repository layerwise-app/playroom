import type { ReactNode } from 'react';
import { BrowserWindow, Phone } from '~/components/frames';
import { u } from '~/components/stage';
import type { Still } from '~/content/stills';
import { CheckGlyph, ChimeGlyph, SpeakerGlyph, TextGlyph } from './parts';
import {
  CaregiverTextScreen,
  HomeScreen,
  OldAlarmScreen,
  PillIdScreen,
  SetupScreen,
  TodayScreen,
  WeeklyScreen
} from './screens';
import { fontFamily, palette } from './theme';

const p = palette;
const PHONE_W = 300;
const PHONE_H = 620;

/** Places a child drawn at its own size, scaled up, at stage coordinates. */
function Scaled({
  x,
  y,
  scale,
  w = PHONE_W,
  h = PHONE_H,
  children
}: {
  x: number;
  y: number;
  scale: number;
  w?: number;
  h?: number;
  children: ReactNode;
}) {
  return (
    <div className='absolute' style={{ left: u(x), top: u(y), width: u(w * scale), height: u(h * scale) }}>
      <div style={{ width: u(w), height: u(h), transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        {children}
      </div>
    </div>
  );
}

function Canvas({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <div className='absolute inset-0 overflow-hidden' style={{ background: bg, fontFamily, color: p.ink }}>
      {children}
    </div>
  );
}

/** A designer's note: a dot on the screen and a hairline out to the text. */
function Note({
  x,
  y,
  to,
  side,
  width = 300,
  color = p.ink,
  children
}: {
  /** The dot, in stage units. */
  x: number;
  y: number;
  /** Where the text starts (left side: where it ends). */
  to: number;
  side: 'left' | 'right';
  width?: number;
  color?: string;
  children: ReactNode;
}) {
  const left = side === 'right' ? x : to;
  const lineW = Math.abs(to - x);
  return (
    <>
      <span
        className='absolute'
        style={{ left: u(left), top: u(y), width: u(lineW), height: 0, borderTop: `${u(1.5)} solid ${color}`, opacity: 0.55 }}
      />
      <span
        className='absolute rounded-full'
        style={{ left: u(x - 6), top: u(y - 6), width: u(12), height: u(12), background: color, boxShadow: `0 0 0 ${u(4)} rgba(255,255,255,.55)` }}
      />
      <p
        className='absolute'
        style={{
          top: u(y - 14),
          width: u(width),
          ...(side === 'right' ? { left: u(to + 16) } : { left: u(to - 16 - width), textAlign: 'right' }),
          fontSize: u(22),
          lineHeight: 1.3,
          color,
          textWrap: 'balance'
        }}
      >
        {children}
      </p>
    </>
  );
}

/* Ada's morning reminder: the AFTER. Shares its size with oldAlarm. */
function ReminderStill() {
  return (
    <Canvas bg={p.marigold}>
      <Scaled x={495} y={74} scale={1.5}>
        <Phone time='8:00' screen={p.cream}>
          <HomeScreen phase='ask' footer />
        </Phone>
      </Scaled>
      <Note x={528} y={342} to={420} side='left'>
        One question per screen
      </Note>
      <Note x={904} y={207} to={1000} side='right' width={300}>
        Her whole day in four parts, so she can check before she takes a second dose
      </Note>
      <Note x={900} y={420} to={1000} side='right' width={300}>
        Pills drawn as they look. Names come second.
      </Note>
      <Note x={549} y={509} to={420} side='left' width={290}>
        Two answers as wide as the screen. Neither one is “dismiss.”
      </Note>
      <Note x={527} y={718} to={420} side='left' width={290}>
        Read aloud, for mornings without her glasses
      </Note>
      <Note x={913} y={808} to={1000} side='right' width={300}>
        It says what happens next, before it happens
      </Note>
    </Canvas>
  );
}

/* A typical pill-box alarm app: the BEFORE. */
function OldAlarmStill() {
  return (
    <Canvas bg='#C9CDD2'>
      <Scaled x={495} y={74} scale={1.5}>
        <Phone time='8:00' statusTone='light' screen='#121418'>
          <OldAlarmScreen />
        </Phone>
      </Scaled>
      <Note x={509} y={196} to={420} side='left' color='#22262C' width={290}>
        A red ALARM at full volume, three times a day
      </Note>
      <Note x={913} y={452} to={1000} side='right' color='#22262C' width={300}>
        Drug names in tiny capitals, copied off the pharmacy label
      </Note>
      <Note x={527} y={676} to={420} side='left' color='#22262C' width={290}>
        A streak that counts what you missed
      </Note>
      <Note x={913} y={916} to={1000} side='right' color='#22262C' width={300}>
        Snooze or Dismiss. To say “I took it,” find the tiny boxes.
      </Note>
    </Canvas>
  );
}

/* The day ring and timeline: 2 of 4 done. Pairs with pillId. */
function DayStill() {
  return (
    <Canvas bg={p.butter}>
      <Scaled x={352} y={92} scale={1.65}>
        <Phone time='2:15' screen={p.cream}>
          <TodayScreen />
        </Phone>
      </Scaled>
    </Canvas>
  );
}

/* Which one is this? Pairs with day. */
function PillIdStill() {
  return (
    <Canvas bg={p.butter}>
      <Scaled x={352} y={92} scale={1.65}>
        <Phone time='2:15' screen={p.cream}>
          <PillIdScreen />
        </Phone>
      </Scaled>
    </Canvas>
  );
}

function SetupStill() {
  return (
    <Canvas bg={p.greenSoft}>
      <BrowserWindow
        url='marigold.northside.org/setup/ada'
        className='absolute'
        style={{ left: u(60), top: u(48), width: u(1320), height: u(820) }}
      >
        <SetupScreen />
      </BrowserWindow>
    </Canvas>
  );
}

function WeeklyStill() {
  return (
    <Canvas bg={p.marigold}>
      <BrowserWindow
        url='marigold.northside.org/family/ada'
        className='absolute'
        style={{ left: u(90), top: u(60), width: u(1260), height: u(780) }}
      >
        <WeeklyScreen />
      </BrowserWindow>
    </Canvas>
  );
}

const ladder = [
  {
    time: '6:00 pm',
    icon: <ChimeGlyph size={26} color={p.green} />,
    title: 'A soft chime',
    body: 'Two notes on Ada’s phone. The question waits on screen.'
  },
  {
    time: '6:15 pm',
    icon: <SpeakerGlyph size={26} color={p.green} />,
    title: 'A spoken reminder',
    body: '“Ada, it’s time for your evening pills.” Said once, in a calm voice.'
  },
  {
    time: '6:45 pm',
    icon: <TextGlyph size={26} color={p.green} />,
    title: 'A text to Daniel',
    body: 'Only after 45 minutes with no answer. Never an alarm.'
  },
  {
    time: '7:01 pm',
    icon: <CheckGlyph size={26} color={p.cream} />,
    title: 'Ada answers',
    body: 'She was at her sister’s. Evening pills taken.'
  }
];

function CaregiverTextStill() {
  return (
    <Canvas bg={p.green}>
      <div className='absolute' style={{ left: u(150), top: u(170), width: u(560), color: p.cream }}>
        <p style={{ fontSize: u(20), color: p.marigold, fontWeight: 700 }}>Saturday, March 9</p>
        <h2 style={{ fontSize: u(44), fontWeight: 700, lineHeight: 1.1, marginTop: u(8), textWrap: 'balance' }}>
          Ada’s evening pills, when she doesn’t answer
        </h2>
        <ol className='relative' style={{ marginTop: u(48) }}>
          <span
            aria-hidden
            className='absolute'
            style={{ left: u(127), top: u(28), bottom: u(60), width: 0, borderLeft: `${u(2)} dashed rgba(255,248,235,.3)` }}
          />
          {ladder.map((step, i) => (
            <li key={step.time} className='relative flex items-start' style={{ gap: u(24), paddingBottom: u(i === ladder.length - 1 ? 0 : 34) }}>
              <span className='tabular shrink-0' style={{ textAlign: 'right', width: u(80), fontSize: u(20), fontWeight: 700, color: p.marigold, paddingTop: u(14) }}>
                {step.time}
              </span>
              <span
                className='relative flex shrink-0 items-center justify-center rounded-full'
                style={{
                  width: u(48),
                  height: u(48),
                  background: i === ladder.length - 1 ? p.marigoldDeep : p.cream
                }}
              >
                {step.icon}
              </span>
              <div style={{ paddingTop: u(8) }}>
                <p style={{ fontSize: u(24), fontWeight: 700 }}>{step.title}</p>
                <p style={{ fontSize: u(19), lineHeight: 1.4, opacity: 0.82, marginTop: u(4), maxWidth: u(360) }}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <Scaled x={830} y={84} scale={1.48}>
        <Phone time='7:02' screen='#FFFFFF'>
          <CaregiverTextScreen />
        </Phone>
      </Scaled>
    </Canvas>
  );
}

/* Cover: Ada's question in the middle, her day on the left, Daniel's text on the right. */
function Cover() {
  return (
    <Canvas bg={p.marigold}>
      <Scaled x={150} y={168} scale={1.08}>
        <Phone time='2:15' screen={p.cream}>
          <TodayScreen />
        </Phone>
      </Scaled>
      <Scaled x={980} y={168} scale={1.08}>
        <Phone time='7:02' screen='#FFFFFF'>
          <CaregiverTextScreen />
        </Phone>
      </Scaled>
      <Scaled x={525} y={62} scale={1.3}>
        <Phone time='8:00' screen={p.cream}>
          <HomeScreen phase='ask' footer />
        </Phone>
      </Scaled>
    </Canvas>
  );
}

export const stills: Still[] = [
  { key: 'cover', width: 1440, height: 756, render: () => <Cover /> },
  { key: 'reminder', width: 1440, height: 1080, render: () => <ReminderStill /> },
  { key: 'oldAlarm', width: 1440, height: 1080, render: () => <OldAlarmStill /> },
  { key: 'day', width: 1200, height: 1200, render: () => <DayStill /> },
  { key: 'pillId', width: 1200, height: 1200, render: () => <PillIdStill /> },
  { key: 'setup', width: 1440, height: 900, render: () => <SetupStill /> },
  { key: 'caregiverText', width: 1440, height: 1080, render: () => <CaregiverTextStill /> },
  { key: 'weekly', width: 1440, height: 900, render: () => <WeeklyStill /> }
];
