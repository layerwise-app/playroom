import type { CSSProperties, ReactNode } from 'react';
import { u } from '~/components/stage';
import { TagGlyph, Wordmark, soft } from './brand';
import { RouteMap } from './map';
import { Scene } from './scenes';
import type { SceneKind } from './scenes';
import { days, hoursLabel, stops, tideLinePoints } from './route';
import SeaTexture from './texture';
import { fontFamily, palette } from './theme';

/*
 * Kittiwake's website, as real components with real data. Everything is set
 * in Fraunces with Softness at 100; numbers are tabular.
 */

export const paper = '#FAF6EE';

export const base: CSSProperties = { fontFamily, color: palette.ink, ...soft };

export const eyebrow: CSSProperties = {
  fontSize: u(12),
  fontWeight: 650,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: palette.sea
};

export type Trip = {
  name: string;
  route: string;
  country: string;
  days: number;
  hours: string;
  price: string;
  scene: SceneKind;
  months: string;
};

export const trips: Trip[] = [
  { name: 'Cornwall’s North Coast', route: 'Padstow to Bude', country: 'Cornwall', days: 6, hours: '2–6', price: '£1,180', scene: 'headland', months: 'Apr–Oct' },
  { name: 'The Pembrokeshire Coast', route: 'St Davids to Newport', country: 'Wales', days: 7, hours: '3½–6', price: '£1,240', scene: 'fields', months: 'Apr–Sep' },
  { name: 'Northumberland', route: 'Alnmouth to Bamburgh', country: 'England', days: 4, hours: '3–5', price: '£860', scene: 'castle', months: 'Mar–Oct' },
  { name: 'The Dingle Peninsula', route: 'Dingle to Castlegregory', country: 'Ireland', days: 7, hours: '4–6½', price: '€1,320', scene: 'beach', months: 'May–Sep' }
];

/* ------------------------------------------------------------------ */
/* Small parts                                                         */
/* ------------------------------------------------------------------ */

export function Pill({
  children,
  tone = 'deep',
  size = 15,
  style
}: {
  children: ReactNode;
  tone?: 'deep' | 'sand' | 'outline' | 'outlineSand';
  size?: number;
  style?: CSSProperties;
}) {
  const tones: Record<string, CSSProperties> = {
    deep: { background: palette.deep, color: palette.sand },
    sand: { background: palette.sand, color: palette.deep },
    outline: { boxShadow: `inset 0 0 0 ${u(1.5)} ${palette.ink}`, color: palette.ink },
    outlineSand: { boxShadow: `inset 0 0 0 ${u(1.5)} rgba(243,235,221,.7)`, color: palette.sand }
  };
  return (
    <span
      className='inline-flex items-center justify-center whitespace-nowrap'
      style={{
        fontSize: u(size),
        fontWeight: 600,
        height: u(size * 2.9),
        paddingInline: u(size * 1.35),
        borderRadius: u(size * 1.5),
        ...tones[tone],
        ...style
      }}
    >
      {children}
    </span>
  );
}

