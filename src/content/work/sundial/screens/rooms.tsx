import { u } from '~/components/stage';
import { palette } from '../theme';
import { PinGlyph } from '../ui';
import { AppBar, Eyebrow, Screen, Swatch, tint } from './chrome';

/*
 * One day, one column per room, real durations. This is where coordinators
 * look for space: free blocks over an hour are outlined.
 */

type Room = { key: string; name: string; meta: string; floor: 'Ground floor' | 'Second floor' };

const ROOMS: Room[] = [
  { key: 'kiln', name: 'Kiln room', meta: '10 wheels · 2 kilns', floor: 'Ground floor' },
  { key: 'studioA', name: 'Studio A', meta: 'Sprung floor · 24', floor: 'Ground floor' },
  { key: 'studioB', name: 'Studio B', meta: 'Mirrors · 20', floor: 'Ground floor' },
  { key: 'room4', name: 'Room 4', meta: '12 easels', floor: 'Ground floor' },
  { key: 'music', name: 'Music room', meta: 'Piano · risers', floor: 'Ground floor' },
  { key: 'room2', name: 'Room 2', meta: 'North light · 14', floor: 'Second floor' },
  { key: 'room3', name: 'Room 3', meta: '16 desks', floor: 'Second floor' },
  { key: 'print', name: 'Print shop', meta: '2 presses', floor: 'Second floor' },
  { key: 'studioC', name: 'Studio C', meta: 'Sprung floor · 18', floor: 'Second floor' }
];

type Booking = {
  room: number;
  name: string;
  teacher?: string;
  start: number;
  end: number;
  kind?: 'class' | 'closed' | 'free';
  pinned?: boolean;
  isNew?: boolean;
};

// Times in hours after noon: 3.5 is 3:30 pm.
const BOOKINGS: Booking[] = [
  { room: 0, name: 'Clay Club', teacher: 'D. Hale', start: 3.25, end: 4.25 },
  { room: 0, name: 'Raku Firing', teacher: 'D. Hale', start: 4.5, end: 6, isNew: true },
  { room: 0, name: 'Bisque firing', start: 6.25, end: 8.5, kind: 'closed' },
  { room: 1, name: 'Creative Movement', teacher: 'M. Reyes', start: 3.5, end: 4.25 },
  { room: 1, name: 'Jazz Dance', teacher: 'M. Reyes', start: 4.5, end: 5.5 },
  { room: 1, name: 'Free · 2 hrs', start: 5.5, end: 7.5, kind: 'free' },
  { room: 1, name: 'Salsa Basics', teacher: 'M. Reyes', start: 7.5, end: 8.5 },
  { room: 2, name: 'Hip-Hop I', teacher: 'J. Kim', start: 3.5, end: 4.5 },
  { room: 2, name: 'Hip-Hop II', teacher: 'J. Kim', start: 5.5, end: 6.5, pinned: true },
  { room: 2, name: 'Breaking', teacher: 'J. Kim', start: 6.75, end: 7.75 },
  { room: 3, name: 'Sketchbook Club', teacher: 'A. Mensah', start: 3.5, end: 4.5 },
  { room: 3, name: 'Free · 2 hrs', start: 4.5, end: 6.5, kind: 'free' },
  { room: 3, name: 'Printmaking', teacher: 'A. Mensah', start: 6.5, end: 8 },
  { room: 4, name: 'Junior Strings', teacher: 'B. Osei', start: 3.5, end: 4.25 },
  { room: 4, name: 'Guitar I', teacher: 'B. Osei', start: 4.5, end: 5.5 },
  { room: 4, name: 'Rock Band', teacher: 'B. Osei', start: 6, end: 7.5 },
  { room: 5, name: 'Watercolor II', teacher: 'P. Raman', start: 4, end: 5.5 },
  { room: 5, name: 'Still Life', teacher: 'P. Raman', start: 6, end: 7.5 },
  { room: 6, name: 'Stop Motion', teacher: 'W. Li', start: 4.5, end: 6 },
  { room: 6, name: 'Teen Writers', teacher: 'O. Haddad', start: 6.5, end: 7.5 },
  { room: 7, name: 'Screen Printing', teacher: 'C. Weiss', start: 5, end: 7 },
  { room: 8, name: 'Musical Theatre', teacher: 'G. Kowalski', start: 3.5, end: 5 },
  { room: 8, name: 'Tap II', teacher: 'G. Kowalski', start: 5.5, end: 6.5 },
  { room: 8, name: 'Adult Ballet', teacher: 'T. Adeyemi', start: 7, end: 8.25 }
];

