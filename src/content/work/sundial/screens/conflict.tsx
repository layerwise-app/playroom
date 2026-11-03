import type { CSSProperties, ReactNode } from 'react';
import { u } from '~/components/stage';
import { palette } from '../theme';
import { AlertGlyph } from '../ui';
import { Button, Eyebrow, Screen, Swatch } from './chrome';
import { WeekGrid } from './week';
import type { GridItem } from './week';

/*
 * Week 6, mid-term. Ines drops a waitlist section of Teen Ceramics onto
 * Tuesday 4:30, where Raku Firing already has eight enrolled families, so the
 * solver doesn't move anything on its own. It explains and offers fixes.
 */

const r = (
  id: string,
  name: string,
  teacher: string,
  room: string,
  roomName: string,
  day: number,
  time: number,
  extra: Partial<GridItem> = {}
): GridItem => ({ id, name, teacher, room, roomName, day, time, ...extra });

const ITEMS: GridItem[] = [
  r('choirJr', 'Junior Choir', 'L. Brandt', 'music', 'Music room', 0, 0, { enrolled: '17 enrolled', pinned: true }),
  r('kidsClay', 'Kids Clay', 'D. Hale', 'kiln', 'Kiln room', 0, 1, { enrolled: '12 enrolled' }),
  r('ballet1', 'Ballet I', 'T. Adeyemi', 'studioA', 'Studio A', 0, 2, { enrolled: '14 enrolled' }),
  r('figure', 'Figure Drawing', 'A. Mensah', 'room4', 'Room 4', 0, 3, { enrolled: '9 enrolled' }),
  r('hiphop1', 'Hip-Hop I', 'J. Kim', 'studioB', 'Studio B', 1, 0, { enrolled: '16 enrolled' }),
  r('raku', 'Raku Firing', 'D. Hale', 'kiln', 'Kiln room', 1, 1, { enrolled: '8 enrolled', clash: true }),
  r('teenCeramics', 'Teen Ceramics', 'R. Ortega', 'kiln', 'Kiln room', 1, 1, { clash: true }),
  r('hiphop2', 'Hip-Hop II', 'J. Kim', 'studioB', 'Studio B', 1, 2, { enrolled: '15 enrolled', pinned: true }),
  r('print', 'Printmaking', 'A. Mensah', 'room4', 'Room 4', 1, 3, { enrolled: '10 enrolled' }),
  r('watercolor', 'Watercolor', 'A. Mensah', 'room4', 'Room 4', 2, 0, { enrolled: '11 enrolled' }),
  r('ballet2', 'Ballet II', 'T. Adeyemi', 'studioA', 'Studio A', 2, 1),
  r('sculpt', 'Sculpture I', 'D. Hale', 'room4', 'Room 4', 2, 1),
  r('guitar', 'Guitar Lab', 'S. Novak', 'music', 'Music room', 2, 2, { enrolled: '8 enrolled' }),
  r('adultWheel', 'Adult Wheel', 'D. Hale', 'kiln', 'Kiln room', 2, 3, { enrolled: '10 enrolled' }),
  r('handBuild', 'Hand Building', 'R. Ortega', 'kiln', 'Kiln room', 3, 0, { enrolled: '12 enrolled' }),
  r('wheel', 'Wheel Throwing', 'R. Ortega', 'kiln', 'Kiln room', 3, 1, { enrolled: '10 enrolled' }),
  r('contemporary', 'Contemporary', 'M. Reyes', 'studioA', 'Studio A', 3, 2),
  r('portfolio', 'Portfolio Prep', 'A. Mensah', 'room4', 'Room 4', 3, 2),
  r('jazz', 'Jazz Combo', 'S. Novak', 'music', 'Music room', 3, 3, { enrolled: '7 enrolled' }),
  r('comics', 'Comics Lab', 'P. Doyle', 'room4', 'Room 4', 4, 0, { enrolled: '12 enrolled' }),
  r('tap', 'Tap I', 'T. Adeyemi', 'studioA', 'Studio A', 4, 1, { enrolled: '11 enrolled' }),
  r('drums', 'Drum Circle', 'L. Brandt', 'music', 'Music room', 4, 1),
  r('choirTeen', 'Teen Choir', 'L. Brandt', 'music', 'Music room', 4, 2, { enrolled: '22 enrolled', pinned: true })
];

const DAYS = [
  { label: 'Mon', date: '14' },
  { label: 'Tue', date: '15' },
  { label: 'Wed', date: '16' },
  { label: 'Thu', date: '17' },
  { label: 'Fri', date: '18' }
];

/** A zoomed piece of week 6 with the conflict explanation open. Content size about 1120 × 720. */
export function ConflictScreen() {
  const colW = 212;
  const rowH = 132;
  const gutter = 56;
  const headH = 36;
  return (
    <Screen style={{ width: u(1160), height: u(760) }}>
      <div className='flex items-center' style={{ height: u(62), paddingInline: u(24), gap: u(12), borderBottom: `1px solid ${palette.rule}` }}>
        <h2 className='whitespace-nowrap' style={{ fontSize: u(22), fontWeight: 600, letterSpacing: '-0.01em' }}>
          Week of October 14
        </h2>
        <span className='tabular' style={{ fontSize: u(13), color: palette.inkSoft }}>
          Week 6 of 14
        </span>
        <span
          style={{
            fontSize: u(12),
            fontWeight: 600,
            color: '#7A3517',
            background: palette.rooms.kiln.fill,
            padding: `${u(3)} ${u(8)}`,
            borderRadius: u(5)
          }}
        >
          Term is live · changes reach families
        </span>
      </div>
      <div className='relative' style={{ padding: `${u(4)} ${u(14)}` }}>
        <WeekGrid items={ITEMS} days={DAYS} times={['3:30', '4:30', '5:30', '6:30']} colW={colW} rowH={rowH} gutter={gutter} headH={headH} />
        <ConflictPopover style={{ left: u(14 + gutter + colW * 2 + 16), top: u(4 + headH + rowH - 64) }} notchY={92} />
      </div>
    </Screen>
  );
}

