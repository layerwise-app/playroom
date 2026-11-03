import type { CSSProperties, ReactNode } from 'react';
import { DemoCursor } from '~/components/demo/director';
import { at, u } from '~/components/stage';
import { PROMPTS } from './demo';
import type { Prompt } from './demo';
import {
  CritNightPoster,
  FORMAT,
  LogoMark,
  NightMarketPoster,
  RisoPrint,
  TypeTeaPoster,
  Wordmark,
  deep,
  formatRing,
  inkGrain,
  paperGrain,
  riso
} from './riso';
import { fontFamily, palette } from './theme';

const { pink, blue, overprint, ink, inkSoft, paper, newsprint, white } = palette;
const rule = 'rgba(27,27,58,.12)';
const tabular: CSSProperties = { fontVariantNumeric: 'tabular-nums' };

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

export const PEOPLE = {
  jun: { name: 'Jun', color: pink, text: ink },
  amara: { name: 'Amara', color: blue, text: white },
  theo: { name: 'Theo', color: overprint, text: white },
  priya: { name: 'Priya', color: ink, text: white },
  marco: { name: 'Marco', color: blue, text: white },
  lena: { name: 'Lena', color: pink, text: ink }
};
type Who = keyof typeof PEOPLE;

/** A sticky note as the crit wall draws it. */
export function NoteCard({
  prompt,
  text,
  who,
  width = 160,
  size = 15,
  rot = 0,
  style
}: {
  prompt: Prompt;
  text: string;
  who: Who | 'you';
  width?: number;
  size?: number;
  rot?: number;
  style?: CSSProperties;
}) {
  const p = PROMPTS[prompt];
  const person = who === 'you' ? null : PEOPLE[who];
  return (
    <div
      style={{
        width: u(width),
        padding: `${u(size * 0.75)} ${u(size * 0.85)} ${u(size * 0.7)}`,
        backgroundColor: p.tint,
        backgroundImage: `${inkGrain}, ${paperGrain}`,
        backgroundSize: `${u(120)} ${u(120)}, ${u(180)} ${u(180)}`,
        borderRadius: u(2),
        transform: `rotate(${rot}deg)`,
        boxShadow: `0 ${u(1)} ${u(1)} rgba(27,27,58,.12), 0 ${u(size * 0.6)} ${u(size * 0.9)} ${u(-size * 0.5)} rgba(27,27,58,.34)`,
        color: ink,
        ...style
      }}
    >
      <div className='flex items-center' style={{ gap: u(size * 0.4), color: p.deep, fontSize: u(size * 0.95), fontWeight: 750, lineHeight: 1.1 }}>
        <span style={{ width: u(size * 0.55), height: u(size * 0.55), borderRadius: '50%', background: p.solid }} />
        {p.label}…
      </div>
      <p style={{ marginTop: u(size * 0.3), fontSize: u(size), lineHeight: 1.28, fontWeight: 500, textWrap: 'pretty' }}>{text}</p>
      <div className='flex items-center' style={{ marginTop: u(size * 0.45), gap: u(size * 0.32), fontSize: u(size * 0.85), color: inkSoft, fontWeight: 600, lineHeight: 1 }}>
        <span style={{ width: u(size * 0.45), height: u(size * 0.45), borderRadius: '50%', background: person ? person.color : ink }} />
        {person ? person.name : 'You'}
      </div>
    </div>
  );
}

function Avatar({ who, size = 26, ring = paper }: { who: Who; size?: number; ring?: string }) {
  const p = PEOPLE[who];
  return (
    <span
      className='flex items-center justify-center'
      style={{
        width: u(size),
        height: u(size),
        borderRadius: '50%',
        background: p.color,
        color: p.text,
        fontSize: u(size * 0.46),
        fontWeight: 750,
        boxShadow: `0 0 0 ${u(2)} ${ring}`
      }}
    >
      {p.name[0]}
    </span>
  );
}

/** The web app's top bar. */
function AppHeader({ active, right }: { active: string; right?: ReactNode }) {
  return (
    <header
      className='flex shrink-0 items-center justify-between'
      style={{ height: u(56), paddingInline: u(22), borderBottom: `1px solid ${rule}`, background: paper }}
    >
      <div className='flex items-center' style={{ gap: u(28) }}>
        <div className='flex items-center' style={{ gap: u(9) }}>
          <LogoMark size={24} flat />
          <Wordmark size={18} />
        </div>
        <nav className='flex items-center' style={{ gap: u(4), fontSize: u(14), fontWeight: 600 }}>
          {['Crit wall', 'This week', 'Poster generator', 'Kit'].map((item) => (
            <span
              key={item}
              style={{
                padding: `${u(7)} ${u(11)}`,
                borderRadius: u(7),
                color: item === active ? ink : inkSoft,
                background: item === active ? newsprint : 'transparent'
              }}
            >
              {item}
            </span>
          ))}
        </nav>
      </div>
      {right}
    </header>
  );
}

