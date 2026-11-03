import type { ReactNode } from 'react';
import { u } from '~/components/stage';
import { DATES, DAYS, FINISHED, PINNED, ROOM_ORDER, classes, teachers } from '../data';
import { palette } from '../theme';
import { CheckGlyph, ChevronGlyph, PinGlyph, ResetGlyph } from '../ui';
import { AppBar, Button, Check, Eyebrow, Screen, Swatch, tint } from './chrome';

/* ------------------------------------------------------------- week grid */

export type GridItem = {
  id: string;
  name: string;
  teacher: string;
  room: string;
  roomName: string;
  day: number;
  time: number;
  ages?: string;
  enrolled?: string;
  pinned?: boolean;
  /** Where the solver moved it from, like "Tue 4:30". */
  movedFrom?: string;
  selected?: boolean;
  clash?: boolean;
  isNew?: boolean;
};

const roomRank = (room: string) => {
  const i = ROOM_ORDER.indexOf(room as (typeof ROOM_ORDER)[number]);
  return i === -1 ? 99 : i;
};

export function WeekGrid({
  items,
  days,
  times,
  colW,
  rowH,
  gutter = 52,
  headH = 34,
  children
}: {
  items: GridItem[];
  days: { label: string; date: string }[];
  times: string[];
  colW: number;
  rowH: number;
  gutter?: number;
  headH?: number;
  children?: ReactNode;
}) {
  const cells = new Map<string, GridItem[]>();
  for (const item of items) {
    const key = `${item.day}-${item.time}`;
    cells.set(key, [...(cells.get(key) ?? []), item]);
  }
  const inset = 3;
  const gap = 3;
  return (
    <div className='relative' style={{ width: u(gutter + colW * days.length), height: u(headH + rowH * times.length) }}>
      {days.map((day, i) => (
        <div
          key={day.label}
          className='absolute flex items-baseline tabular'
          style={{ left: u(gutter + i * colW + 10), top: 0, height: u(headH), paddingTop: u(8), gap: u(5) }}
        >
          <span style={{ fontSize: u(14), fontWeight: 600 }}>{day.label}</span>
          <span style={{ fontSize: u(14), color: palette.inkSoft }}>{day.date}</span>
        </div>
      ))}
      <div
        className='absolute'
        style={{ left: 0, right: 0, top: u(headH), height: 1, background: palette.rule }}
      />
      {times.map((time, t) => (
        <span
          key={time}
          className='absolute tabular'
          style={{
            left: 0,
            width: u(gutter - 10),
            top: u(headH + t * rowH + 7),
            textAlign: 'right',
            fontSize: u(13),
            fontWeight: 500,
            color: palette.inkSoft
          }}
        >
          {time}
        </span>
      ))}
      {times.map((_, t) =>
        days.map((_day, d) => (
          <div
            key={`${d}-${t}`}
            className='absolute'
            style={{
              left: u(gutter + d * colW),
              top: u(headH + t * rowH),
              width: u(colW),
              height: u(rowH),
              borderLeft: `1px solid ${palette.rule}`,
              borderTop: t ? `1px solid ${palette.rule}` : undefined
            }}
          />
        ))
      )}
      {[...cells.entries()].flatMap(([key, list]) => {
        const [day, time] = key.split('-').map(Number);
        const lanes = [...list].sort((a, b) => roomRank(a.room) - roomRank(b.room));
        const laneH = (rowH - inset * 2 - gap * (lanes.length - 1)) / lanes.length;
        return lanes.map((item, lane) => (
          <GridBlock
            key={item.id}
            item={item}
            x={gutter + day * colW + inset}
            y={headH + time * rowH + inset + lane * (laneH + gap)}
            w={colW - inset * 2}
            h={laneH}
          />
        ));
      })}
      {children}
    </div>
  );
}