function Fix({
  n,
  title,
  body,
  action,
  best,
  primary
}: {
  n: number;
  title: string;
  body: ReactNode;
  action: string;
  best?: boolean;
  primary?: boolean;
}) {
  return (
    <div
      className='flex'
      style={{
        gap: u(12),
        padding: `${u(13)} ${u(14)}`,
        borderRadius: u(10),
        border: `1px solid ${best ? '#B8C6F5' : palette.rule}`,
        background: best ? '#F5F7FF' : palette.paper
      }}
    >
      <span
        className='inline-flex shrink-0 items-center justify-center tabular'
        style={{
          width: u(22),
          height: u(22),
          borderRadius: '50%',
          background: best ? palette.cobalt : palette.ice,
          color: best ? '#fff' : palette.cobaltDeep,
          fontSize: u(12),
          fontWeight: 600
        }}
      >
        {n}
      </span>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center' style={{ gap: u(8) }}>
          <p style={{ fontSize: u(15), fontWeight: 600, lineHeight: 1.25 }}>{title}</p>
          {best ? (
            <span style={{ fontSize: u(11), fontWeight: 600, color: palette.cobaltDeep, background: palette.ice, padding: `${u(2)} ${u(6)}`, borderRadius: u(4) }}>
              Best fit
            </span>
          ) : null}
        </div>
        <p style={{ fontSize: u(13.5), lineHeight: 1.4, color: palette.inkSoft, marginTop: u(3) }}>{body}</p>
      </div>
      <div className='shrink-0 self-center'>
        <Button small primary={primary}>
          {action}
        </Button>
      </div>
    </div>
  );
}

export function ConflictPopover({ style, notchY = 80, notch = true }: { style?: CSSProperties; notchY?: number; notch?: boolean }) {
  return (
    <div
      className='absolute'
      style={{
        width: u(500),
        borderRadius: u(14),
        background: palette.paper,
        boxShadow: `0 0 0 1px rgba(18,26,51,.08), 0 ${u(24)} ${u(50)} ${u(-16)} rgba(18,26,51,.4), 0 ${u(4)} ${u(10)} rgba(18,26,51,.08)`,
        zIndex: 10,
        ...style
      }}
    >
      <span
        aria-hidden
        className='absolute'
        style={{
          display: notch ? undefined : 'none',
          left: u(-8),
          top: u(notchY),
          width: u(16),
          height: u(16),
          background: palette.paper,
          transform: 'rotate(45deg)',
          boxShadow: '-1px 1px 0 rgba(18,26,51,.08)'
        }}
      />
      <div style={{ padding: `${u(18)} ${u(20)} ${u(14)}` }}>
        <div className='flex items-center' style={{ gap: u(7) }}>
          <AlertGlyph size={16} />
          <Eyebrow color='#B42A1B'>Conflict</Eyebrow>
          <span className='ml-auto' style={{ fontSize: u(13), color: palette.inkSoft }}>
            Nothing has moved yet
          </span>
        </div>
        <h3 style={{ fontSize: u(22), fontWeight: 600, lineHeight: 1.2, marginTop: u(10), letterSpacing: '-0.01em', textWrap: 'balance' }}>
          Kiln room is booked twice on Tuesday at 4:30
        </h3>
        <div className='flex flex-col' style={{ marginTop: u(14), gap: u(1), borderRadius: u(9), overflow: 'hidden', border: `1px solid ${palette.rule}` }}>
          {[
            ['Raku Firing', 'D. Hale · 4:30–6:00', '8 families enrolled', true],
            ['Teen Ceramics', 'R. Ortega · 4:30–5:30', 'New section · waitlist of 9', false]
          ].map(([name, meta, families, enrolled]) => (
            <div
              key={name as string}
              className='flex items-center tabular'
              style={{ gap: u(10), padding: `${u(10)} ${u(12)}`, background: enrolled ? '#FFFDF9' : palette.paper, borderTop: enrolled ? undefined : `1px solid ${palette.rule}` }}
            >
              <Swatch room='kiln' size={12} />
              <span style={{ fontSize: u(14.5), fontWeight: 600 }}>{name}</span>
              <span style={{ fontSize: u(13.5), color: palette.inkSoft }}>{meta}</span>
              <span
                className='ml-auto'
                style={{
                  fontSize: u(12.5),
                  fontWeight: 600,
                  color: enrolled ? '#7A3517' : palette.inkSoft
                }}
              >
                {families}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: `${u(4)} ${u(20)} ${u(18)}`, borderTop: `1px solid ${palette.rule}` }}>
        <Eyebrow style={{ marginTop: u(12), marginBottom: u(10) }}>Suggested fixes</Eyebrow>
        <div className='flex flex-col' style={{ gap: u(8) }}>
          <Fix
            n={1}
            best
            primary
            title='Move Teen Ceramics to Tuesday 5:30'
            body='The kiln is free and Rosa is already in that day. No families affected.'
            action='Apply'
          />
          <Fix
            n={2}
            title='Move Raku Firing to Thursday 5:30'
            body='Dana is free then. The 8 enrolled families get asked first, and it waits for them.'
            action='Ask families'
          />
          <Fix
            n={3}
            title='Keep both in the kiln'
            body='Your call. It stays flagged on the publish summary.'
            action='Keep both'
          />
        </div>
      </div>
    </div>
  );
}