const START = 3;
const END = 8.5;

const clock = (h: number) => {
  const hours = Math.floor(h);
  const minutes = Math.round((h - hours) * 60);
  return `${hours}:${String(minutes).padStart(2, '0')}`;
};

export function RoomsScreen() {
  const gutter = 58;
  const colW = 136;
  const hourH = 98;
  const top = 0;
  const y = (h: number) => top + (h - START) * hourH;
  const booked = (room: number) =>
    BOOKINGS.filter((b) => b.room === room && (b.kind ?? 'class') === 'class').reduce((a, b) => a + b.end - b.start, 0);

  return (
    <Screen className='flex flex-col'>
      <AppBar tab='By room' />
      <div className='flex shrink-0 items-center' style={{ height: u(62), paddingInline: u(24), gap: u(14) }}>
        <h2 className='whitespace-nowrap' style={{ fontSize: u(22), fontWeight: 600, letterSpacing: '-0.01em' }}>
          Tuesday, September 10
        </h2>
        <div className='flex' style={{ padding: u(3), gap: u(2), borderRadius: u(8), background: '#F1F3F9', fontSize: u(13), fontWeight: 600 }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <span
              key={d}
              style={{
                padding: `${u(4)} ${u(11)}`,
                borderRadius: u(6),
                background: d === 'Tue' ? '#fff' : undefined,
                boxShadow: d === 'Tue' ? '0 1px 2px rgba(18,26,51,.12)' : undefined,
                color: d === 'Tue' ? palette.ink : palette.inkSoft
              }}
            >
              {d}
            </span>
          ))}
        </div>
        <div className='ml-auto flex items-center tabular' style={{ gap: u(16), fontSize: u(13.5), color: palette.inkSoft }}>
          <span>
            <b style={{ color: palette.ink, fontWeight: 600 }}>21 classes</b> in 9 of 14 rooms
          </span>
          <span className='inline-flex items-center' style={{ gap: u(6) }}>
            <span style={{ width: u(16), height: u(11), borderRadius: u(3), border: `1.5px dashed ${palette.cobalt}` }} />
            Free over an hour
          </span>
        </div>
      </div>

      {/* Floors and rooms */}
      <div className='relative shrink-0' style={{ height: u(84), marginInline: u(16), borderBottom: `1px solid ${palette.rule}` }}>
        {(['Ground floor', 'Second floor'] as const).map((floor) => {
          const first = ROOMS.findIndex((r) => r.floor === floor);
          const count = ROOMS.filter((r) => r.floor === floor).length;
          return (
            <div
              key={floor}
              className='absolute flex items-center'
              style={{ left: u(gutter + first * colW + 6), width: u(count * colW - 12), top: 0, height: u(20), gap: u(8) }}
            >
              <Eyebrow style={{ fontSize: u(11.5) }}>{floor}</Eyebrow>
              <span style={{ flex: 1, height: 1, background: palette.rule }} />
            </div>
          );
        })}
        {ROOMS.map((room, i) => {
          const hours = booked(i);
          return (
            <div key={room.key} className='absolute' style={{ left: u(gutter + i * colW + 8), top: u(26), width: u(colW - 16) }}>
              <div className='flex items-center' style={{ gap: u(6) }}>
                <Swatch room={room.key} size={11} />
                <span className='truncate' style={{ fontSize: u(14), fontWeight: 600 }}>
                  {room.name}
                </span>
              </div>
              <p className='truncate' style={{ fontSize: u(12), color: palette.inkSoft, marginTop: u(2) }}>
                {room.meta}
              </p>
              <div className='flex items-center tabular' style={{ gap: u(6), marginTop: u(6) }}>
                <span style={{ flex: 1, height: u(4), borderRadius: u(2), background: palette.rule, overflow: 'hidden' }}>
                  <span style={{ display: 'block', width: `${(hours / (END - START)) * 100}%`, height: '100%', background: palette.cobalt }} />
                </span>
                <span style={{ fontSize: u(11.5), color: palette.inkSoft }}>{hours.toFixed(1).replace('.0', '')} h</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* The day */}
      <div className='relative min-h-0 flex-1' style={{ marginInline: u(16) }}>
        {Array.from({ length: (END - START) * 2 + 1 }, (_, i) => START + i / 2).map((h) => (
          <div key={h} className='absolute' style={{ left: 0, right: 0, top: u(y(h)) }}>
            {h % 1 === 0 ? (
              <span className='absolute tabular' style={{ left: 0, width: u(gutter - 12), top: u(4), textAlign: 'right', fontSize: u(12.5), fontWeight: 500, color: palette.inkSoft }}>
                {clock(h)}
              </span>
            ) : null}
            <div
              style={{
                marginLeft: u(gutter),
                height: 1,
                background: h % 1 === 0 ? palette.rule : 'transparent',
                borderTop: h % 1 === 0 ? undefined : `1px dashed ${palette.rule}`
              }}
            />
          </div>
        ))}
        {ROOMS.map((room, i) => (
          <div
            key={room.key}
            className='absolute'
            style={{ left: u(gutter + i * colW), top: 0, bottom: 0, width: 1, background: i === 5 ? '#C9D0E2' : palette.rule }}
          />
        ))}
        {BOOKINGS.map((b) => {
          const t = tint(ROOMS[b.room].key);
          const kind = b.kind ?? 'class';
          const h = (b.end - b.start) * hourH;
          const base = {
            left: u(gutter + b.room * colW + 5),
            top: u(y(b.start) + 2),
            width: u(colW - 10),
            height: u(h - 4),
            borderRadius: u(7)
          };
          if (kind === 'free') {
            return (
              <div
                key={`${b.room}-${b.start}`}
                className='absolute flex flex-col justify-center text-center tabular'
                style={{ ...base, border: `1.5px dashed ${palette.cobalt}`, background: 'rgba(36,72,216,.04)', color: palette.cobaltDeep }}
              >
                <p style={{ fontSize: u(13.5), fontWeight: 600 }}>{b.name}</p>
                <p style={{ fontSize: u(12.5) }}>
                  {clock(b.start)}–{clock(b.end)}
                </p>
              </div>
            );
          }
          if (kind === 'closed') {
            return (
              <div
                key={`${b.room}-${b.start}`}
                className='absolute tabular'
                style={{
                  ...base,
                  padding: `${u(8)} ${u(9)}`,
                  color: t.ink,
                  backgroundImage: `repeating-linear-gradient(135deg, color-mix(in srgb, ${t.fill} 70%, white) 0 ${u(6)}, #fff ${u(6)} ${u(12)})`,
                  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${t.ink} 20%, transparent)`
                }}
              >
                <p style={{ fontSize: u(13.5), fontWeight: 600 }}>{b.name}</p>
                <p style={{ fontSize: u(12.5) }}>Room closed · kiln at 1,800°F</p>
              </div>
            );
          }
          return (
            <div
              key={`${b.room}-${b.start}`}
              className='absolute overflow-hidden tabular'
              style={{
                ...base,
                padding: `${u(7)} ${u(9)}`,
                background: t.fill,
                color: t.ink,
                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${t.ink} ${b.pinned ? 40 : 14}%, transparent)`
              }}
            >
              <div className='flex items-start justify-between' style={{ gap: u(4) }}>
                <p style={{ fontSize: u(13.5), fontWeight: 600, lineHeight: 1.15 }}>{b.name}</p>
                {b.pinned ? <PinGlyph pinned size={12} color={palette.ink} style={{ marginTop: u(2) }} /> : null}
                {b.isNew ? (
                  <span style={{ fontSize: u(11), fontWeight: 600, background: 'rgba(255,255,255,.7)', padding: `${u(1)} ${u(5)}`, borderRadius: u(4) }}>
                    New
                  </span>
                ) : null}
              </div>
              <p style={{ fontSize: u(12.5), lineHeight: 1.25, marginTop: u(2) }}>
                {clock(b.start)}–{clock(b.end)}
                {h >= 80 ? null : ` · ${b.teacher}`}
              </p>
              {h >= 80 ? <p style={{ fontSize: u(12.5), lineHeight: 1.25 }}>{b.teacher}</p> : null}
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