function GridBlock({ item, x, y, w, h }: { item: GridItem; x: number; y: number; w: number; h: number }) {
  const t = tint(item.room);
  const mode = h >= 80 ? 'full' : h >= 48 ? 'compact' : 'tiny';
  const ring = item.clash
    ? `0 0 0 ${u(2.5)} ${palette.conflict}`
    : item.selected
      ? `0 0 0 ${u(2.5)} ${palette.cobalt}, 0 ${u(10)} ${u(22)} ${u(-8)} rgba(22,48,143,.45)`
      : item.movedFrom
        ? `0 0 0 ${u(2)} ${palette.cobalt}`
        : `inset 0 0 0 1px color-mix(in srgb, ${t.ink} ${item.pinned ? 40 : 14}%, transparent)`;
  const tag = item.movedFrom ? (
    <span
      className='inline-flex shrink-0 items-center tabular'
      style={{
        gap: u(3),
        fontSize: u(11),
        fontWeight: 600,
        color: '#fff',
        background: palette.cobalt,
        padding: `${u(2)} ${u(5)}`,
        borderRadius: u(4),
        lineHeight: 1.1
      }}
    >
      from {item.movedFrom}
    </span>
  ) : item.isNew ? (
    <span
      className='inline-flex shrink-0 items-center'
      style={{
        fontSize: u(11),
        fontWeight: 600,
        color: t.ink,
        background: 'rgba(255,255,255,.7)',
        padding: `${u(2)} ${u(5)}`,
        borderRadius: u(4),
        lineHeight: 1.1
      }}
    >
      New
    </span>
  ) : null;
  return (
    <div
      className='absolute overflow-hidden'
      style={{
        left: u(x),
        top: u(y),
        width: u(w),
        height: u(h),
        borderRadius: u(7),
        background: t.fill,
        color: t.ink,
        boxShadow: ring,
        padding: mode === 'tiny' ? `0 ${u(8)}` : `${u(mode === 'full' ? 8 : 6)} ${u(9)}`,
        display: mode === 'tiny' ? 'flex' : 'block',
        alignItems: 'center',
        zIndex: item.selected ? 3 : 1
      }}
    >
      {mode === 'full' ? (
        <>
          <div className='flex items-start justify-between' style={{ gap: u(6) }}>
            <p style={{ fontSize: u(14), fontWeight: 600, lineHeight: 1.15 }}>{item.name}</p>
            {item.isNew ? tag : null}
          </div>
          <p style={{ fontSize: u(12.5), marginTop: u(4), lineHeight: 1.25 }}>{item.teacher}</p>
          <p style={{ fontSize: u(12.5), lineHeight: 1.25, opacity: 0.88 }}>{item.roomName}</p>
          {item.movedFrom ? (
            <div style={{ marginTop: u(7) }}>{tag}</div>
          ) : item.ages || item.enrolled ? (
            <p className='tabular' style={{ fontSize: u(12), lineHeight: 1.25, marginTop: u(5), opacity: 0.8 }}>
              {[item.ages, item.enrolled].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </>
      ) : mode === 'compact' ? (
        <>
          <p className='truncate' style={{ fontSize: u(13.5), fontWeight: 600, lineHeight: 1.2, paddingRight: u(item.pinned ? 14 : 0) }}>
            {item.name}
          </p>
          <div className='flex items-center' style={{ gap: u(6), marginTop: u(3) }}>
            {item.movedFrom ? tag : null}
            <p className='truncate' style={{ fontSize: u(12.5), lineHeight: 1.25 }}>
              {item.movedFrom ? item.teacher : `${item.teacher} · ${item.roomName}`}
            </p>
          </div>
        </>
      ) : (
        <p className='truncate' style={{ fontSize: u(13), fontWeight: 600, lineHeight: 1.2, paddingRight: u(item.pinned ? 14 : 0) }}>
          {item.name}
          <span style={{ fontWeight: 400, opacity: 0.85 }}> · {item.teacher}</span>
        </p>
      )}
      {item.pinned ? (
        <span
          className='absolute'
          style={mode === 'full' ? { right: u(8), bottom: u(8), color: palette.ink } : { right: u(8), top: u(mode === 'tiny' ? 11 : 8), color: palette.ink }}
        >
          <PinGlyph pinned size={12} />
        </span>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------- the week data */

const AGES: Record<string, string> = {
  choirJr: 'Ages 8–11',
  kidsClay: 'Ages 6–9',
  ballet1: 'Ages 7–9',
  figure: 'Teens and adults',
  hiphop1: 'Ages 9–12',
  wheel: 'Ages 12–15',
  sculpt: 'Ages 10–13',
  hiphop2: 'Ages 12–16',
  print: 'Ages 13–17',
  watercolor: 'Ages 9–12',
  ballet2: 'Ages 10–13',
  guitar: 'Ages 11–15',
  adultWheel: 'Adults',
  handBuild: 'Ages 8–11',
  contemporary: 'Ages 13–17',
  portfolio: 'Ages 15–18',
  jazz: 'Ages 14–18',
  comics: 'Ages 10–14',
  tap: 'Ages 7–10',
  choirTeen: 'Ages 12–17',
  raku: 'Teens and adults'
};

const SEATS: Record<string, number> = {
  wheel: 10,
  raku: 8,
  kidsClay: 12,
  adultWheel: 10,
  handBuild: 12
};

const EXTRA: GridItem[] = [
  { id: 'preBallet', name: 'Pre-Ballet', teacher: 'T. Adeyemi', room: 'studioA', roomName: 'Studio A', day: 0, time: 0 },
  { id: 'piano', name: 'Beginning Piano', teacher: 'S. Novak', room: 'music', roomName: 'Music room', day: 2, time: 0 },
  { id: 'drums', name: 'Drum Circle', teacher: 'L. Brandt', room: 'music', roomName: 'Music room', day: 4, time: 1 },
  { id: 'life', name: 'Life Drawing', teacher: 'A. Mensah', room: 'room4', roomName: 'Room 4', day: 0, time: 4, ages: 'Adults' },
  { id: 'salsa', name: 'Salsa Basics', teacher: 'M. Reyes', room: 'studioA', roomName: 'Studio A', day: 1, time: 4, ages: 'Adults' },
  { id: 'openKiln', name: 'Open Kiln', teacher: 'D. Hale', room: 'kiln', roomName: 'Kiln room', day: 2, time: 4, ages: 'Members' },
  { id: 'throwLab', name: 'Throwing Lab', teacher: 'R. Ortega', room: 'kiln', roomName: 'Kiln room', day: 3, time: 4 },
  { id: 'band', name: 'Community Band', teacher: 'S. Novak', room: 'music', roomName: 'Music room', day: 3, time: 4 },
  { id: 'stretch', name: 'Dance Conditioning', teacher: 'J. Kim', room: 'studioB', roomName: 'Studio B', day: 4, time: 4, ages: 'Adults' }
];

export function weekItems(selected = 'wheel'): GridItem[] {
  const movedFrom: Record<string, string> = Object.fromEntries(FINISHED.moves.map((m) => [m.id, 'Tue 4:30']));
  const base = classes.map((klass): GridItem => {
    const slot = FINISHED.pos[klass.id]!;
    const room = palette.rooms[klass.room];
    return {
      id: klass.id,
      name: klass.name,
      teacher: teachers[klass.teacher].short,
      room: klass.room,
      roomName: room.name,
      day: slot.day,
      time: slot.time,
      ages: AGES[klass.id],
      enrolled: SEATS[klass.id] ? `${SEATS[klass.id]} seats` : undefined,
      pinned: PINNED[klass.id],
      movedFrom: movedFrom[klass.id],
      selected: klass.id === selected,
      isNew: klass.id === 'raku'
    };
  });
  return [...base, ...EXTRA];
}

const WEEK_DAYS = DAYS.map((label, i) => ({ label, date: String(DATES[i]) }));
const WEEK_TIMES = ['3:30', '4:30', '5:30', '6:30', '7:30'];

/* ----------------------------------------------------------- week screen */

/** The coordinator's week, right after the solver placed Raku Firing. Content size 1328 × 774. */
export function WeekScreen() {
  const colW = 143;
  const rowH = 113;
  const gutter = 50;
  const headH = 34;
  const cx = (day: number) => gutter + day * colW;
  const cy = (time: number) => headH + time * rowH;
  return (
    <Screen className='flex flex-col'>
      <AppBar tab='Week' />
      <div className='flex min-h-0 flex-1'>
        <Sidebar />
        <main className='relative flex min-w-0 flex-1 flex-col' style={{ borderRight: `1px solid ${palette.rule}` }}>
          <div className='flex shrink-0 items-center' style={{ height: u(64), paddingInline: u(22), gap: u(12) }}>
            <h2 className='whitespace-nowrap' style={{ fontSize: u(22), fontWeight: 600, letterSpacing: '-0.01em' }}>
              Week of September 9
            </h2>
            <span className='whitespace-nowrap tabular' style={{ fontSize: u(13), color: palette.inkSoft }}>
              Week 1 of 14
            </span>
            <div className='flex items-center' style={{ gap: u(2) }}>
              <NavArrow dir='left' />
              <NavArrow dir='right' />
            </div>
            <div className='ml-auto flex items-center' style={{ gap: u(8) }}>
              <FilterChip label='Ground floor' />
              <div
                className='flex items-center'
                style={{ padding: u(3), borderRadius: u(8), background: '#F1F3F9', gap: u(2), fontSize: u(13), fontWeight: 600 }}
              >
                <span style={{ padding: `${u(4)} ${u(10)}`, borderRadius: u(6), background: '#fff', boxShadow: '0 1px 2px rgba(18,26,51,.12)' }}>
                  Weekdays
                </span>
                <span style={{ padding: `${u(4)} ${u(10)}`, color: palette.inkSoft }}>Weekend</span>
              </div>
            </div>
          </div>
          <div className='relative min-h-0 flex-1' style={{ paddingLeft: u(8) }}>
            <WeekGrid
              items={weekItems()}
              days={WEEK_DAYS}
              times={WEEK_TIMES}
              colW={colW}
              rowH={rowH}
              gutter={gutter}
              headH={headH}
            >
              <svg
                aria-hidden
                className='absolute left-0 top-0'
                style={{ width: u(gutter + colW * 5), height: u(headH + rowH * 5), overflow: 'visible', zIndex: 4 }}
                viewBox={`0 0 ${gutter + colW * 5} ${headH + rowH * 5}`}
              >
                <defs>
                  <marker id='sd-arrow' viewBox='0 0 10 10' refX='7' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M1 1 L8 5 L1 9' fill='none' stroke={palette.cobalt} strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                  </marker>
                </defs>
                {/* Tue 4:30 → Thu 4:30, along the row line over Wednesday */}
                <path
                  d={`M ${cx(2) - 5} ${cy(1) + 30} C ${cx(2) - 2} ${cy(1) + 6}, ${cx(2) + 4} ${cy(1)}, ${cx(2) + 22} ${cy(1)} L ${cx(3) - 26} ${cy(1)} C ${cx(3) - 10} ${cy(1)}, ${cx(3) - 9} ${cy(1) + 22}, ${cx(3) + 1} ${cy(1) + 22}`}
                  fill='none'
                  stroke={palette.cobalt}
                  strokeWidth='2'
                  strokeDasharray='5 4'
                  strokeLinecap='round'
                  markerEnd='url(#sd-arrow)'
                />
                {/* Tue 4:30 → Wed 4:30, lower lane */}
                <path
                  d={`M ${cx(1) + colW - 16} ${cy(1) + rowH - 30} C ${cx(2) - 8} ${cy(1) + rowH - 22}, ${cx(2) - 4} ${cy(1) + rowH - 26}, ${cx(2) + 10} ${cy(1) + rowH - 30}`}
                  fill='none'
                  stroke={palette.cobalt}
                  strokeWidth='2'
                  strokeDasharray='5 4'
                  strokeLinecap='round'
                  markerEnd='url(#sd-arrow)'
                />
              </svg>
            </WeekGrid>
          </div>
          <div
            className='flex shrink-0 items-center'
            style={{ height: u(60), paddingInline: u(22), gap: u(12), borderTop: `1px solid ${palette.rule}`, background: '#FAFBFE' }}
          >
            <CheckGlyph size={20} />
            <div className='min-w-0'>
              <p style={{ fontSize: u(15), fontWeight: 600 }}>2 classes moved · no enrolled families affected</p>
              <p className='tabular' style={{ fontSize: u(13), color: palette.inkSoft, marginTop: u(1) }}>
                Raku Firing placed on Tue 4:30 · Wheel Throwing → Thu 4:30 · Sculpture I → Wed 4:30
              </p>
            </div>
            <div className='ml-auto flex items-center' style={{ gap: u(8) }}>
              <Button small>
                <ResetGlyph size={12} color={palette.inkSoft} />
                Undo
              </Button>
            </div>
          </div>
        </main>
        <DetailPanel />
      </div>
    </Screen>
  );
}

function NavArrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <span
      className='inline-flex items-center justify-center'
      style={{ width: u(28), height: u(28), borderRadius: u(7), border: `1px solid ${palette.rule}` }}
    >
      <ChevronGlyph size={11} dir={dir} color={palette.ink} />
    </span>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <span
      className='inline-flex items-center whitespace-nowrap'
      style={{
        height: u(32),
        paddingInline: u(11),
        gap: u(7),
        borderRadius: u(8),
        border: `1px solid ${palette.rule}`,
        fontSize: u(13),
        fontWeight: 500
      }}
    >
      {label}
      <ChevronGlyph size={10} color={palette.inkSoft} />
    </span>
  );
}

function Sidebar() {
  const groundCounts: Record<string, number> = { kiln: 7, studioA: 6, studioB: 3, room4: 7, music: 7 };
  return (
    <aside
      className='flex shrink-0 flex-col'
      style={{ width: u(236), padding: `${u(18)} ${u(16)}`, gap: u(22), borderRight: `1px solid ${palette.rule}`, background: '#FAFBFE' }}
    >
      <div>
        <Eyebrow>Rooms</Eyebrow>
        <div className='flex items-center' style={{ gap: u(8), marginTop: u(12) }}>
          <Check checked />
          <span style={{ fontSize: u(14), fontWeight: 600 }}>Ground floor</span>
          <span className='ml-auto tabular' style={{ fontSize: u(12), color: palette.inkSoft }}>
            5 rooms
          </span>
        </div>
        <ul style={{ marginTop: u(6), paddingLeft: u(23) }}>
          {(Object.keys(palette.rooms) as (keyof typeof palette.rooms)[]).map((key) => (
            <li key={key} className='flex items-center' style={{ gap: u(8), height: u(27), fontSize: u(13.5) }}>
              <Swatch room={key} size={11} />
              {palette.rooms[key].name}
              <span className='ml-auto tabular' style={{ fontSize: u(12), color: palette.inkSoft }}>
                {groundCounts[key]}
              </span>
            </li>
          ))}
        </ul>
        {[
          ['Second floor', '6 rooms'],
          ['Annex', '3 rooms']
        ].map(([name, count]) => (
          <div key={name} className='flex items-center' style={{ gap: u(8), marginTop: u(10) }}>
            <Check checked={false} />
            <span style={{ fontSize: u(14), fontWeight: 500 }}>{name}</span>
            <span className='ml-auto tabular' style={{ fontSize: u(12), color: palette.inkSoft }}>
              {count}
            </span>
          </div>
        ))}
      </div>
      <div>
        <Eyebrow>Pinned · 3</Eyebrow>
        <ul style={{ marginTop: u(10) }}>
          {[
            ['Junior Choir', 'Mon 3:30'],
            ['Hip-Hop II', 'Tue 5:30'],
            ['Teen Choir', 'Fri 5:30']
          ].map(([name, slot]) => (
            <li key={name} className='flex items-center' style={{ gap: u(8), height: u(27), fontSize: u(13.5) }}>
              <PinGlyph pinned size={12} color={palette.ink} />
              {name}
              <span className='ml-auto tabular' style={{ fontSize: u(12), color: palette.inkSoft }}>
                {slot}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Eyebrow>Needs a slot · 2</Eyebrow>
        <div className='flex flex-col' style={{ marginTop: u(10), gap: u(6) }}>
          {[
            ['Teen Ceramics', 'R. Ortega · Kiln room', 'kiln'],
            ['Cello Studio', 'S. Novak · Music room', 'music']
          ].map(([name, meta, room]) => {
            const t = tint(room);
            return (
              <div
                key={name}
                style={{
                  padding: `${u(7)} ${u(10)}`,
                  borderRadius: u(7),
                  border: `1.5px dashed color-mix(in srgb, ${t.ink} 45%, transparent)`,
                  background: `color-mix(in srgb, ${t.fill} 55%, white)`,
                  color: t.ink
                }}
              >
                <p style={{ fontSize: u(13.5), fontWeight: 600 }}>{name}</p>
                <p style={{ fontSize: u(12) }}>{meta}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className='mt-auto'>
        <div className='flex items-baseline justify-between tabular' style={{ fontSize: u(13) }}>
          <span style={{ fontWeight: 600 }}>318 of 320 placed</span>
          <span style={{ color: palette.inkSoft }}>0 conflicts</span>
        </div>
        <div style={{ height: u(6), borderRadius: u(3), background: palette.rule, marginTop: u(8), overflow: 'hidden' }}>
          <div style={{ width: '99.4%', height: '100%', background: palette.cobalt }} />
        </div>
      </div>
    </aside>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='flex' style={{ gap: u(12), paddingBlock: u(9), borderTop: `1px solid ${palette.rule}` }}>
      <span style={{ width: u(70), flexShrink: 0, fontSize: u(13), color: palette.inkSoft }}>{label}</span>
      <div className='min-w-0' style={{ fontSize: u(13.5), lineHeight: 1.35 }}>
        {children}
      </div>
    </div>
  );
}

function DetailPanel() {
  const kiln = palette.rooms.kiln;
  return (
    <aside className='flex shrink-0 flex-col' style={{ width: u(312), padding: `${u(20)} ${u(20)}` }}>
      <div className='flex items-center' style={{ gap: u(8) }}>
        <Swatch room='kiln' size={12} />
        <span style={{ fontSize: u(13), color: palette.inkSoft }}>Ceramics · Ages 12–15</span>
        <span
          className='ml-auto'
          style={{ fontSize: u(11), fontWeight: 600, color: '#fff', background: palette.cobalt, padding: `${u(2)} ${u(6)}`, borderRadius: u(4) }}
        >
          Moved
        </span>
      </div>
      <h3 style={{ fontSize: u(24), fontWeight: 600, letterSpacing: '-0.01em', marginTop: u(10), lineHeight: 1.1 }}>
        Wheel Throwing
      </h3>
      <div style={{ marginTop: u(16) }}>
        <DetailRow label='When'>
          <p className='tabular' style={{ fontWeight: 600 }}>
            Thursdays 4:30–5:30 pm
          </p>
          <p className='tabular' style={{ color: palette.inkSoft, textDecoration: 'line-through' }}>
            Tuesdays 4:30–5:30 pm
          </p>
        </DetailRow>
        <DetailRow label='Teacher'>
          <p>Rosa Ortega</p>
          <p style={{ color: palette.inkSoft }}>Teaches Tue and Thu</p>
        </DetailRow>
        <DetailRow label='Room'>
          <p>Kiln room</p>
          <p style={{ color: palette.inkSoft }}>10 wheels, 2 kilns</p>
        </DetailRow>
        <DetailRow label='Families'>
          <p>None yet</p>
          <p style={{ color: palette.inkSoft }}>Enrollment opens Aug 19</p>
        </DetailRow>
      </div>
      <div
        style={{
          marginTop: u(14),
          padding: `${u(12)} ${u(14)}`,
          borderRadius: u(9),
          background: palette.ice,
          color: palette.ink
        }}
      >
        <p style={{ fontSize: u(13), fontWeight: 600, color: palette.cobaltDeep }}>Why it moved</p>
        <p style={{ fontSize: u(13.5), lineHeight: 1.45, marginTop: u(4) }}>
          Raku Firing needs the Kiln room on Tuesday at 4:30. Thursday at 4:30 is the nearest slot where the kiln
          is free and Rosa is teaching.
        </p>
      </div>
      <div className='flex' style={{ gap: u(8), marginTop: u(14) }}>
        <Button small style={{ flex: 1 }}>
          <PinGlyph pinned={false} size={12} color={kiln.ink} />
          Pin here
        </Button>
        <Button small style={{ flex: 1 }}>
          Move back
        </Button>
      </div>
      <div style={{ marginTop: u(22) }}>
        <Eyebrow>Other slots that fit</Eyebrow>
        <div className='flex flex-wrap' style={{ gap: u(6), marginTop: u(9) }}>
          {['Tue 3:30', 'Tue 5:30', 'Thu 5:30'].map((slot) => (
            <span
              key={slot}
              className='tabular'
              style={{
                fontSize: u(13),
                fontWeight: 500,
                padding: `${u(5)} ${u(9)}`,
                borderRadius: u(6),
                border: `1px dashed color-mix(in srgb, ${kiln.ink} 45%, transparent)`,
                background: `color-mix(in srgb, ${kiln.fill} 45%, white)`,
                color: kiln.ink
              }}
            >
              {slot}
            </span>
          ))}
        </div>
        <p style={{ fontSize: u(12.5), color: palette.inkSoft, marginTop: u(8), lineHeight: 1.4 }}>
          Same time on another day comes first, so families keep their afternoon.
        </p>
      </div>
      <div className='mt-auto' style={{ paddingTop: u(16) }}>
        <Eyebrow>History</Eyebrow>
        <ul style={{ marginTop: u(8), fontSize: u(13), lineHeight: 1.4 }}>
          <li className='flex' style={{ gap: u(8), paddingBlock: u(4) }}>
            <span style={{ width: u(6), height: u(6), borderRadius: 3, background: palette.cobalt, marginTop: u(6), flexShrink: 0 }} />
            <span>
              Moved by the solver <span style={{ color: palette.inkSoft }}>· just now</span>
            </span>
          </li>
          <li className='flex' style={{ gap: u(8), paddingBlock: u(4) }}>
            <span style={{ width: u(6), height: u(6), borderRadius: 3, background: '#B9C1D6', marginTop: u(6), flexShrink: 0 }} />
            <span>
              Created by Ines Alvarez <span style={{ color: palette.inkSoft }}>· Jul 22</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

