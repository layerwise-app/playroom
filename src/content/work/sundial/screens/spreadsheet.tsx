import type { CSSProperties, ReactNode } from 'react';
import { u } from '~/components/stage';

/*
 * The term spreadsheet Fernwood ran on before Sundial: one tab per version,
 * a fill color per weekday, and a COUNTIFS clash column that only catches
 * exact text. Drawn in a generic spreadsheet app, not Sundial's type.
 */

const SHEET_FONT = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
const GRID = '#E2E3E3';
const CHROME = '#5F6368';

const DAY_FILL: Record<string, string> = {
  Mon: '#D9EAD3',
  Tue: '#FFF2CC',
  Wed: '#CFE2F3',
  Thu: '#D9D2E9',
  Fri: '#FCE5CD'
};

type Row = {
  cells: string[];
  fill?: string;
  /** Per-column overrides. */
  style?: Record<number, CSSProperties>;
  strike?: boolean;
  /** Columns with a comment marker. */
  notes?: number[];
};

const HEAD = ['Class', 'Ages', 'Teacher', 'Room', 'Day', 'Start', 'End', 'Cap', 'Enr', 'Status', 'Notes', 'Clash?', ''];
const WIDTHS = [158, 74, 112, 92, 50, 54, 54, 42, 42, 86, 318, 66];

const pink = { background: '#F4CCCC' };
const clash = { background: '#EA9999', color: '#990000', fontWeight: 700 };

const ROWS: Row[] = [
  { cells: ['Junior Choir', '8–11', 'Lena Brandt', 'Music room', 'Mon', '3:30', '4:30', '20', '17', 'Confirmed', 'year-long. DO NOT MOVE (concert hall Sat)', ''] },
  { cells: ['Pre-Ballet', '4–6', 'Tola A.', 'Studio A', 'Mon', '3:30', '4:15', '10', '9', 'Confirmed', '', ''] },
  { cells: ['Kids Clay', '6–9', 'Dana Hale', 'Kiln room', 'Mon', '4:30', '5:30', '12', '', 'Confirmed', '', ''] },
  { cells: ['Ballet I', '7–9', 'Tola Adeyemi', 'Studio A', 'Mon', '5:30', '6:30', '14', '', 'Confirmed', '', ''] },
  { cells: ['Figure Drawing', 'teen/adult', 'Ama Mensah', 'Room 4', 'Mon', '6:30', '8:00', '12', '', '??', 'Ama wants Room 2 (better light). keys?? ask Dev', ''], style: { 9: pink } },
  { cells: ['Life Drawing', 'adult', 'Ama Mensah', 'Room 4', 'Mon', '7:30', '9:00', '12', '', 'Confirmed', 'overlaps Figure Drawing 7:30–8:00!!', ''], style: { 10: { color: '#CC0000', fontWeight: 700 } } },
  { cells: ['Hip-Hop I', '9–12', 'Jun Kim', 'Studio B', 'Tue', '3:30', '4:30', '16', '', 'Confirmed', 'Studio B floor refinish wk 1? (Jun email 8/2)', ''], notes: [10] },
  { cells: ['Wheel Throwing', '12–15', 'Rosa Ortega', 'Kiln room', 'Tue', '4:30', '5:30', '10', '', 'Confirmed', '', ''] },
  { cells: ['Raku Firing (NEW)', 'teen/adult', 'Dana Hale', 'Kiln Rm', 'Tue', '4:30', '6:00', '8', '', 'Pending', 'added 7/22 per Dana', ''], fill: '#FFFF00', notes: [3] },
  { cells: ['Sculpture I', '10–13', 'Dana Hale', 'Room 4', 'Tue', '4:30', '5:30', '12', '', 'Confirmed', 'Dana in 2 places Tue 4:30?? check', ''], style: { 10: pink } },
  { cells: ['Hip-Hop II', '12–16', 'Jun Kim', 'Studio B', 'Tue', '5:30', '6:30', '16', '', 'Confirmed', '', ''] },
  { cells: ['Printmaking', '13–17', 'Ama Mensah', 'Room 4', 'Tue', '6:30', '8:00', '10', '', 'Confirmed', '', ''] },
  { cells: ['Salsa Basics', 'adult', 'Marisol Reyes', 'Studio A', 'Tue', '7:30', '8:30', '20', '', 'Waiting', 'Marisol hasn’t confirmed Tuesdays', ''], style: { 9: pink } },
  { cells: ['Watercolor', '9–12', 'Ama Mensah', 'Room 4', 'Wed', '3:30', '4:30', '12', '', 'Confirmed', '', ''] },
  { cells: ['Ballet II', '10–13', 'Tola Adeyemi', 'Studio A', 'Wed', '4:30', '5:30', '14', '', 'Confirmed', 'Tola on leave Oct 21 – Nov 15. sub?', ''], notes: [10] },
  { cells: ['Guitar Lab', '11–15', 'Sam Novak', 'Music', 'Wed', '5:30', '6:30', '8', '', 'Confirmed', '', ''] },
  { cells: ['Adult Wheel', 'adult', 'Dana Hale', 'Kiln room', 'Wed', '6:30', '8:00', '10', '', 'Confirmed', '', ''] },
  { cells: ['Hand Building', '8–11', 'Rosa Ortega', 'Kiln room', 'Thu', '3:30', '4:30', '12', '', 'Confirmed', '', ''] },
  { cells: ['Contemporary', '13–17', 'Marisol Reyes', 'Studio A', 'Thu', '5:30', '6:30', '14', '', 'Confirmed', '', ''] },
  { cells: ['Portfolio Prep', '15–18', 'Ama Mensah', 'Room 4', 'Thu', '5:30', '7:00', '10', '', 'Confirmed', '', ''] },
  { cells: ['Jazz Combo', '14–18', 'Sam Novak', 'Music room', 'Thu', '6:30', '7:30', '8', '', 'Confirmed', '', ''] },
  { cells: ['Comics Lab', '10–14', 'Pat Doyle', 'Room 4', 'Fri', '3:30', '4:30', '12', '', 'Confirmed', '', ''] },
  { cells: ['Wheel Throwing II', '12–15', 'Rosa Ortega', 'Kiln room', 'Fri', '4:30', '5:30', '10', '', 'MOVED?', 'Rosa NOT Fridays from Oct (email 6/3). see v6', ''], strike: true, notes: [10] },
  { cells: ['Tap I', '7–10', 'Tola Adeyemi', 'Studio A', 'Fri', '4:30', '5:30', '12', '', 'Confirmed', '', ''] },
  { cells: ['Teen Choir', '12–17', 'Lena Brandt', 'Music room', 'Fri', '5:30', '6:30', '24', '', 'Confirmed', '', 'CLASH'], style: { 11: clash } },
  { cells: ['Drum Circle', '8–12', 'Lena Brandt', 'Music room', 'Fri', '5:30', '6:15', '10', '', 'Confirmed', 'can Lena do both??', 'CLASH'], style: { 11: clash } }
];