function Glyph({ d, size = 14, color = 'currentColor', width = 1.8 }: { d: string; size?: number; color?: string; width?: number }) {
  return (
    <svg viewBox='0 0 16 16' aria-hidden style={{ width: u(size), height: u(size), flexShrink: 0 }}>
      <path d={d} fill='none' stroke={color} strokeWidth={width} strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}
const PIN = 'M8 14.5 C8 14.5 3.2 9.6 3.2 6.4 A4.8 4.8 0 0 1 12.8 6.4 C12.8 9.6 8 14.5 8 14.5 Z M8 4.6 A1.8 1.8 0 1 0 8.01 4.6';
const CHECK = 'M3 8.5 L6.4 11.8 L13 4.6';

/* ------------------------------------------------------------------ */
/* Crit wall, desktop                                                  */
/* ------------------------------------------------------------------ */

const QUEUE = [
  { time: '6:30', name: 'Noor Haddad', piece: 'Night Market poster', major: 'Graphic Design ’26', state: 'now' as const },
  { time: '6:45', name: 'Priya Nair', piece: 'Thesis type specimen', major: 'Industrial Design ’26', state: 'next' as const },
  { time: '7:00', name: 'Marco Bellini', piece: 'Bus tracker onboarding', major: 'Computer Science ’25', state: 'later' as const },
  { time: '7:15', name: 'Lena Fischer', piece: 'Ceramics show postcard', major: 'Studio Art ’27', state: 'later' as const },
  { time: '7:30', name: 'Sol Ahmadi', piece: 'Portfolio site, about page', major: 'Architecture ’26', state: 'later' as const }
];

const WALL: { prompt: Prompt; text: string; who: Who; x: number; y: number; rot: number }[] = [
  { prompt: 'whatif', who: 'amara', text: 'the pink only marks the time? Lanterns could go blue.', x: 26, y: 34, rot: -2.2 },
  { prompt: 'noticed', who: 'jun', text: 'the date is the first thing I read, which is right.', x: 34, y: 222, rot: 1.6 },
  { prompt: 'noticed', who: 'lena', text: 'the lanterns feel warm before I read a single word.', x: 22, y: 404, rot: -1.1 },
  { prompt: 'noticed', who: 'amara', text: 'the title goes muddy where it crosses the lanterns.', x: 512, y: 40, rot: 2.1 },
  { prompt: 'wonder', who: 'theo', text: 'if first-years know which quad. Is it North?', x: 506, y: 226, rot: -1.6 },
  { prompt: 'whatif', who: 'marco', text: 'the lantern string led your eye down to the place?', x: 516, y: 410, rot: 1.3 },
  { prompt: 'wonder', who: 'priya', text: 'if “12 stalls” should be bigger. It’s why I’d go.', x: 268, y: 506, rot: -0.9 }
];

export function CritWallScreen() {
  return (
    <div className='absolute inset-0 flex flex-col' style={{ background: paper, color: ink, fontFamily }}>
      <AppHeader
        active='Crit wall'
        right={
          <div className='flex items-center' style={{ gap: u(16) }}>
            <span style={{ fontSize: u(14), color: inkSoft, fontWeight: 550 }}>Thursday crit night · Hale Hall B14</span>
            <div className='flex items-center'>
              {(['jun', 'amara', 'theo', 'priya', 'lena'] as Who[]).map((w, i) => (
                <span key={w} style={{ marginLeft: i ? u(-6) : 0, zIndex: 9 - i }}>
                  <Avatar who={w} size={28} />
                </span>
              ))}
              <span style={{ marginLeft: u(8), fontSize: u(13), fontWeight: 650, color: inkSoft, ...tabular }}>+9 here</span>
            </div>
            <span
              style={{ fontSize: u(14), fontWeight: 700, padding: `${u(9)} ${u(14)}`, borderRadius: u(9), background: ink, color: paper }}
            >
              Pin your work
            </span>
          </div>
        }
      />
      <div className='flex min-h-0 flex-1'>
        {/* Tonight's queue */}
        <aside className='flex shrink-0 flex-col' style={{ width: u(272), borderRight: `1px solid ${rule}`, padding: u(20), gap: u(14) }}>
          <div>
            <div style={{ fontSize: u(19), fontWeight: 750, letterSpacing: '-0.01em' }}>Tonight</div>
            <div style={{ fontSize: u(13.5), color: inkSoft, fontWeight: 500, marginTop: u(2) }}>5 crits, 15 minutes each</div>
          </div>
          <ol className='flex flex-col' style={{ gap: u(4) }}>
            {QUEUE.map((q) => {
              const now = q.state === 'now';
              return (
                <li
                  key={q.time}
                  className='flex'
                  style={{
                    gap: u(12),
                    padding: `${u(10)} ${u(12)}`,
                    borderRadius: u(10),
                    background: now ? white : 'transparent',
                    boxShadow: now ? `0 0 0 1px ${rule}, 0 ${u(4)} ${u(10)} ${u(-6)} rgba(27,27,58,.3)` : undefined
                  }}
                >
                  <span style={{ fontSize: u(14), fontWeight: 700, width: u(34), color: now ? ink : inkSoft, ...tabular }}>{q.time}</span>
                  <div className='min-w-0 flex-1'>
                    <div style={{ fontSize: u(14.5), fontWeight: 700 }}>{q.name}</div>
                    <div style={{ fontSize: u(13), color: inkSoft, marginTop: u(1), lineHeight: 1.3 }}>{q.piece}</div>
                    {now ? (
                      <div className='flex items-center' style={{ marginTop: u(9), gap: u(8) }}>
                        <span style={{ fontSize: u(12.5), fontWeight: 700, padding: `${u(4)} ${u(8)}`, borderRadius: u(6), background: pink, color: ink }}>
                          Notes
                        </span>
                        <span style={{ fontSize: u(13), fontWeight: 650, ...tabular }}>4:12 left</span>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
          <div className='mt-auto' style={{ padding: u(14), borderRadius: u(10), ...riso(newsprint) }}>
            <div style={{ fontSize: u(13.5), fontWeight: 750 }}>Every crit is 15 minutes</div>
            <div className='flex' style={{ gap: u(3), marginTop: u(10), height: u(8) }}>
              {FORMAT.map((f) => (
                <span
                  key={f.at}
                  style={{
                    flex: f.min,
                    borderRadius: u(2),
                    background: f.ink === 'pink' ? pink : f.ink === 'blue' ? blue : overprint,
                    opacity: f.at < 5 ? 0.45 : 1
                  }}
                />
              ))}
            </div>
            <div className='grid' style={{ gridTemplateColumns: 'auto 1fr', columnGap: u(10), rowGap: u(4), marginTop: u(10), fontSize: u(13) }}>
              {FORMAT.map((f) => (
                <FormatRow key={f.at} at={f.at} name={f.name} now={f.at === 5} />
              ))}
            </div>
          </div>
        </aside>

        {/* The wall */}
        <main className='relative min-w-0 flex-1 overflow-hidden' style={riso(newsprint)}>
          <div className='absolute' style={{ left: u(216), top: u(56), width: u(264) }}>
            <div style={{ transform: 'rotate(-0.6deg)', boxShadow: `0 ${u(1)} ${u(1)} rgba(27,27,58,.12), 0 ${u(16)} ${u(26)} ${u(-14)} rgba(27,27,58,.45)` }}>
              <NightMarketPoster version='draft' style={{ width: '100%', height: 'auto' }} />
            </div>
            <TapeStrip style={{ left: u(-16), top: u(-8), transform: 'rotate(-32deg)' }} />
            <TapeStrip style={{ right: u(-16), top: u(-8), transform: 'rotate(30deg)' }} />
            <p className='text-center' style={{ marginTop: u(12), fontSize: u(13), color: inkSoft, fontWeight: 550 }}>
              Night Market poster, draft 3 · Noor Haddad
            </p>
          </div>
          {WALL.map((n) => (
            <div key={n.text} className='absolute' style={{ left: 0, top: 0, transform: at(n.x, n.y) }}>
              <NoteCard {...n} width={158} size={14.5} />
            </div>
          ))}
          <DemoCursor cursor={{ x: 640, y: 352, visible: true, pressed: false, duration: 0 }} label='Theo' color={overprint} ink={white} />
          <DemoCursor cursor={{ x: 186, y: 150, visible: true, pressed: false, duration: 0 }} label='Priya' color={ink} ink={white} />
          <WallToolbar style={{ left: '50%', bottom: u(18), transform: 'translateX(-50%)' }} />
        </main>

        {/* Summary */}
        <aside className='flex shrink-0 flex-col' style={{ width: u(272), borderLeft: `1px solid ${rule}`, padding: u(20), gap: u(18) }}>
          <div>
            <div style={{ fontSize: u(19), fontWeight: 750, letterSpacing: '-0.01em' }}>On this piece</div>
            <div style={{ fontSize: u(13.5), color: inkSoft, fontWeight: 500, marginTop: u(2), ...tabular }}>7 notes from 6 people</div>
          </div>
          <div className='flex flex-col' style={{ gap: u(10) }}>
            {(['noticed', 'wonder', 'whatif'] as Prompt[]).map((k) => {
              const count = WALL.filter((n) => n.prompt === k).length;
              return (
                <div key={k} className='flex items-center' style={{ gap: u(10), fontSize: u(14) }}>
                  <span style={{ width: u(76), fontWeight: 650 }}>{PROMPTS[k].label}</span>
                  <span className='relative flex-1' style={{ height: u(10), borderRadius: u(3), background: newsprint }}>
                    <span className='absolute inset-y-0 left-0' style={{ width: `${(count / 3) * 100}%`, borderRadius: u(3), background: PROMPTS[k].solid }} />
                  </span>
                  <span style={{ width: u(12), textAlign: 'right', fontWeight: 700, ...tabular }}>{count}</span>
                </div>
              );
            })}
          </div>
          <div style={{ padding: u(16), borderRadius: u(12), background: white, boxShadow: `0 0 0 1px ${rule}` }}>
            <div className='flex items-center justify-between' style={{ fontSize: u(12.5), fontWeight: 700, color: inkSoft }}>
              <span>NOOR’S PICK</span>
              <span style={tabular}>6:42 pm</span>
            </div>
            <p style={{ marginTop: u(10), fontSize: u(17), lineHeight: 1.3, fontWeight: 650, textWrap: 'pretty' }}>
              <span style={{ color: deep.over }}>What if</span> the pink only marks the time? Lanterns could go blue.
            </p>
            <div style={{ marginTop: u(10), fontSize: u(13), color: inkSoft, lineHeight: 1.4 }}>
              From Amara. Noor will bring draft 4 next Thursday.
            </div>
          </div>
          <div>
            <div style={{ fontSize: u(12.5), fontWeight: 700, color: inkSoft }}>DRAFTS ON THE WALL</div>
            <div className='flex flex-col' style={{ marginTop: u(8), gap: u(6) }}>
              {[
                ['Draft 1', 'Oct 31', '9 notes, picked “I noticed the date is hard to find.”'],
                ['Draft 2', 'Nov 7', '8 notes, picked “What if the date went huge?”'],
                ['Draft 3', 'Tonight', '7 notes so far']
              ].map(([name, when, note]) => (
                <div key={name} style={{ fontSize: u(13), lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 700 }}>{name}</span>
                  <span style={{ color: inkSoft, ...tabular }}> · {when}</span>
                  <div style={{ color: inkSoft }}>{note}</div>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-auto flex items-center' style={{ gap: u(12), padding: u(14), borderRadius: u(10), background: newsprint }}>
            <span style={{ fontSize: u(13), fontWeight: 700, ...tabular }}>6:45</span>
            <div>
              <div style={{ fontSize: u(12), fontWeight: 650, color: inkSoft }}>Up next</div>
              <div style={{ fontSize: u(14), fontWeight: 700 }}>Priya · Thesis type specimen</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FormatRow({ at: minute, name, now }: { at: number; name: string; now?: boolean }) {
  return (
    <>
      <span style={{ fontWeight: 700, color: now ? ink : inkSoft, ...tabular }}>{`${minute}:00`.padStart(5, ' ')}</span>
      <span style={{ fontWeight: now ? 700 : 500, color: now ? ink : inkSoft }}>
        {name}
        {now ? ' · now' : ''}
      </span>
    </>
  );
}

function TapeStrip({ style }: { style: CSSProperties }) {
  return (
    <span
      aria-hidden
      className='absolute'
      style={{
        width: u(56),
        height: u(18),
        background: 'rgba(250, 247, 238, 0.74)',
        backgroundImage: paperGrain,
        backgroundSize: `${u(140)} ${u(140)}`,
        boxShadow: '0 0 0 1px rgba(27,27,58,.06)',
        ...style
      }}
    />
  );
}

/** The prompt bar at the bottom of the wall. */
export function WallToolbar({ style, scale = 1 }: { style?: CSSProperties; scale?: number }) {
  const s = (n: number) => u(n * scale);
  return (
    <div
      className='absolute flex items-center'
      style={{
        gap: s(4),
        padding: s(5),
        borderRadius: s(13),
        background: paper,
        whiteSpace: 'nowrap',
        boxShadow: `0 0 0 1px rgba(27,27,58,.1), 0 ${s(8)} ${s(18)} ${s(-8)} rgba(27,27,58,.4)`,
        ...style
      }}
    >
      {(Object.keys(PROMPTS) as Prompt[]).map((k) => (
        <span key={k} className='flex items-center' style={{ height: s(34), gap: s(7), paddingInline: s(11), borderRadius: s(9), fontSize: s(14), fontWeight: 700 }}>
          <span style={{ width: s(14), height: s(14), borderRadius: s(2), background: PROMPTS[k].tint, boxShadow: `inset 0 0 0 ${s(1.5)} ${PROMPTS[k].solid}`, transform: 'rotate(-6deg)' }} />
          {PROMPTS[k].label}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* This week, phone                                                    */
/* ------------------------------------------------------------------ */

const DAYS = [
  { d: 'M', n: 11 },
  { d: 'T', n: 12 },
  { d: 'W', n: 13 },
  { d: 'T', n: 14, today: true },
  { d: 'F', n: 15 },
  { d: 'S', n: 16 },
  { d: 'S', n: 17 }
];

function EventCard({
  time,
  meridiem,
  title,
  place,
  detail,
  children,
  strong
}: {
  time: string;
  meridiem: string;
  title: string;
  place: string;
  detail: string;
  children?: ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        padding: u(14),
        borderRadius: u(14),
        background: white,
        boxShadow: strong ? `0 0 0 ${u(2)} ${ink}` : `0 0 0 1px ${rule}`
      }}
    >
      <div className='flex items-start' style={{ gap: u(12) }}>
        <span
          className='flex shrink-0 flex-col items-center justify-center'
          style={{ width: u(54), height: u(54), borderRadius: '50%', background: pink, color: ink, lineHeight: 1 }}
        >
          <span style={{ fontSize: u(17), fontWeight: 800, letterSpacing: '-0.02em', ...tabular }}>{time}</span>
          <span style={{ fontSize: u(11), fontWeight: 700, marginTop: u(2) }}>{meridiem}</span>
        </span>
        <div className='min-w-0 flex-1'>
          <div style={{ fontSize: u(17), fontWeight: 750, letterSpacing: '-0.01em', lineHeight: 1.15 }}>{title}</div>
          <div className='flex items-center' style={{ gap: u(4), marginTop: u(5), fontSize: u(14), fontWeight: 650, color: blue }}>
            <Glyph d={PIN} size={13} color={blue} width={1.7} />
            {place}
          </div>
          <div style={{ marginTop: u(4), fontSize: u(13), color: inkSoft, lineHeight: 1.35 }}>{detail}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

export function EventsScreen() {
  return (
    <div className='absolute inset-0 flex flex-col' style={{ ...riso(paper), color: ink, fontFamily }}>
      <div style={{ padding: `${u(6)} ${u(18)} 0` }}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center' style={{ gap: u(7) }}>
            <LogoMark size={20} flat />
            <Wordmark size={15} />
          </div>
          <span style={{ fontSize: u(12.5), fontWeight: 650, color: inkSoft }}>Ashby State</span>
        </div>
        <h1 style={{ marginTop: u(18), fontSize: u(32), fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1 }}>This week</h1>
        <div style={{ marginTop: u(6), fontSize: u(14), color: inkSoft, fontWeight: 500, ...tabular }}>Nov 11–17 · 6 things on, all free</div>
        <div className='flex justify-between' style={{ marginTop: u(16) }}>
          {DAYS.map((day) => (
            <div key={day.n} className='flex flex-col items-center' style={{ gap: u(5), width: u(40) }}>
              <span style={{ fontSize: u(11.5), fontWeight: 700, color: inkSoft }}>{day.d}</span>
              <span
                className='flex items-center justify-center'
                style={{
                  width: u(34),
                  height: u(34),
                  borderRadius: '50%',
                  fontSize: u(15),
                  fontWeight: 750,
                  background: day.today ? pink : 'transparent',
                  color: day.n < 14 ? 'rgba(27,27,58,.55)' : ink,
                  ...tabular
                }}
              >
                {day.n}
              </span>
              <span style={{ width: u(4), height: u(4), borderRadius: '50%', background: [11, 12, 14, 15, 16].includes(day.n) ? blue : 'transparent' }} />
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col' style={{ padding: `${u(16)} ${u(14)}`, gap: u(10) }}>
        <DayLabel>Today · Thursday</DayLabel>
        <EventCard strong time='6:30' meridiem='pm' title='Crit night' place='Hale Hall B14' detail='Bring anything unfinished. 15 minutes each, notes on the wall.'>
          <div className='flex items-center justify-between' style={{ marginTop: u(12), paddingTop: u(12), borderTop: `1px solid ${rule}` }}>
            <div className='flex items-center' style={{ gap: u(4) }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ width: u(12), height: u(12), borderRadius: u(2), background: i < 5 ? overprint : 'transparent', boxShadow: i < 5 ? undefined : `inset 0 0 0 ${u(1.5)} ${overprint}` }} />
              ))}
              <span style={{ marginLeft: u(6), fontSize: u(13), fontWeight: 650 }}>1 slot left</span>
            </div>
            <span style={{ fontSize: u(14), fontWeight: 750, padding: `${u(8)} ${u(13)}`, borderRadius: u(9), background: ink, color: paper }}>Take 7:45</span>
          </div>
        </EventCard>
        <DayLabel>Friday</DayLabel>
        <EventCard time='7:00' meridiem='pm' title='Night Market' place='North Quad, by the clock tower' detail='12 food stalls with the Ashby Food Co-op. Posters by Noor Haddad.' />
        <DayLabel>Saturday</DayLabel>
        <EventCard time='11:00' meridiem='am' title='Riso print day' place='Library print lab, ground floor' detail='Pink and blue drums. Bring a master or make one with us.' />
        <div
          className='flex items-center'
          style={{ gap: u(8), marginTop: u(2), padding: `${u(10)} ${u(12)}`, borderRadius: u(12), background: newsprint, fontSize: u(13), color: inkSoft, fontWeight: 550 }}
        >
          <Glyph d={CHECK} size={14} color={inkSoft} />
          Earlier: Type &amp; Tea, Portfolio clinic · 41 came
        </div>
      </div>

      <nav
        className='mt-auto flex justify-around'
        style={{ paddingBlock: `${u(10)} ${u(28)}`, borderTop: `1px solid ${rule}`, background: paper, fontSize: u(12), fontWeight: 700 }}
      >
        {['This week', 'Crit wall', 'Kit', 'Me'].map((t, i) => (
          <span key={t} className='flex flex-col items-center' style={{ gap: u(5), color: i === 0 ? ink : inkSoft }}>
            <span style={{ width: u(18), height: u(4), borderRadius: u(2), background: i === 0 ? pink : 'transparent' }} />
            {t}
          </span>
        ))}
      </nav>
    </div>
  );
}

function DayLabel({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: u(12.5), fontWeight: 750, color: inkSoft, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: u(4), paddingInline: u(4) }}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Membership card                                                     */
/* ------------------------------------------------------------------ */

const CARD = { w: 520, h: 328 };

export function MemberCardFront({ style }: { style?: CSSProperties }) {
  return (
    <div style={{ width: u(CARD.w), height: u(CARD.h), borderRadius: u(18), overflow: 'hidden', fontFamily, ...style }}>
      <RisoPrint
        width={CARD.w}
        height={CARD.h}
        seed={21}
        grain={1.2}
        shift={[1.8, -1.2]}
        style={{ width: '100%', height: '100%' }}
        label='Studio Hours membership card, front'
        pink={(ids) => (
          <>
            <circle cx={388} cy={214} r={152} />
            <rect x={0} y={0} width={CARD.w} height={12} mask={ids.screen} />
          </>
        )}
        blue={() => (
          <>
            <rect x={388} y={30} width={170} height={184} />
            <text x={30} y={78} fontSize={50} fontWeight={800} fill='currentColor' style={{ letterSpacing: '-0.035em' }}>Studio</text>
            <text x={30} y={124} fontSize={50} fontWeight={800} fill='currentColor' style={{ letterSpacing: '-0.035em' }}>Hours</text>
            <text x={32} y={160} fontSize={14} fontWeight={700} fill='currentColor' style={{ letterSpacing: '0.12em' }}>MEMBER 2024–25</text>
            <text x={30} y={252} fontSize={28} fontWeight={750} fill='currentColor' style={{ letterSpacing: '-0.02em' }}>Priya Nair</text>
            <text x={31} y={278} fontSize={15} fontWeight={550} fill='currentColor'>Industrial Design ’26</text>
            <text x={31} y={304} fontSize={13} fontWeight={700} fill='currentColor' style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em' }}>NO. 0214</text>
          </>
        )}
      />
    </div>
  );
}

export function MemberCardBack({ style }: { style?: CSSProperties }) {
  const ring = formatRing(410, 150, 62, 98);
  return (
    <div style={{ width: u(CARD.w), height: u(CARD.h), borderRadius: u(18), overflow: 'hidden', fontFamily, ...style }}>
      <RisoPrint
        width={CARD.w}
        height={CARD.h}
        seed={27}
        grain={1.2}
        shift={[-1.4, 1.2]}
        style={{ width: '100%', height: '100%' }}
        label='Studio Hours membership card, back, with the 15-minute crit format'
        pink={() => (
          <>
            {ring.pink}
            <text x={30} y={62} fontSize={30} fontWeight={800} fill='currentColor' style={{ letterSpacing: '-0.02em' }}>Thursdays 6:30</text>
          </>
        )}
        blue={() => (
          <>
            {ring.blue}
            <text x={30} y={90} fontSize={17} fontWeight={700} fill='currentColor'>Crit night · Hale Hall B14</text>
            <text x={30} y={136} fontSize={13} fontWeight={700} fill='currentColor' style={{ letterSpacing: '0.1em' }}>EVERY CRIT IS 15 MINUTES</text>
            {FORMAT.map((f, i) => (
              <g key={f.at}>
                <text x={30} y={166 + i * 26} fontSize={15} fontWeight={700} fill='currentColor' style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {`${f.at}:00`}
                </text>
                <text x={82} y={166 + i * 26} fontSize={15} fontWeight={550} fill='currentColor'>
                  {f.name}
                </text>
              </g>
            ))}
            <text x={30} y={304} fontSize={12.5} fontWeight={600} fill='currentColor'>studiohours.ashby.edu · Found this? Leave it in B14.</text>
            <text x={410} y={146} fontSize={26} fontWeight={800} textAnchor='middle' fill='currentColor' style={{ fontVariantNumeric: 'tabular-nums' }}>15</text>
            <text x={410} y={166} fontSize={12} fontWeight={700} textAnchor='middle' fill='currentColor'>min</text>
          </>
        )}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Poster generator                                                    */
/* ------------------------------------------------------------------ */

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <label className='flex flex-col' style={{ gap: u(6) }}>
      <span style={{ fontSize: u(13), fontWeight: 700 }}>{label}</span>
      <span
        style={{
          fontSize: u(15),
          padding: `${u(10)} ${u(12)}`,
          borderRadius: u(9),
          background: white,
          boxShadow: `inset 0 0 0 1px rgba(27,27,58,.2)`,
          fontWeight: 500,
          ...tabular
        }}
      >
        {value}
      </span>
      {hint ? <span style={{ fontSize: u(12.5), color: inkSoft }}>{hint}</span> : null}
    </label>
  );
}

const LAYOUTS: { name: string; poster: ReactNode }[] = [
  { name: 'Big time', poster: <NightMarketPoster style={{ width: '100%', height: 'auto' }} /> },
  { name: 'Quarter', poster: <CritNightPoster style={{ width: '100%', height: 'auto' }} /> },
  { name: 'Object', poster: <TypeTeaPoster style={{ width: '100%', height: 'auto' }} /> }
];

export function PosterGeneratorScreen() {
  return (
    <div className='absolute inset-0 flex flex-col' style={{ background: paper, color: ink, fontFamily }}>
      <AppHeader
        active='Poster generator'
        right={<span style={{ fontSize: u(13.5), color: inkSoft, fontWeight: 550 }}>Signed in as Priya · co-lead</span>}
      />
      <div className='flex min-h-0 flex-1'>
        <aside className='flex shrink-0 flex-col' style={{ width: u(400), padding: `${u(24)} ${u(26)}`, gap: u(16), borderRight: `1px solid ${rule}` }}>
          <div>
            <h2 style={{ fontSize: u(24), fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>New poster</h2>
            <p style={{ marginTop: u(6), fontSize: u(14), color: inkSoft, lineHeight: 1.4 }}>
              Two inks, one rule. Pink is the event and its time. Blue is everything you need to find it.
            </p>
          </div>
          <Field label='Event' value='Type & Tea' />
          <div className='grid' style={{ gap: u(12), gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <Field label='Day' value='Wed, Nov 13' />
            <Field label='Time' value='4:00 pm' />
          </div>
          <Field label='Where' value='Library 2F reading room' />
          <Field label='One line' value='Bring a type specimen. We bring the tea.' hint='Keep it under 50 characters. This one is 39.' />
          <div>
            <div style={{ fontSize: u(13), fontWeight: 700 }}>Layout</div>
            <div className='grid' style={{ gap: u(10), marginTop: u(8), gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              {LAYOUTS.map((l) => {
                const on = l.name === 'Object';
                return (
                  <div key={l.name} className='flex w-full flex-col items-center' style={{ gap: u(6) }}>
                    <div
                      style={{
                        width: '100%',
                        padding: u(5),
                        borderRadius: u(8),
                        background: on ? white : newsprint,
                        boxShadow: on ? `0 0 0 ${u(2)} ${ink}` : `inset 0 0 0 1px ${rule}`
                      }}
                    >
                      {l.poster}
                    </div>
                    <span style={{ fontSize: u(12.5), fontWeight: on ? 750 : 550, color: on ? ink : inkSoft }}>{l.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='flex items-start' style={{ gap: u(10), padding: u(12), borderRadius: u(10), background: newsprint, fontSize: u(13.5), lineHeight: 1.4 }}>
            <Glyph d={CHECK} size={16} color={blue} width={2.2} />
            <span>
              <span style={{ fontWeight: 700 }}>Ink rule holds.</span> Pink is only on the cup and the time. Everything you need to find it is blue.
            </span>
          </div>
        </aside>

        <main className='relative flex min-w-0 flex-1 flex-col' style={riso(newsprint)}>
          <div className='flex items-center justify-between' style={{ padding: `${u(18)} ${u(26)}` }}>
            <div className='flex items-center' style={{ gap: u(4), padding: u(4), borderRadius: u(10), background: paper, boxShadow: `0 0 0 1px ${rule}` }}>
              {['Both inks', 'Pink drum', 'Blue drum'].map((t, i) => (
                <span key={t} style={{ fontSize: u(13.5), fontWeight: 700, padding: `${u(7)} ${u(12)}`, borderRadius: u(7), background: i === 0 ? ink : 'transparent', color: i === 0 ? paper : inkSoft }}>
                  {t}
                </span>
              ))}
            </div>
            <span style={{ fontSize: u(13.5), color: inkSoft, fontWeight: 550 }}>11 × 17 in · preview at 40%</span>
          </div>
          <div className='flex flex-1 items-start justify-center' style={{ gap: u(40), paddingTop: u(2) }}>
            <div style={{ width: u(336), boxShadow: `0 ${u(1)} ${u(1)} rgba(27,27,58,.12), 0 ${u(22)} ${u(34)} ${u(-18)} rgba(27,27,58,.5)` }}>
              <TypeTeaPoster style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className='flex flex-col' style={{ gap: u(14), width: u(148) }}>
              <div style={{ fontSize: u(13), fontWeight: 750 }}>Masters for the riso</div>
              {(['pink', 'blue'] as const).map((drum, i) => (
                <div key={drum}>
                  <div style={{ boxShadow: `0 0 0 1px ${rule}, 0 ${u(8)} ${u(14)} ${u(-8)} rgba(27,27,58,.35)` }}>
                    <TypeTeaPoster mode={drum} style={{ width: '100%', height: 'auto' }} />
                  </div>
                  <div className='flex items-center' style={{ gap: u(6), marginTop: u(8), fontSize: u(13), fontWeight: 650 }}>
                    <span style={{ width: u(10), height: u(10), borderRadius: '50%', background: drum === 'pink' ? pink : blue }} />
                    Master {i + 1}, {drum} drum
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className='flex items-center justify-between'
            style={{ margin: `0 ${u(26)} ${u(22)}`, padding: `${u(14)} ${u(18)}`, borderRadius: u(12), background: paper, boxShadow: `0 0 0 1px ${rule}` }}
          >
            <div style={{ fontSize: u(13.5), color: inkSoft, lineHeight: 1.4 }}>
              <span style={{ color: ink, fontWeight: 700 }}>Print at the library riso,</span> ground floor. Pink drum first, then blue. 60 copies is about $9.
            </div>
            <span style={{ fontSize: u(14), fontWeight: 750, padding: `${u(10)} ${u(16)}`, borderRadius: u(9), background: ink, color: paper, whiteSpace: 'nowrap' }}>
              Download 2 masters
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The kit                                                             */
/* ------------------------------------------------------------------ */

const KIT = [
  { n: '01', name: 'Read me first', note: 'One page. How the club runs and who to call.', kind: 'PDF' },
  { n: '02', name: 'Crit night', note: 'The 15-minute format, plus the sign-up sheet.', kind: 'PDF' },
  { n: '03', name: 'Poster generator', note: 'studiohours.ashby.edu/poster', kind: 'Link' },
  { n: '04', name: 'Templates', note: '6 posters, the member card, an Instagram square.', kind: 'Folder' },
  { n: '05', name: 'Shared vault', note: '11 logins. Owned by both co-leads and the advisor.', kind: 'Vault' },
  { n: '06', name: 'Handover', note: 'One afternoon, last week of April. Checklist inside.', kind: 'PDF' }
];

export function KitPage() {
  return (
    <div className='absolute inset-0 flex flex-col' style={{ background: paper, color: ink, fontFamily }}>
      <AppHeader active='Kit' />
      <div style={{ padding: `${u(28)} ${u(34)}` }}>
        <h2 style={{ fontSize: u(30), fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1 }}>The kit</h2>
        <p style={{ marginTop: u(8), fontSize: u(15), color: inkSoft, lineHeight: 1.45, maxWidth: u(460) }}>
          Everything Studio Hours needs to keep going, in one folder. If you’re a new co-lead, start with 01.
        </p>
        <ol style={{ marginTop: u(20), borderTop: `1px solid ${rule}` }}>
          {KIT.map((k) => (
            <li key={k.n} className='flex items-center' style={{ gap: u(16), paddingBlock: u(12), borderBottom: `1px solid ${rule}` }}>
              <span style={{ fontSize: u(14), fontWeight: 750, color: inkSoft, width: u(22), ...tabular }}>{k.n}</span>
              <div className='flex-1'>
                <div style={{ fontSize: u(16), fontWeight: 700 }}>{k.name}</div>
                <div style={{ fontSize: u(13.5), color: inkSoft, marginTop: u(2) }}>{k.note}</div>
              </div>
              <span style={{ fontSize: u(12), fontWeight: 700, padding: `${u(4)} ${u(8)}`, borderRadius: u(6), background: newsprint, color: ink }}>{k.kind}</span>
            </li>
          ))}
        </ol>
        <div style={{ marginTop: u(22), fontSize: u(13), fontWeight: 750, letterSpacing: '0.04em', color: inkSoft }}>HANDOVERS</div>
        <div className='flex flex-col' style={{ marginTop: u(10), gap: u(8) }}>
          {[
            { when: 'Apr 2025', from: 'Jun & Amara', to: 'Priya & Sol' },
            { when: 'Apr 2026', from: 'Priya & Sol', to: 'Mateo & Hana' }
          ].map((h) => (
            <div key={h.when} className='flex items-center' style={{ gap: u(12), fontSize: u(14.5) }}>
              <span style={{ fontWeight: 700, width: u(70), ...tabular }}>{h.when}</span>
              <span style={{ fontWeight: 550 }}>
                {h.from} <span style={{ color: inkSoft }}>→</span> {h.to}
              </span>
              <span className='flex items-center' style={{ gap: u(4), marginLeft: 'auto', fontSize: u(13), color: inkSoft, fontWeight: 600 }}>
                <Glyph d={CHECK} size={13} color={blue} width={2} />
                0 files lost
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The one-page crit night sheet, printed in two inks on bright stock. */
export function CritNightSheet({ style }: { style?: CSSProperties }) {
  const ring = formatRing(100, 100, 58, 92);
  const stock = '#FDFBF6';
  return (
    <div
      className='relative overflow-hidden'
      style={{
        width: u(560),
        height: u(770),
        padding: `${u(36)} ${u(42)}`,
        backgroundColor: stock,
        backgroundImage: paperGrain,
        backgroundSize: `${u(240)} ${u(240)}`,
        color: blue,
        fontFamily,
        ...style
      }}
    >
      <div className='flex items-center justify-between' style={{ fontSize: u(13), fontWeight: 700 }}>
        <span className='flex items-center' style={{ gap: u(8) }}>
          <LogoMark size={22} />
          Studio Hours kit
        </span>
        <span style={tabular}>02 · Crit night</span>
      </div>
      <div className='flex items-start justify-between' style={{ marginTop: u(24) }}>
        <div>
          <h3 style={{ fontSize: u(44), fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.98, maxWidth: u(270), textWrap: 'balance' }}>
            How to run a crit night
          </h3>
          <p style={{ marginTop: u(14), fontSize: u(16), fontWeight: 600, lineHeight: 1.4, maxWidth: u(250) }}>
            Every crit is 15 minutes. Say each step out loud when the clock gets there.
          </p>
        </div>
        <RisoPrint width={200} height={200} paper='transparent' seed={31} grain={1.3} style={{ width: u(176), height: u(176), marginTop: u(-4) }} pink={ring.pink} blue={ring.blue} />
      </div>
      <ol className='flex flex-col' style={{ marginTop: u(18), gap: u(12) }}>
        {[
          ['0:00', 'Show it', '2 min. The maker says what it’s for and where they’re stuck. Nobody else talks.'],
          ['2:00', 'Ask', '3 min. Questions only. No fixes yet.'],
          ['5:00', 'Notes', '7 min. Everyone writes on the wall: I noticed, I wonder, What if. Sign your note.'],
          ['12:00', 'Pick one', '3 min. The maker picks one note to try by next week, and says which.']
        ].map(([time, name, body]) => (
          <li key={time} className='flex' style={{ gap: u(16) }}>
            <span style={{ width: u(58), fontSize: u(20), fontWeight: 800, color: name === 'Notes' ? overprint : name === 'Ask' ? blue : pink, ...tabular }}>{time}</span>
            <div className='flex-1'>
              <div style={{ fontSize: u(18), fontWeight: 800, letterSpacing: '-0.01em' }}>{name}</div>
              <div style={{ fontSize: u(14), fontWeight: 550, lineHeight: 1.38, marginTop: u(2) }}>{body}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className='grid' style={{ marginTop: u(20), gap: u(22), paddingTop: u(16), borderTop: `${u(2)} solid ${blue}`, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <div>
          <div style={{ fontSize: u(13), fontWeight: 800, letterSpacing: '0.08em' }}>BEFORE</div>
          <p style={{ marginTop: u(6), fontSize: u(13.5), fontWeight: 550, lineHeight: 1.4 }}>
            Book B14 in the student org portal (login is in the vault). Notes and markers are in cabinet 3.
          </p>
        </div>
        <div>
          <div style={{ fontSize: u(13), fontWeight: 800, letterSpacing: '0.08em' }}>AFTER</div>
          <p style={{ marginTop: u(6), fontSize: u(13.5), fontWeight: 550, lineHeight: 1.4 }}>
            Export the wall to the archive. Put the markers back. Last one out turns off the riso.
          </p>
        </div>
      </div>
      <div className='absolute' style={{ left: u(42), right: u(42), bottom: u(26), fontSize: u(12.5), fontWeight: 600 }}>
        If this page is wrong, fix it. The file is 02-crit-night in the kit folder.
      </div>
    </div>
  );
}