export function Nav({ tone = 'sand', active }: { tone?: 'sand' | 'sea'; active?: string }) {
  const onSea = tone === 'sea';
  const color = onSea ? palette.sand : palette.ink;
  return (
    <div
      className='relative z-10 flex items-center justify-between'
      style={{
        height: u(72),
        paddingInline: u(56),
        color,
        borderBottom: onSea ? 'none' : `1px solid ${palette.rule}`
      }}
    >
      <Wordmark size={24} color={color} />
      <div className='flex items-center' style={{ gap: u(34), fontSize: u(15.5), fontWeight: 500 }}>
        {['Trips', 'How hard is it?', 'Your bags', 'About us'].map((item) => (
          <span
            key={item}
            style={{
              opacity: onSea ? 0.92 : 1,
              paddingBlock: u(4),
              borderBottom: active === item ? `${u(2)} solid ${onSea ? palette.sand : palette.sea}` : `${u(2)} solid transparent`
            }}
          >
            {item}
          </span>
        ))}
        <Pill tone={onSea ? 'sand' : 'deep'} size={14.5}>
          Find a trip
        </Pill>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

export function HeroCopy({ style }: { style?: CSSProperties }) {
  return (
    <div style={{ color: palette.sand, ...style }}>
      <p style={{ ...eyebrow, color: palette.foam, opacity: 0.9 }}>Self-guided coastal walks · Britain and Ireland</p>
      <h1
        style={{
          fontSize: u(68),
          fontWeight: 520,
          lineHeight: 0.98,
          letterSpacing: '-0.022em',
          marginTop: u(18),
          textWrap: 'balance'
        }}
      >
        Walk the coast.
        <br />
        We’ll carry the rest.
      </h1>
      <p style={{ fontSize: u(19), lineHeight: 1.5, marginTop: u(22), maxWidth: u(480), opacity: 0.92 }}>
        We book the inns, take your bags ahead every morning, and tell you exactly how long each day
        is. You bring boots.
      </p>
      <div className='flex' style={{ gap: u(12), marginTop: u(28) }}>
        <Pill tone='sand' size={16}>
          Find a trip
        </Pill>
        <Pill tone='outlineSand' size={16}>
          How hard is it?
        </Pill>
      </div>
    </div>
  );
}

/** The route explorer as it sits in the homepage hero. */
export function HeroExplorer({ pos = 2, selected = Math.round(pos) + 1, style }: { pos?: number; selected?: number; style?: CSSProperties }) {
  return (
    <div
      className='flex flex-col'
      style={{
        width: u(468),
        background: palette.sand,
        borderRadius: u(22),
        padding: u(20),
        boxShadow: `0 ${u(30)} ${u(60)} ${u(-28)} rgba(4,24,26,.7), 0 ${u(2)} ${u(6)} rgba(4,24,26,.2)`,
        ...style
      }}
    >
      <div className='flex items-baseline justify-between'>
        <div>
          <p style={{ ...eyebrow, fontSize: u(11.5) }}>Our first route</p>
          <p style={{ fontSize: u(22), fontWeight: 600, marginTop: u(4), letterSpacing: '-0.01em' }}>Cornwall’s North Coast</p>
        </div>
        <p className='tabular' style={{ fontSize: u(13.5), color: palette.inkSoft }}>
          6 days · from <span style={{ color: palette.ink, fontWeight: 620 }}>£1,180</span>
        </p>
      </div>
      <div className='flex' style={{ gap: u(16), marginTop: u(14) }}>
        <div className='shrink-0 overflow-hidden' style={{ borderRadius: u(12), boxShadow: `inset 0 0 0 1px ${palette.rule}` }}>
          <RouteMap pos={pos} width={226} />
        </div>
        <div className='flex min-w-0 flex-1 flex-col'>
          {days.map((d) => {
            const on = d.day === selected;
            return (
              <div
                key={d.day}
                className='flex items-center'
                style={{
                  gap: u(10),
                  height: u(34),
                  paddingInline: u(8),
                  marginInline: u(-8),
                  borderRadius: u(9),
                  background: on ? palette.deep : 'transparent',
                  color: on ? palette.sand : palette.ink,
                  borderBottom: on ? 'none' : `1px solid ${palette.rule}`
                }}
              >
                <span className='tabular' style={{ fontSize: u(12), fontWeight: 650, width: u(12), opacity: on ? 1 : 0.7 }}>
                  {d.day}
                </span>
                <span className='min-w-0 flex-1 truncate' style={{ fontSize: u(13.5), fontWeight: on ? 620 : 480 }}>
                  {stops[d.day - 1].short}
                </span>
                <span className='tabular' style={{ fontSize: u(13), fontWeight: 560 }}>
                  {hoursLabel(d.hours)} h
                </span>
              </div>
            );
          })}
          <div className='mt-auto flex items-start' style={{ gap: u(8), paddingTop: u(12) }}>
            <TagGlyph size={16} />
            <p style={{ fontSize: u(12.5), lineHeight: 1.35 }}>
              Bags at {stops[selected - 1].inn}{' '}
              <span className='whitespace-nowrap'>
                by <b style={{ fontWeight: 650 }}>{selected > 1 ? stops[selected - 1].bagsBy : 'arrival'}</b>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeHero({ seaTime, height = 520, live = false }: { seaTime?: number; height?: number; live?: boolean }) {
  return (
    <div className='relative overflow-hidden' style={{ height: u(height), background: palette.sea }}>
      <SeaTexture className='absolute inset-0' time={live ? undefined : seaTime} density={1.5} />
      <div
        aria-hidden
        className='absolute inset-0'
        style={{ background: 'linear-gradient(100deg, rgba(10,52,56,.8) 0%, rgba(10,52,56,.5) 42%, rgba(10,52,56,0) 68%)' }}
      />
      <Nav tone='sea' />
      <HeroCopy style={{ position: 'absolute', left: u(56), top: u(150) }} />
      <HeroExplorer style={{ position: 'absolute', right: u(56), top: u(118) }} />
    </div>
  );
}

export function TripCard({ trip, width = 266 }: { trip: Trip; width?: number }) {
  return (
    <div style={{ width: u(width) }}>
      <div className='relative overflow-hidden' style={{ height: u(width * 0.72), borderRadius: u(14) }}>
        <Scene kind={trip.scene} />
        <span
          className='absolute'
          style={{
            left: u(12),
            top: u(12),
            fontSize: u(12),
            fontWeight: 620,
            padding: `${u(5)} ${u(10)}`,
            borderRadius: u(12),
            background: 'rgba(243,235,221,.92)',
            color: palette.ink
          }}
        >
          {trip.country}
        </span>
      </div>
      <p style={{ fontSize: u(20), fontWeight: 600, marginTop: u(14), letterSpacing: '-0.01em' }}>{trip.name}</p>
      <p style={{ fontSize: u(14.5), color: palette.inkSoft, marginTop: u(3) }}>{trip.route}</p>
      <div className='tabular flex items-center' style={{ gap: u(14), marginTop: u(12), fontSize: u(14), paddingTop: u(10), borderTop: `1px solid ${palette.rule}` }}>
        <span>
          <b style={{ fontWeight: 650 }}>{trip.days}</b> days
        </span>
        <span>
          <b style={{ fontWeight: 650 }}>{trip.hours}</b> hours a day
        </span>
        <span className='ml-auto' style={{ color: palette.inkSoft }}>
          from <b style={{ fontWeight: 650, color: palette.ink }}>{trip.price}</b>
        </span>
      </div>
    </div>
  );
}

export function HomePage({ seaTime }: { seaTime?: number }) {
  return (
    <div style={{ ...base, background: palette.sand, width: u(1240) }}>
      <HomeHero seaTime={seaTime} />
      <div style={{ padding: `${u(56)} ${u(56)} ${u(40)}` }}>
        <div className='flex items-end justify-between'>
          <div>
            <p style={eyebrow}>Four trips, all coast</p>
            <h2 style={{ fontSize: u(36), fontWeight: 560, letterSpacing: '-0.015em', marginTop: u(8) }}>
              Pick a coast. We’ll tell you how long each day is.
            </h2>
          </div>
          <p style={{ fontSize: u(15), color: palette.inkSoft, maxWidth: u(320), textAlign: 'right' }}>
            Hours are walking time, without stops. Climbing is in flights of stairs.
          </p>
        </div>
        <div className='flex justify-between' style={{ marginTop: u(28) }}>
          {trips.map((trip) => (
            <TripCard key={trip.name} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Trip page                                                           */
/* ------------------------------------------------------------------ */

function Facts() {
  const facts = [
    ['2–6', 'hours of walking a day'],
    ['40–290', 'flights of stairs a day'],
    ['6', 'inns, booked for you'],
    ['1', 'bag each, carried ahead']
  ];
  return (
    <div className='flex' style={{ borderTop: `1px solid ${palette.rule}`, borderBottom: `1px solid ${palette.rule}` }}>
      {facts.map(([n, label], i) => (
        <div
          key={label}
          className='flex-1'
          style={{ paddingBlock: u(14), paddingLeft: i ? u(22) : 0, borderLeft: i ? `1px solid ${palette.rule}` : 'none' }}
        >
          <p className='tabular' style={{ fontSize: u(26), fontWeight: 560, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {n}
          </p>
          <p style={{ fontSize: u(14.5), color: palette.inkSoft, marginTop: u(2) }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

function DayRow({ index, open }: { index: number; open?: boolean }) {
  const d = days[index];
  return (
    <div
      style={{
        borderBottom: `1px solid ${palette.rule}`,
        background: open ? paper : 'transparent',
        borderRadius: open ? u(14) : 0,
        boxShadow: open ? `0 0 0 1px ${palette.rule}` : 'none',
        padding: open ? `${u(16)} ${u(18)} ${u(18)}` : `${u(14)} ${u(18)}`,
        marginBlock: open ? u(6) : 0
      }}
    >
      <div className='flex items-center' style={{ gap: u(16) }}>
        <span
          className='tabular flex shrink-0 items-center justify-center rounded-full'
          style={{
            width: u(32),
            height: u(32),
            fontSize: u(14),
            fontWeight: 650,
            background: open ? palette.deep : 'transparent',
            color: open ? palette.sand : palette.sea,
            boxShadow: open ? 'none' : `inset 0 0 0 ${u(1.5)} ${palette.sea}`
          }}
        >
          {d.day}
        </span>
        <span className='flex-1' style={{ fontSize: u(18), fontWeight: open ? 620 : 520 }}>
          {d.title}
        </span>
        <span className='tabular flex' style={{ gap: u(22), fontSize: u(15) }}>
          <span style={{ width: u(84) }}>
            <b style={{ fontWeight: 640 }}>{hoursLabel(d.hours)}</b> hours
          </span>
          <span style={{ width: u(96) }}>
            <b style={{ fontWeight: 640 }}>{d.flights}</b> flights
          </span>
          <span style={{ width: u(56), color: palette.inkSoft, textAlign: 'right' }}>{d.km} km</span>
        </span>
      </div>
      {open ? (
        <div className='flex' style={{ gap: u(18), marginTop: u(14), marginLeft: u(48) }}>
          <div className='flex-1'>
            <p style={{ fontSize: u(15.5), lineHeight: 1.5 }}>
              The hardest day, and the best. Seven steep valleys in 14 km, each one down to a stream and
              back up. Take the steps to Trebarwith Strand slowly; the café at the bottom is open until 5.
            </p>
            <div className='flex items-center' style={{ gap: u(10), marginTop: u(14), fontSize: u(14.5) }}>
              <TagGlyph size={18} />
              <span>
                Bags leave the Harbour Inn at 9 am. In your room at <b style={{ fontWeight: 640 }}>Trevena House</b> by{' '}
                <b className='tabular' style={{ fontWeight: 640 }}>3 pm</b>.
              </span>
            </div>
          </div>
          <div className='shrink-0 overflow-hidden' style={{ width: u(150), height: u(104), borderRadius: u(10) }}>
            <Scene kind='headland' />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TripPage() {
  return (
    <div style={{ ...base, background: palette.sand, width: u(1240), minHeight: u(900) }}>
      <Nav active='Trips' />
      <div style={{ padding: `${u(36)} ${u(56)} 0` }}>
        <div className='flex items-end justify-between'>
          <div>
            <p style={{ fontSize: u(13.5), color: palette.inkSoft }}>
              Trips <span style={{ opacity: 0.6 }}>/</span> Cornwall
            </p>
            <h1 style={{ fontSize: u(52), fontWeight: 540, letterSpacing: '-0.02em', lineHeight: 1.02, marginTop: u(10) }}>
              Cornwall’s North Coast
            </h1>
            <p style={{ fontSize: u(18), color: palette.inkSoft, marginTop: u(10) }}>
              Padstow to Bude on the South West Coast Path. Six days, six inns, 67 km.
            </p>
          </div>
          <div className='flex flex-col items-end' style={{ gap: u(10), paddingBottom: u(4) }}>
            <p className='tabular' style={{ fontSize: u(15), color: palette.inkSoft }}>
              from <b style={{ fontSize: u(24), color: palette.ink, fontWeight: 600 }}>£1,180</b> per person, sharing
            </p>
            <Pill size={16}>Check dates</Pill>
          </div>
        </div>
        <div style={{ marginTop: u(28) }}>
          <Facts />
        </div>
        <div className='flex' style={{ gap: u(40), marginTop: u(30) }}>
          <div className='flex-1'>
            <div className='flex items-baseline justify-between' style={{ marginBottom: u(8) }}>
              <h2 style={{ fontSize: u(26), fontWeight: 580 }}>Day by day</h2>
              <p style={{ fontSize: u(13.5), color: palette.inkSoft }}>Hours are walking time, without stops</p>
            </div>
            {days.map((d, i) => (
              <DayRow key={d.day} index={i} open={i === 2} />
            ))}
          </div>
          <div className='shrink-0' style={{ width: u(380) }}>
            <div
              className='overflow-hidden'
              style={{ borderRadius: u(18), boxShadow: `0 0 0 1px ${palette.rule}`, background: paper }}
            >
              <RouteMap pos={2} width={380} />
              <div className='flex items-center' style={{ gap: u(18), padding: `${u(12)} ${u(16)}`, fontSize: u(13) }}>
                <Legend swatch={<span style={{ width: u(18), height: u(3.6), borderRadius: u(2), background: palette.deep }} />}>Day 3</Legend>
                <Legend swatch={<span style={{ width: u(18), height: u(3), borderRadius: u(2), background: palette.sea, opacity: 0.55 }} />}>Days walked</Legend>
                <Legend swatch={<TagGlyph size={14} />}>Tonight’s bags</Legend>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ swatch, children }: { swatch: ReactNode; children: ReactNode }) {
  return (
    <span className='flex items-center' style={{ gap: u(7), color: palette.inkSoft }}>
      {swatch}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* How hard is it?                                                     */
/* ------------------------------------------------------------------ */

export function DifficultyPage() {
  const maxH = 7;
  const maxF = 300;
  const hoursW = 300;
  const flightsW = 300;
  return (
    <div style={{ ...base, background: palette.sand, width: u(1240), minHeight: u(900) }}>
      <Nav active='How hard is it?' />
      <div style={{ padding: `${u(40)} ${u(56)} 0` }}>
        <p style={eyebrow}>Cornwall’s North Coast</p>
        <div className='flex items-end justify-between' style={{ marginTop: u(10) }}>
          <h1 style={{ fontSize: u(52), fontWeight: 540, letterSpacing: '-0.02em', lineHeight: 1 }}>How hard is it?</h1>
        </div>
        <p style={{ fontSize: u(19), lineHeight: 1.5, maxWidth: u(700), marginTop: u(16) }}>
          We don’t grade walks. “Moderate” means something different to everyone. So here is each day in the
          two numbers people ask us about: how long you’ll walk, and how much you’ll climb.
        </p>

        <div className='flex' style={{ gap: u(48), marginTop: u(28) }}>
          <div className='flex-1'>
            <div
              className='tabular flex items-end'
              style={{ fontSize: u(13), color: palette.inkSoft, paddingBottom: u(10), borderBottom: `1px solid ${palette.ink}` }}
            >
              <span style={{ width: u(300) }}>Day</span>
              <span style={{ width: u(hoursW + 56) }}>Hours of walking</span>
              <span>Climbing, in flights of stairs</span>
            </div>
            {days.map((d) => {
              const hard = d.day === 3;
              const optional = d.day === 1;
              return (
                <div
                  key={d.day}
                  className='flex items-center'
                  style={{ height: u(49), borderBottom: `1px solid ${palette.rule}` }}
                >
                  <span className='flex items-baseline' style={{ width: u(300), gap: u(12) }}>
                    <span className='tabular' style={{ fontSize: u(14), fontWeight: 650, color: palette.sea, width: u(14) }}>
                      {d.day}
                    </span>
                    <span style={{ fontSize: u(16.5), fontWeight: hard ? 640 : 500 }}>{d.title}</span>
                    {optional ? <span style={{ fontSize: u(13), color: palette.inkSoft }}>optional loop</span> : null}
                  </span>
                  <Bar value={d.hours / maxH} width={hoursW} hard={hard} optional={optional} />
                  <span className='tabular' style={{ width: u(56), paddingLeft: u(12), fontSize: u(17), fontWeight: 600 }}>
                    {hoursLabel(d.hours)}
                  </span>
                  <Bar value={d.flights / maxF} width={flightsW} hard={hard} optional={optional} stairs />
                  <span className='tabular' style={{ paddingLeft: u(12), fontSize: u(17), fontWeight: 600 }}>
                    {d.flights}
                  </span>
                </div>
              );
            })}
            <div className='tabular flex' style={{ fontSize: u(12), color: palette.inkSoft, marginTop: u(8) }}>
              <span style={{ width: u(300) }} />
              <span className='flex justify-between' style={{ width: u(hoursW) }}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </span>
              <span style={{ width: u(56) }} />
              <span className='flex justify-between' style={{ width: u(flightsW) }}>
                {[0, 100, 200, 300].map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </span>
            </div>
          </div>
        </div>

        <div className='flex' style={{ gap: u(24), marginTop: u(26) }}>
          <Note title='One flight is about 12 steps.'>
            Or 3 metres up. The stairs in most houses are one flight. We count every climb on the path, not just the
            big ones.
          </Note>
          <Note title='Day 3 is the hardest day.'>
            290 flights in 5½ hours of walking. That’s fewer than one flight a minute, with a stream at the bottom
            of every valley.
          </Note>
          <Note title='Want it gentler?'>
            Add a rest day in Tintagel, or let us drive you from Port Isaac to Port Gaverne and skip the first climb.
          </Note>
        </div>
      </div>
    </div>
  );
}

function Bar({ value, width, hard, optional, stairs }: { value: number; width: number; hard?: boolean; optional?: boolean; stairs?: boolean }) {
  const color = hard ? palette.deep : '#5F8F8C';
  return (
    <span className='relative block' style={{ width: u(width), height: u(18) }}>
      {(stairs ? [100, 200, 300] : [1, 2, 3, 4, 5, 6, 7]).map((t) => (
        <span
          key={t}
          className='absolute'
          style={{ left: `${(t / (stairs ? 300 : 7)) * 100}%`, top: u(-15), bottom: u(-15), width: 1, background: palette.rule }}
        />
      ))}
      <span
        className='absolute inset-y-0 left-0'
        style={{
          width: `${Math.min(1, value) * 100}%`,
          borderRadius: u(3),
          background: optional ? 'transparent' : color,
          boxShadow: optional ? `inset 0 0 0 ${u(1.5)} ${palette.sea}` : 'none',
          backgroundImage: optional
            ? `repeating-linear-gradient(135deg, ${palette.sea}55 0 ${u(2)}, transparent ${u(2)} ${u(6)})`
            : undefined
        }}
      />
    </span>
  );
}

function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className='flex-1' style={{ borderTop: `${u(2)} solid ${palette.sea}`, paddingTop: u(14) }}>
      <p style={{ fontSize: u(17), fontWeight: 620 }}>{title}</p>
      <p style={{ fontSize: u(15), lineHeight: 1.5, color: palette.inkSoft, marginTop: u(6) }}>{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Booking email and luggage tag                                       */
/* ------------------------------------------------------------------ */

const dates = ['Sat 11 May', 'Sun 12 May', 'Mon 13 May', 'Tue 14 May', 'Wed 15 May', 'Thu 16 May'];
const innNames = ['The Quay House', 'The Harbour Inn', 'Trevena House', 'The Valency Rooms', 'Cleave Farm', 'The Breakwater'];

export function BookingEmail({ style }: { style?: CSSProperties }) {
  return (
    <div
      style={{
        ...base,
        width: u(560),
        background: palette.white,
        borderRadius: u(6),
        boxShadow: `0 ${u(24)} ${u(50)} ${u(-22)} rgba(20,30,28,.45), 0 ${u(1)} ${u(3)} rgba(20,30,28,.15)`,
        overflow: 'hidden',
        ...style
      }}
    >
      <div style={{ padding: `${u(16)} ${u(28)}`, fontSize: u(12.5), color: palette.inkSoft, borderBottom: `1px solid ${palette.rule}`, fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
        <p>
          <b style={{ color: palette.ink, fontWeight: 600 }}>Kittiwake</b> &lt;hello@kittiwake.co.uk&gt;
        </p>
        <p style={{ marginTop: u(3) }}>Your bags, day by day · KW-2417</p>
      </div>
      <div style={{ background: palette.sea, padding: `${u(26)} ${u(28)} ${u(22)}`, color: palette.sand }}>
        <Wordmark size={20} color={palette.sand} />
        <p style={{ fontSize: u(30), fontWeight: 560, lineHeight: 1.1, marginTop: u(24), letterSpacing: '-0.015em' }}>
          Helen, you’re booked.
        </p>
        <p style={{ fontSize: u(15), marginTop: u(8), opacity: 0.92 }}>Cornwall’s North Coast · 11 to 16 May · 2 walkers</p>
      </div>
      <div style={{ padding: `${u(22)} ${u(28)} ${u(26)}` }}>
        <p style={{ fontSize: u(15.5), lineHeight: 1.5 }}>
          Each morning, leave your bags in reception by <b className='tabular'>9 am</b> with your tags on. They’ll be in
          your next room before you are.
        </p>
        <div style={{ marginTop: u(16) }}>
          <div
            className='flex'
            style={{ fontSize: u(11.5), ...eyebrow, color: palette.inkSoft, paddingBottom: u(8), borderBottom: `1px solid ${palette.ink}` }}
          >
            <span style={{ width: u(110) }}>Night</span>
            <span className='flex-1'>Inn</span>
            <span>Bags there by</span>
          </div>
          {days.map((d, i) => (
            <div key={d.day} className='tabular flex items-baseline' style={{ fontSize: u(14.5), paddingBlock: u(9), borderBottom: `1px solid ${palette.rule}` }}>
              <span style={{ width: u(110), color: palette.inkSoft }}>{dates[i]}</span>
              <span className='flex-1'>
                <b style={{ fontWeight: 600 }}>{innNames[i]}</b>
                <span style={{ color: palette.inkSoft }}>, {stops[i].name}</span>
              </span>
              <span style={{ fontWeight: 600 }}>{i === 0 ? 'Waiting' : stops[i].bagsBy}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: u(14), color: palette.inkSoft, marginTop: u(16), lineHeight: 1.5 }}>
          Questions? Reply to this email. Ros and Callum read every one.
        </p>
      </div>
    </div>
  );
}

/** The luggage tag: its top edge is cut along the tide-line. */
export function LuggageTag({ style, night = 3 }: { style?: CSSProperties; night?: number }) {
  const W = 300;
  const H = 600;
  return (
    <div className='relative' style={{ width: u(W), height: u(H), filter: `drop-shadow(0 ${u(14)} ${u(18)} rgba(40,30,15,.28)) drop-shadow(0 ${u(1)} ${u(2)} rgba(40,30,15,.2))`, ...style }}>
      <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className='absolute inset-0' style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <clipPath id='kw-tag-shape'>
            <path d={tagPath(W, H)} />
          </clipPath>
        </defs>
        <g clipPath='url(#kw-tag-shape)'>
          <rect width={W} height={H} fill={palette.sand} />
          <rect width={W} height={262} fill={palette.sea} />
          {[12, 24, 36].map((dy, i) => (
            <path key={dy} d={tagEdge(W)} transform={`translate(0 ${dy})`} fill='none' stroke={palette.foam} strokeWidth='1.1' opacity={0.5 - i * 0.14} />
          ))}
          <path d={`M0 262 H${W}`} stroke={palette.deep} strokeWidth='1' />
        </g>
        <circle cx={W / 2} cy={72} r={15} fill={palette.beak} />
        <circle cx={W / 2} cy={72} r={8} fill='#2a2620' />
        <path d={`M${W / 2} 64 C${W / 2 - 10} 20 ${W / 2 + 40} -40 ${W / 2 + 10} -140`} stroke='#c9b897' strokeWidth='3' fill='none' strokeLinecap='round' />
      </svg>
      <div className='absolute inset-x-0 flex flex-col items-center' style={{ top: u(108), color: palette.sand, ...base }}>
        <Wordmark size={30} color={palette.sand} dot={false} />
        <p style={{ ...eyebrow, color: palette.foam, marginTop: u(22), fontSize: u(11.5) }}>This bag travels ahead</p>
        <p style={{ fontSize: u(15), marginTop: u(6), opacity: 0.9 }}>Padstow to Bude · 11–16 May</p>
      </div>
      <div className='absolute inset-x-0' style={{ top: u(286), paddingInline: u(26), ...base }}>
        <p style={{ ...eyebrow, fontSize: u(11), color: palette.inkSoft }}>Name</p>
        <p style={{ fontSize: u(22), fontWeight: 560, marginTop: u(2), borderBottom: `1px solid ${palette.stone}`, paddingBottom: u(6) }}>
          Helen Marsh
        </p>
        <p style={{ ...eyebrow, fontSize: u(11), color: palette.inkSoft, marginTop: u(14) }}>Tonight</p>
        {innNames.map((inn, i) => (
          <div
            key={inn}
            className='tabular flex items-center'
            style={{ gap: u(10), fontSize: u(13.5), height: u(27), borderBottom: `1px solid ${palette.rule}`, color: i + 1 === night ? palette.ink : palette.inkSoft }}
          >
            <span
              className='flex items-center justify-center rounded-full'
              style={{
                width: u(16),
                height: u(16),
                fontSize: u(10.5),
                fontWeight: 700,
                background: i + 1 === night ? palette.deep : 'transparent',
                color: i + 1 === night ? palette.sand : palette.inkSoft,
                boxShadow: i + 1 === night ? 'none' : `inset 0 0 0 1px ${palette.stone}`
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontWeight: i + 1 === night ? 640 : 460 }}>{inn}</span>
            <span className='ml-auto' style={{ fontSize: u(12) }}>
              {stops[i].short}
            </span>
          </div>
        ))}
        <p className='tabular' style={{ fontSize: u(12), color: palette.inkSoft, marginTop: u(12) }}>
          KW-2417 · Bag 1 of 2
        </p>
      </div>
    </div>
  );
}

const tagEdge = (W: number) =>
  tideLinePoints(W, 44)
    .map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${(p.y + 8).toFixed(1)}`)
    .join('');

/** The tag's outline: the tide-line across the top, rounded at the foot. */
function tagPath(W: number, H: number) {
  const top = tideLinePoints(W, 44).map((p) => ({ x: p.x, y: p.y + 2 }));
  const r = 18;
  let d = `M${top[0].x} ${top[0].y + 6}`;
  for (const p of top) d += ` L${p.x.toFixed(1)} ${(p.y + 6).toFixed(1)}`;
  d += ` L${W} ${H - r} Q${W} ${H} ${W - r} ${H} L${r} ${H} Q0 ${H} 0 ${H - r} Z`;
  return d;
}

/* ------------------------------------------------------------------ */
/* Mobile                                                              */
/* ------------------------------------------------------------------ */

function MobileBar({ title }: { title?: string }) {
  return (
    <div className='flex items-center justify-between' style={{ height: u(54), paddingInline: u(20), borderBottom: `1px solid ${palette.rule}` }}>
      {title ? (
        <span style={{ fontSize: u(15), fontWeight: 560 }}>
          <span style={{ color: palette.sea }}>‹</span> {title}
        </span>
      ) : (
        <Wordmark size={19} />
      )}
      <span className='flex flex-col' style={{ gap: u(4) }} aria-hidden>
        <span style={{ width: u(20), height: u(2), background: palette.ink, borderRadius: u(1) }} />
        <span style={{ width: u(20), height: u(2), background: palette.ink, borderRadius: u(1) }} />
        <span style={{ width: u(14), height: u(2), background: palette.ink, borderRadius: u(1) }} />
      </span>
    </div>
  );
}

export function MobileDayRail({ selected = 3, width = 372 }: { selected?: number; width?: number }) {
  const btn = 34;
  return (
    <div className='relative' style={{ width: u(width), height: u(54) }}>
      <div className='absolute' style={{ left: u(btn / 2), right: u(btn / 2), top: u(btn / 2 - 1), height: u(2), background: palette.stone }}>
        <div style={{ width: `${((selected - 1) / 5) * 100}%`, height: '100%', background: palette.sea }} />
      </div>
      {days.map((d, i) => {
        const on = d.day === selected;
        const past = d.day < selected;
        return (
          <div key={d.day} className='absolute flex flex-col items-center' style={{ left: u(btn / 2 + (i * (width - btn)) / 5), width: 0 }}>
            <span
              className='tabular flex shrink-0 items-center justify-center rounded-full'
              style={{
                width: u(btn),
                height: u(btn),
                fontSize: u(15),
                fontWeight: 650,
                background: on ? palette.deep : palette.sand,
                color: on ? palette.sand : past ? palette.sea : palette.inkSoft,
                boxShadow: on ? 'none' : `inset 0 0 0 ${u(1.5)} ${past ? palette.sea : palette.stone}`
              }}
            >
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function MobileTrip() {
  return (
    <div className='flex h-full flex-col' style={{ ...base, background: palette.sand }}>
      <MobileBar />
      <div className='relative shrink-0' style={{ height: u(196) }}>
        <Scene kind='headland' />
        <div
          className='absolute inset-0'
          style={{ background: 'linear-gradient(180deg, rgba(10,52,56,0) 40%, rgba(10,52,56,.78) 100%)' }}
        />
        <div className='absolute' style={{ left: u(20), bottom: u(18), color: palette.sand }}>
          <p style={{ fontSize: u(30), fontWeight: 560, lineHeight: 1.02, letterSpacing: '-0.015em' }}>Cornwall’s North Coast</p>
          <p style={{ fontSize: u(14.5), marginTop: u(6), opacity: 0.92 }}>Padstow to Bude · 6 days · 67 km</p>
        </div>
      </div>
      <div className='tabular flex' style={{ paddingInline: u(20), borderBottom: `1px solid ${palette.rule}` }}>
        {[
          ['2–6', 'hours a day'],
          ['40–290', 'flights a day'],
          ['£1,180', 'per person']
        ].map(([n, l], i) => (
          <div key={l} className='flex-1' style={{ paddingBlock: u(12), paddingLeft: i ? u(14) : 0, borderLeft: i ? `1px solid ${palette.rule}` : 'none' }}>
            <p style={{ fontSize: u(19), fontWeight: 600 }}>{n}</p>
            <p style={{ fontSize: u(12.5), color: palette.inkSoft }}>{l}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: `${u(16)} ${u(20)} 0` }}>
        <div className='flex items-baseline justify-between'>
          <p style={{ fontSize: u(19), fontWeight: 600 }}>Where you’ll walk</p>
          <p style={{ fontSize: u(12.5), color: palette.inkSoft }}>Drag along the days</p>
        </div>
        <div className='overflow-hidden' style={{ marginTop: u(12), borderRadius: u(14), boxShadow: `inset 0 0 0 1px ${palette.rule}` }}>
          <RouteMap pos={2} width={372} view={{ x: 10, y: 92, w: 310, h: 268 }} />
        </div>
        <div style={{ marginTop: u(14) }}>
          <MobileDayRail />
        </div>
        <div className='tabular flex items-baseline justify-between' style={{ marginTop: u(6), paddingTop: u(12), borderTop: `1px solid ${palette.rule}` }}>
          <p style={{ fontSize: u(16), fontWeight: 600 }}>Port Isaac to Tintagel</p>
          <p style={{ fontSize: u(14), color: palette.inkSoft }}>
            <b style={{ color: palette.ink, fontWeight: 640 }}>5½</b> h · <b style={{ color: palette.ink, fontWeight: 640 }}>290</b> flights
          </p>
        </div>
      </div>
    </div>
  );
}

export function MobileDay() {
  const d = days[2];
  return (
    <div className='flex h-full flex-col' style={{ ...base, background: palette.sand }}>
      <MobileBar title='Cornwall’s North Coast' />
      <div style={{ padding: `${u(18)} ${u(20)} 0` }}>
        <MobileDayRail />
        <p style={{ ...eyebrow, marginTop: u(14) }}>Day 3 of 6 · 14 km</p>
        <p style={{ fontSize: u(32), fontWeight: 580, lineHeight: 1.04, letterSpacing: '-0.015em', marginTop: u(6) }}>
          Port Isaac to Tintagel
        </p>
        <div className='flex' style={{ marginTop: u(18), gap: u(12) }}>
          {[
            [hoursLabel(d.hours), 'hours of walking'],
            [String(d.flights), 'flights of stairs']
          ].map(([n, l]) => (
            <div key={l} className='flex-1' style={{ background: paper, borderRadius: u(14), padding: `${u(14)} ${u(16)}`, boxShadow: `inset 0 0 0 1px ${palette.rule}` }}>
              <p className='tabular' style={{ fontSize: u(38), fontWeight: 560, lineHeight: 1, letterSpacing: '-0.01em' }}>
                {n}
              </p>
              <p style={{ fontSize: u(13.5), color: palette.inkSoft, marginTop: u(6) }}>{l}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: u(15.5), lineHeight: 1.5, marginTop: u(16) }}>
          The hardest day: seven steep valleys, each down to a stream and back up. Take the steps to Trebarwith
          Strand slowly. The café at the bottom is open until 5.
        </p>
        <p style={{ fontSize: u(19), fontWeight: 600, marginTop: u(22) }}>Your bags today</p>
        <div className='relative' style={{ marginTop: u(12), paddingLeft: u(30) }}>
          <span className='absolute' style={{ left: u(8), top: u(10), bottom: u(18), width: u(2), background: `repeating-linear-gradient(${palette.sea} 0 ${u(4)}, transparent ${u(4)} ${u(8)})` }} />
          {[
            ['9:00 am', 'Leave them in reception', 'The Harbour Inn, Port Isaac', false],
            ['11:30 am', 'In our van on the B3314', 'Ada’s tracker says on time', false],
            ['3:00 pm', 'In your room', 'Trevena House, Tintagel', true]
          ].map(([time, what, where, last]) => (
            <div key={String(time)} className='relative' style={{ paddingBottom: u(14) }}>
              <span
                className='absolute rounded-full'
                style={{
                  left: u(-28),
                  top: u(3),
                  width: u(14),
                  height: u(14),
                  background: last ? palette.beak : palette.sand,
                  boxShadow: `inset 0 0 0 ${u(2)} ${palette.ink}`
                }}
              />
              <p className='tabular' style={{ fontSize: u(15), fontWeight: 620 }}>
                {time} <span style={{ fontWeight: 480 }}>· {what}</span>
              </p>
              <p style={{ fontSize: u(13.5), color: palette.inkSoft, marginTop: u(2) }}>{where}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='flex items-center' style={{ margin: `${u(4)} ${u(20)} 0`, gap: u(14), padding: u(10), borderRadius: u(14), background: paper, boxShadow: `inset 0 0 0 1px ${palette.rule}` }}>
        <div className='shrink-0 overflow-hidden' style={{ width: u(84), height: u(64), borderRadius: u(9) }}>
          <Scene kind='harbour' />
        </div>
        <div className='min-w-0'>
          <p style={{ ...eyebrow, fontSize: u(11) }}>Tonight</p>
          <p style={{ fontSize: u(16), fontWeight: 620, marginTop: u(2) }}>Trevena House, Tintagel</p>
          <p style={{ fontSize: u(13), color: palette.inkSoft, marginTop: u(2) }}>Drying room for boots. Breakfast from 7:30.</p>
        </div>
      </div>
      <div
        className='mt-auto flex items-center justify-between'
        style={{ padding: `${u(14)} ${u(20)} ${u(30)}`, borderTop: `1px solid ${palette.rule}`, background: paper }}
      >
        <p className='tabular' style={{ fontSize: u(14), color: palette.inkSoft }}>
          from <b style={{ fontSize: u(20), color: palette.ink, fontWeight: 600 }}>£1,180</b>
        </p>
        <Pill size={15}>Check dates</Pill>
      </div>
    </div>
  );
}
