import { u } from '~/components/stage';
import { palette } from '../theme';
import { ArrowGlyph, CheckGlyph } from '../ui';
import { Button, Check, Eyebrow, Screen, Swatch } from './chrome';

/*
 * The last step before anything reaches families: every change in plain
 * words, who it touches, and whether those families were asked first.
 */

type Change = {
  kind: 'New' | 'Teacher' | 'Room' | 'Time' | 'Cancelled';
  name: string;
  room: string;
  from: string;
  to: string;
  families: number;
  status: string;
  warn?: boolean;
};

const CHANGES: Change[] = [
  {
    kind: 'New',
    name: 'Teen Ceramics',
    room: 'kiln',
    from: 'Waitlist',
    to: 'Tue 5:30',
    families: 9,
    status: 'Seat offered to the 9 waitlisted families'
  },
  {
    kind: 'Teacher',
    name: 'Ballet II',
    room: 'studioA',
    from: 'T. Adeyemi',
    to: 'M. Reyes',
    families: 11,
    status: 'Oct 21 – Nov 15, while Tola is on leave'
  },
  {
    kind: 'Room',
    name: 'Figure Drawing',
    room: 'room4',
    from: 'Room 4',
    to: 'Room 2',
    families: 9,
    status: 'Same time, one floor up, better light'
  },
  {
    kind: 'Time',
    name: 'Guitar Lab',
    room: 'music',
    from: 'Wed 5:30',
    to: 'Wed 6:00',
    families: 6,
    status: 'Asked first · 6 of 6 said yes'
  },
  {
    kind: 'Time',
    name: 'Sketchbook Club',
    room: 'room4',
    from: 'Tue 3:30',
    to: 'Thu 3:30',
    families: 4,
    status: 'Asked first · 3 yes, 1 hasn’t answered',
    warn: true
  },
  {
    kind: 'Cancelled',
    name: 'Breaking',
    room: 'studioB',
    from: 'Tue 6:45',
    to: 'Cancelled',
    families: 3,
    status: 'Under the minimum of 6 · refunds issued'
  }
];

const KIND_STYLE: Record<Change['kind'], { color: string; background: string }> = {
  New: { color: palette.cobaltDeep, background: palette.ice },
  Teacher: { color: '#3E3375', background: '#ECE9F8' },
  Room: { color: '#2F5321', background: '#E5EFE0' },
  Time: { color: '#7A3517', background: '#F9E8DC' },
  Cancelled: { color: '#9C2618', background: '#FBE4E1' }
};