const ROW_H = 21;
const NUM_W = 46;

function Cell({ width, children, style, note }: { width?: number; children?: ReactNode; style?: CSSProperties; note?: boolean }) {
  return (
    <div
      className='relative shrink-0 truncate'
      style={{
        width: width ? u(width) : undefined,
        flex: width ? undefined : 1,
        height: u(ROW_H),
        lineHeight: u(ROW_H - 1),
        paddingInline: u(4),
        borderRight: `1px solid ${GRID}`,
        borderBottom: `1px solid ${GRID}`,
        ...style
      }}
    >
      {children}
      {note ? (
        <span
          className='absolute'
          style={{
            right: 0,
            top: 0,
            width: 0,
            height: 0,
            borderTop: `${u(7)} solid #F29900`,
            borderLeft: `${u(7)} solid transparent`
          }}
        />
      ) : null}
    </div>
  );
}

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg viewBox='0 0 18 18' aria-hidden style={{ width: u(size), height: u(size), display: 'block' }}>
      <path d={d} fill='none' stroke={CHROME} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

const TOOL_SEP = <span style={{ width: 1, height: u(20), background: '#DADCE0', marginInline: u(6) }} />;

/** The old term spreadsheet. Content size 1328 × 774. */
export function SpreadsheetScreen() {
  const selected = { row: 9, col: 11 };
  return (
    <div className='flex h-full w-full flex-col' style={{ fontFamily: SHEET_FONT, background: '#F9FBFD', color: '#202124' }}>
      {/* Title and menus */}
      <div className='flex shrink-0 items-center' style={{ height: u(62), paddingInline: u(14), gap: u(12) }}>
        <svg viewBox='0 0 28 36' aria-hidden style={{ width: u(26), height: u(34) }}>
          <path d='M3 1 H19 L27 9 V33 a2 2 0 0 1 -2 2 H3 a2 2 0 0 1 -2 -2 V3 a2 2 0 0 1 2 -2 Z' fill='#188038' />
          <path d='M19 1 V9 H27' fill='#0C5A24' />
          <rect x='6' y='15' width='16' height='13' fill='none' stroke='#fff' strokeWidth='1.6' />
          <path d='M6 19.5 H22 M6 23.8 H22 M12 15 V28' stroke='#fff' strokeWidth='1.6' />
        </svg>
        <div className='min-w-0'>
          <div className='flex items-center' style={{ gap: u(8) }}>
            <span style={{ fontSize: u(18) }}>Fall 2024 MASTER schedule v7 – DO NOT SORT</span>
            <svg viewBox='0 0 18 18' aria-hidden style={{ width: u(16), height: u(16) }}>
              <path d='M9 2 L11 6.6 L16 7 L12.2 10.3 L13.4 15.2 L9 12.6 L4.6 15.2 L5.8 10.3 L2 7 L7 6.6 Z' fill='none' stroke={CHROME} strokeWidth='1.3' strokeLinejoin='round' />
            </svg>
          </div>
          <div className='flex items-center' style={{ gap: u(14), fontSize: u(14), marginTop: u(3) }}>
            {['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Tools', 'Extensions', 'Help'].map((m) => (
              <span key={m}>{m}</span>
            ))}
            <span style={{ color: CHROME, textDecoration: 'underline', marginLeft: u(6) }}>
              Last edit was 6 minutes ago by Ines Alvarez
            </span>
          </div>
        </div>
        <div className='ml-auto flex items-center' style={{ gap: u(10) }}>
          <div className='flex' style={{ marginRight: u(4) }}>
            {[
              ['IA', '#2F5321', '#C9E2BE'],
              ['DP', '#1C4E68', '#C2DEEC'],
              ['RO', '#7A3517', '#F0CDB7']
            ].map(([initials, ink, fill], i) => (
              <span
                key={initials}
                className='inline-flex items-center justify-center'
                style={{
                  width: u(30),
                  height: u(30),
                  borderRadius: '50%',
                  background: fill,
                  color: ink,
                  fontSize: u(12),
                  fontWeight: 700,
                  marginLeft: i ? u(-6) : 0,
                  boxShadow: '0 0 0 2px #F9FBFD'
                }}
              >
                {initials}
              </span>
            ))}
          </div>
          <span
            className='inline-flex items-center'
            style={{ height: u(36), paddingInline: u(20), borderRadius: u(18), background: '#C2E7FF', fontSize: u(14), fontWeight: 700 }}
          >
            Share
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className='mx-auto flex shrink-0 items-center'
        style={{
          height: u(40),
          width: `calc(100% - ${u(20)})`,
          paddingInline: u(12),
          gap: u(10),
          borderRadius: u(20),
          background: '#EDF2FA',
          fontSize: u(14),
          color: '#444746'
        }}
      >
        <Icon d='M4 8 H11 a4 4 0 0 1 0 8 H8 M4 8 L7 5 M4 8 L7 11' />
        <Icon d='M14 8 H7 a4 4 0 0 0 0 8 H10 M14 8 L11 5 M14 8 L11 11' />
        <Icon d='M5 6 V2.5 H13 V6 M5 13 H3 V7 H15 V13 H13 M5 11 H13 V15.5 H5 Z' />
        {TOOL_SEP}
        <span>100%</span>
        {TOOL_SEP}
        <span>$</span>
        <span>%</span>
        <span>.0</span>
        <span>.00</span>
        <span>123</span>
        {TOOL_SEP}
        <span style={{ minWidth: u(70) }}>Arial</span>
        {TOOL_SEP}
        <span style={{ padding: `${u(1)} ${u(8)}`, border: '1px solid #747775', borderRadius: u(4) }}>10</span>
        {TOOL_SEP}
        <span style={{ fontWeight: 700 }}>B</span>
        <span style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>I</span>
        <span style={{ textDecoration: 'line-through' }}>S</span>
        <span style={{ textDecoration: 'underline', textDecorationColor: '#000', textDecorationThickness: u(3) }}>A</span>
        {TOOL_SEP}
        <span className='inline-flex items-center justify-center' style={{ width: u(18), height: u(18), background: '#FFFF00', border: '1px solid #747775' }} />
        <Icon d='M3 3 H15 V15 H3 Z M3 9 H15 M9 3 V15' />
        <Icon d='M3 5 H15 M3 9 H11 M3 13 H15' />
        <Icon d='M3 4 H15 M3 9 H15 M3 14 H9 M12 12 L14 14 L12 16' />
      </div>

      {/* Formula bar */}
      <div
        className='flex shrink-0 items-center'
        style={{ height: u(32), marginTop: u(6), borderTop: `1px solid ${GRID}`, borderBottom: `1px solid ${GRID}`, background: '#fff', fontSize: u(14) }}
      >
        <span style={{ width: u(96), paddingInline: u(12), borderRight: `1px solid ${GRID}` }}>L10</span>
        <span style={{ paddingInline: u(12), color: CHROME, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>fx</span>
        <span style={{ fontFamily: '"Roboto Mono", ui-monospace, Menlo, monospace', fontSize: u(13) }}>
          =IF(COUNTIFS($D:$D,D10,$E:$E,E10,$F:$F,F10)&gt;1,&quot;CLASH&quot;,&quot;&quot;)
        </span>
      </div>

      {/* Grid */}
      <div className='relative min-h-0 flex-1 overflow-hidden' style={{ background: '#fff', fontSize: u(13) }}>
        <div className='flex' style={{ background: '#F8F9FA', color: CHROME, fontSize: u(12) }}>
          <Cell width={NUM_W} style={{ borderRight: `${u(4)} solid #C0C0C0` }} />
          {WIDTHS.map((w, i) => (
            <Cell
              key={i}
              width={w}
              style={{
                textAlign: 'center',
                background: i === selected.col ? '#D3E3FD' : undefined,
                color: i === selected.col ? '#0B57D0' : CHROME,
                fontWeight: i === selected.col ? 700 : 400
              }}
            >
              {String.fromCharCode(65 + i)}
            </Cell>
          ))}
          <Cell style={{ textAlign: 'center' }}>M</Cell>
        </div>
        {/* Header row (frozen) */}
        <div className='flex' style={{ borderBottom: `${u(3)} solid #C0C0C0` }}>
          <Cell width={NUM_W} style={{ background: '#F8F9FA', color: CHROME, fontSize: u(12), textAlign: 'center' }}>
            1
          </Cell>
          {HEAD.slice(0, 12).map((h, i) => (
            <Cell key={h} width={WIDTHS[i]} style={{ background: '#3C4043', color: '#fff', fontWeight: 700 }}>
              {h}
            </Cell>
          ))}
          <Cell style={{ background: '#3C4043' }} />
        </div>
        {ROWS.map((row, r) => {
          const fill = row.fill ?? DAY_FILL[row.cells[4]];
          const rowNumber = r + 2;
          return (
            <div key={r} className='flex'>
              <Cell
                width={NUM_W}
                style={{
                  background: rowNumber === selected.row + 1 ? '#D3E3FD' : '#F8F9FA',
                  color: rowNumber === selected.row + 1 ? '#0B57D0' : CHROME,
                  fontWeight: rowNumber === selected.row + 1 ? 700 : 400,
                  fontSize: u(12),
                  textAlign: 'center'
                }}
              >
                {rowNumber}
              </Cell>
              {row.cells.map((value, c) => (
                <Cell
                  key={c}
                  width={WIDTHS[c]}
                  note={row.notes?.includes(c)}
                  style={{
                    background: fill,
                    textAlign: c >= 5 && c <= 8 ? 'right' : undefined,
                    textDecoration: row.strike ? 'line-through' : undefined,
                    color: row.strike ? '#80868B' : undefined,
                    fontWeight: c === 0 && row.fill ? 700 : undefined,
                    ...row.style?.[c]
                  }}
                >
                  {value}
                </Cell>
              ))}
              <Cell />
            </div>
          );
        })}
        {/* Selected cell L10 */}
        <div
          className='absolute'
          style={{
            left: u(NUM_W + WIDTHS.slice(0, selected.col).reduce((a, b) => a + b, 0) - 1),
            top: u(ROW_H * (selected.row + 1) + 3 - 1),
            width: u(WIDTHS[selected.col] + 1),
            height: u(ROW_H + 1),
            border: `${u(2)} solid #1A73E8`
          }}
        >
          <span className='absolute' style={{ right: u(-4), bottom: u(-4), width: u(7), height: u(7), background: '#1A73E8', border: '1px solid #fff' }} />
        </div>
        {/* Comment thread on D10 */}
        <CommentThread
          style={{
            left: u(NUM_W + WIDTHS.slice(0, 4).reduce((a, b) => a + b, 0) + 8),
            top: u(ROW_H * 10 + 3 - 4)
          }}
        />
      </div>

      {/* Sheet tabs */}
      <div
        className='flex shrink-0 items-center'
        style={{ height: u(40), paddingInline: u(12), gap: u(4), borderTop: `1px solid ${GRID}`, background: '#F9FBFD', fontSize: u(13.5) }}
      >
        <span style={{ fontSize: u(20), color: CHROME, width: u(28), textAlign: 'center' }}>+</span>
        <Icon d='M3 5 H15 M3 9 H15 M3 13 H15' />
        {['Fall 24 v7 FINAL', 'Fall 24 v6', 'Rooms', 'Teacher avail (OLD)', 'Emails pasted', 'Spring 23', 'Copy of Fall 24 v5'].map((tab, i) => (
          <span
            key={tab}
            className='inline-flex items-center whitespace-nowrap'
            style={{
              height: u(30),
              paddingInline: u(14),
              borderRadius: u(6),
              background: i === 0 ? '#E1E9F7' : undefined,
              color: i === 0 ? '#0B57D0' : '#444746',
              fontWeight: i === 0 ? 700 : 400,
              marginLeft: i === 0 ? u(10) : 0
            }}
          >
            {tab}
          </span>
        ))}
      </div>
    </div>
  );
}

function CommentThread({ style }: { style: CSSProperties }) {
  const entries = [
    {
      initials: 'IA',
      ink: '#2F5321',
      fill: '#C9E2BE',
      name: 'Ines Alvarez',
      when: '9:12 AM Jul 23',
      text: 'Raku and Wheel Throwing are both in the kiln Tue 4:30?? Column L says no clash.'
    },
    {
      initials: 'DP',
      ink: '#1C4E68',
      fill: '#C2DEEC',
      name: 'Dev Patel',
      when: '9:40 AM Jul 23',
      text: '“Kiln Rm” vs “Kiln room”. COUNTIFS only matches exact text. And it can’t see 4:30–6:00 overlapping 5:30.'
    }
  ];
  return (
    <div
      className='absolute'
      style={{
        width: u(330),
        padding: u(14),
        borderRadius: u(10),
        background: '#fff',
        boxShadow: '0 1px 3px rgba(60,64,67,.3), 0 4px 10px 2px rgba(60,64,67,.15)',
        fontSize: u(13.5),
        lineHeight: 1.42,
        zIndex: 5,
        ...style
      }}
    >
      {entries.map((entry, i) => (
        <div key={entry.name} style={{ marginTop: i ? u(14) : 0 }}>
          <div className='flex items-center' style={{ gap: u(9) }}>
            <span
              className='inline-flex items-center justify-center'
              style={{ width: u(30), height: u(30), borderRadius: '50%', background: entry.fill, color: entry.ink, fontSize: u(12), fontWeight: 700 }}
            >
              {entry.initials}
            </span>
            <div>
              <p style={{ fontWeight: 700, fontSize: u(13.5) }}>{entry.name}</p>
              <p style={{ color: CHROME, fontSize: u(12) }}>{entry.when}</p>
            </div>
          </div>
          <p style={{ marginTop: u(7) }}>{entry.text}</p>
        </div>
      ))}
      <div
        style={{
          marginTop: u(14),
          padding: `${u(8)} ${u(12)}`,
          borderRadius: u(18),
          border: '1px solid #747775',
          color: CHROME,
          fontSize: u(13)
        }}
      >
        Reply or add others with @
      </div>
    </div>
  );
}