/** The publish summary panel. Size 1000 × 1000. */
export function PublishScreen() {
  const total = CHANGES.reduce((a, c) => a + c.families, 0);
  return (
    <Screen style={{ width: u(1000), height: u(1000), borderRadius: u(18) }}>
      <div style={{ padding: `${u(40)} ${u(44)} ${u(0)}` }}>
        <div className='flex items-center' style={{ gap: u(10) }}>
          <Eyebrow>Review and publish</Eyebrow>
          <span style={{ fontSize: u(13), color: palette.inkSoft }}>Fall 2024 · Draft 3 → Live · from week 7</span>
        </div>
        <h2 className='tabular' style={{ fontSize: u(38), fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.1, marginTop: u(14), textWrap: 'balance' }}>
          6 changes · <span style={{ color: palette.cobalt }}>{total} families</span> will get an email
        </h2>
        <p style={{ fontSize: u(17), lineHeight: 1.5, color: palette.inkSoft, marginTop: u(10), maxWidth: u(640) }}>
          One plain email per child, saying what changed and from when. Nothing goes out until you press publish.
        </p>
      </div>

      <div style={{ margin: `${u(28)} ${u(44)} 0`, borderRadius: u(12), border: `1px solid ${palette.rule}`, overflow: 'hidden' }}>
        <div
          className='grid items-center'
          style={{
            gridTemplateColumns: `${u(108)} ${u(206)} ${u(250)} ${u(90)} 1fr`,
            height: u(40),
            paddingInline: u(18),
            background: '#FAFBFE',
            borderBottom: `1px solid ${palette.rule}`,
            fontSize: u(12.5),
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: palette.inkSoft
          }}
        >
          <span>Change</span>
          <span>Class</span>
          <span>From → to</span>
          <span className='text-right' style={{ paddingRight: u(22) }}>
            Families
          </span>
          <span>Notes</span>
        </div>
        {CHANGES.map((c, i) => (
          <div
            key={c.name}
            className='grid items-center tabular'
            style={{
              gridTemplateColumns: `${u(108)} ${u(206)} ${u(250)} ${u(90)} 1fr`,
              minHeight: u(68),
              paddingInline: u(18),
              borderTop: i ? `1px solid ${palette.rule}` : undefined,
              fontSize: u(15)
            }}
          >
            <span>
              <span style={{ fontSize: u(12.5), fontWeight: 600, padding: `${u(3)} ${u(8)}`, borderRadius: u(5), ...KIND_STYLE[c.kind] }}>{c.kind}</span>
            </span>
            <span className='flex items-center' style={{ gap: u(9) }}>
              <Swatch room={c.room} size={12} />
              <span style={{ fontWeight: 600 }}>{c.name}</span>
            </span>
            <span className='flex items-center' style={{ gap: u(9) }}>
              <span style={{ color: palette.inkSoft, textDecoration: c.kind === 'New' ? undefined : 'line-through', textDecorationColor: 'rgba(86,96,122,.6)' }}>{c.from}</span>
              <ArrowGlyph size={13} color={palette.inkSoft} />
              <span style={{ fontWeight: 600, color: c.kind === 'Cancelled' ? '#9C2618' : palette.ink }}>{c.to}</span>
            </span>
            <span className='text-right' style={{ paddingRight: u(22), fontWeight: 600, fontSize: u(16) }}>
              {c.families}
            </span>
            <span className='flex items-center' style={{ gap: u(8), fontSize: u(14), lineHeight: 1.35, color: c.warn ? '#8A4B12' : palette.inkSoft }}>
              {c.warn ? (
                <span className='shrink-0' style={{ width: u(8), height: u(8), borderRadius: '50%', background: '#D98A1E' }} />
              ) : c.status.startsWith('Asked') ? (
                <CheckGlyph size={14} color='#2F7A3A' />
              ) : null}
              {c.status}
            </span>
          </div>
        ))}
      </div>

      <div className='grid' style={{ gridTemplateColumns: '1fr 1fr', gap: u(16), margin: `${u(22)} ${u(44)} 0` }}>
        <Option
          title='Write the changes back to the spreadsheet'
          body='Updates 6 rows in “Fall 24 v7 FINAL”. The front desk still reads it.'
        />
        <Option title='Email families now' body='Or schedule it for Friday at 9:00 am, after the last answers are in.' />
      </div>

      <div style={{ margin: `${u(22)} ${u(44)} 0`, padding: `${u(18)} ${u(20)}`, borderRadius: u(12), background: palette.ice }}>
        <p style={{ fontSize: u(13), fontWeight: 600, color: palette.cobaltDeep }}>What Leo Nakamura’s family will read</p>
        <p style={{ fontSize: u(16.5), lineHeight: 1.5, marginTop: u(6) }}>
          “From Wednesday, October 23, Guitar Lab runs <b style={{ fontWeight: 600 }}>6:00–7:00 pm</b> instead of 5:30. Same
          teacher, same room. Thank you for answering so quickly.”
        </p>
      </div>

      <div
        className='absolute flex items-center'
        style={{ left: 0, right: 0, bottom: 0, height: u(92), paddingInline: u(44), gap: u(12), borderTop: `1px solid ${palette.rule}` }}
      >
        <span style={{ fontSize: u(14.5), color: palette.inkSoft }}>Last published Oct 4 by Ines Alvarez</span>
        <div className='ml-auto flex' style={{ gap: u(10) }}>
          <Button style={{ height: u(46), paddingInline: u(20), fontSize: u(16) }}>Back to the week</Button>
          <Button primary style={{ height: u(46), paddingInline: u(22), fontSize: u(16) }}>
            Publish and email {total} families
          </Button>
        </div>
      </div>
    </Screen>
  );
}

function Option({ title, body }: { title: string; body: string }) {
  return (
    <div className='flex' style={{ gap: u(12), padding: `${u(16)} ${u(18)}`, borderRadius: u(12), border: `1px solid ${palette.rule}` }}>
      <div style={{ marginTop: u(2) }}>
        <Check checked size={18} />
      </div>
      <div>
        <p style={{ fontSize: u(15.5), fontWeight: 600, lineHeight: 1.3 }}>{title}</p>
        <p style={{ fontSize: u(14), lineHeight: 1.45, color: palette.inkSoft, marginTop: u(3) }}>{body}</p>
      </div>
    </div>
  );
}
