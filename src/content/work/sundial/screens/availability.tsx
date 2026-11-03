import type { ReactNode } from 'react';
import { u } from '~/components/stage';
import { palette } from '../theme';
import { AppBar, Avatar, Button, Eyebrow, Screen } from './chrome';

/*
 * Rosa Ortega's availability, painted on a half-hour grid instead of living
 * in an email thread. Tue and Thu afternoons, never Fridays from October.
 */

const ROWS = ['2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00'];
const COLS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Paint = 'yes' | 'prefer' | 'no' | null;

function paintAt(col: number, row: number): Paint {
  if (col === 4) return 'no';
  if (col === 1 && row >= 2 && row <= 8) return 'yes';
  if (col === 3 && row >= 2 && row <= 12) return row >= 5 && row <= 8 ? 'prefer' : 'yes';
  return null;
}

const TEACHERS: [string, string, string, string, boolean][] = [
  ['RO', 'Rosa Ortega', 'Ceramics · 3 classes', '#7A3517', true],
  ['DH', 'Dana Hale', 'Ceramics · 6 classes', '#7A3517', true],
  ['JK', 'Jun Kim', 'Dance · 5 classes', '#3E3375', true],
  ['TA', 'Tola Adeyemi', 'Dance · 5 classes', '#2F5321', true],
  ['AM', 'Ama Mensah', 'Drawing · 7 classes', '#6A5512', true],
  ['LB', 'Lena Brandt', 'Choir · 4 classes', '#1C4E68', true],
  ['SN', 'Sam Novak', 'Music · 5 classes', '#1C4E68', false],
  ['MR', 'Marisol Reyes', 'Dance · 3 classes', '#2F5321', true],
  ['PD', 'Pat Doyle', 'Comics · 2 classes', '#6A5512', false],
  ['PR', 'Priya Raman', 'Painting · 4 classes', '#6A5512', true],
  ['BO', 'Ben Osei', 'Guitar · 3 classes', '#1C4E68', false],
  ['CW', 'Clara Weiss', 'Printmaking · 2 classes', '#6A5512', true]
];

export function AvailabilityScreen() {
  const colW = 104;
  const rowH = 36;
  const gutter = 54;
  const headH = 32;
  const kiln = palette.rooms.kiln;
  const cellX = (c: number) => gutter + c * colW;
  const cellY = (r: number) => headH + r * rowH;
  return (
    <Screen className='flex flex-col'>
      <AppBar tab='Teachers' />
      <div className='flex min-h-0 flex-1'>
        {/* Teacher list */}
        <aside className='flex shrink-0 flex-col' style={{ width: u(268), borderRight: `1px solid ${palette.rule}`, background: '#FAFBFE' }}>
          <div style={{ padding: `${u(16)} ${u(16)} ${u(10)}` }}>
            <div
              className='flex items-center'
              style={{ height: u(34), paddingInline: u(11), gap: u(8), borderRadius: u(8), border: `1px solid ${palette.rule}`, background: '#fff', fontSize: u(13.5), color: palette.inkSoft }}
            >
              <svg viewBox='0 0 14 14' aria-hidden style={{ width: u(13), height: u(13) }}>
                <circle cx='6' cy='6' r='4.3' fill='none' stroke={palette.inkSoft} strokeWidth='1.5' />
                <path d='M9.2 9.2 L12.5 12.5' stroke={palette.inkSoft} strokeWidth='1.5' strokeLinecap='round' />
              </svg>
              Search 60 teachers
            </div>
            <p className='tabular' style={{ fontSize: u(12.5), color: '#8A4B12', marginTop: u(10), fontWeight: 500 }}>
              3 haven’t painted availability yet
            </p>
          </div>
          <ul className='flex-1 overflow-hidden'>
            {TEACHERS.map(([initials, name, meta, ink, done], i) => (
              <li
                key={name}
                className='flex items-center'
                style={{
                  gap: u(10),
                  height: u(48),
                  paddingInline: u(16),
                  background: i === 0 ? palette.ice : undefined,
                  boxShadow: i === 0 ? `inset ${u(3)} 0 0 ${palette.cobalt}` : undefined
                }}
              >
                <Avatar initials={initials} color={ink} fill='#fff' size={30} />
                <div className='min-w-0'>
                  <p style={{ fontSize: u(14), fontWeight: 600 }}>{name}</p>
                  <p style={{ fontSize: u(12.5), color: palette.inkSoft }}>{meta}</p>
                </div>
                {!done ? (
                  <span className='ml-auto' style={{ fontSize: u(11.5), fontWeight: 600, color: '#8A4B12', background: '#FBEBD2', padding: `${u(2)} ${u(6)}`, borderRadius: u(4) }}>
                    Missing
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </aside>

        {/* Painter */}
        <main className='flex min-w-0 flex-1 flex-col' style={{ padding: `${u(20)} ${u(26)}` }}>
          <div className='flex items-center' style={{ gap: u(14) }}>
            <Avatar initials='RO' color={kiln.ink} fill={kiln.fill} size={52} />
            <div>
              <h2 style={{ fontSize: u(26), fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.1 }}>Rosa Ortega</h2>
              <p style={{ fontSize: u(14), color: palette.inkSoft, marginTop: u(3) }}>Ceramics · Kiln room · at Fernwood since 2018</p>
            </div>
            <div className='ml-auto'>
              <Button small>Send Rosa her link</Button>
            </div>
          </div>
          <div className='flex' style={{ gap: u(22), marginTop: u(18), borderBottom: `1px solid ${palette.rule}`, fontSize: u(14) }}>
            {['Availability', 'Classes · 3', 'Notes'].map((t, i) => (
              <span
                key={t}
                style={{
                  paddingBottom: u(10),
                  fontWeight: i === 0 ? 600 : 500,
                  color: i === 0 ? palette.ink : palette.inkSoft,
                  boxShadow: i === 0 ? `inset 0 ${u(-2.5)} 0 ${palette.cobalt}` : undefined
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div className='flex items-center' style={{ gap: u(14), marginTop: u(16) }}>
            <div className='flex' style={{ padding: u(3), gap: u(2), borderRadius: u(9), background: '#F1F3F9' }}>
              <Brush active swatch={<span style={{ width: u(12), height: u(12), borderRadius: u(3), background: palette.cobalt }} />}>
                Available
              </Brush>
              <Brush swatch={<span style={{ width: u(12), height: u(12), borderRadius: u(3), background: palette.cobaltDeep, boxShadow: `inset 0 0 0 ${u(2)} #7F95EC` }} />}>
                Prefers
              </Brush>
              <Brush swatch={<Hatch size={12} />}>Can’t</Brush>
              <Brush swatch={<span style={{ width: u(12), height: u(12), borderRadius: u(3), border: `1.5px solid #B9C1D6` }} />}>Erase</Brush>
            </div>
            <p style={{ fontSize: u(13.5), color: palette.inkSoft }}>Drag across the grid to paint. Sundial won’t book Rosa outside it.</p>
          </div>

          <div className='relative' style={{ marginTop: u(16), width: u(gutter + colW * COLS.length), height: u(headH + rowH * ROWS.length) }}>
            {COLS.map((c, i) => (
              <span key={c} className='absolute' style={{ left: u(cellX(i) + 10), top: u(6), fontSize: u(14), fontWeight: 600, color: i === 4 ? '#B42A1B' : palette.ink }}>
                {c}
              </span>
            ))}
            {ROWS.map((r, i) =>
              i % 2 === 0 ? (
                <span key={r} className='absolute tabular' style={{ left: 0, width: u(gutter - 10), top: u(cellY(i) - 7), textAlign: 'right', fontSize: u(12.5), color: palette.inkSoft }}>
                  {r}
                </span>
              ) : null
            )}
            {COLS.map((_, c) =>
              ROWS.map((_row, r) => {
                const p = paintAt(c, r);
                const above = r > 0 ? paintAt(c, r - 1) : null;
                const below = r < ROWS.length - 1 ? paintAt(c, r + 1) : null;
                const fill = p === 'yes' ? palette.cobalt : p === 'prefer' ? palette.cobaltDeep : p === 'no' ? undefined : '#F1F3F9';
                return (
                  <div
                    key={`${c}-${r}`}
                    className='absolute'
                    style={{
                      left: u(cellX(c) + 2),
                      top: u(cellY(r) + (p && above === p ? 0 : p ? 2 : 1)),
                      width: u(colW - 4),
                      height: u(rowH - (p && above === p ? 0 : p ? 2 : 1) - (p && below === p ? 0 : p ? 2 : 1)),
                      background: fill,
                      backgroundImage:
                        p === 'no'
                          ? `repeating-linear-gradient(135deg, #F7D6D1 0 ${u(4)}, #FDF1EF ${u(4)} ${u(9)})`
                          : undefined,
                      borderTopLeftRadius: p && above === p ? 0 : u(p ? 6 : 3),
                      borderTopRightRadius: p && above === p ? 0 : u(p ? 6 : 3),
                      borderBottomLeftRadius: p && below === p ? 0 : u(p ? 6 : 3),
                      borderBottomRightRadius: p && below === p ? 0 : u(p ? 6 : 3)
                    }}
                  />
                );
              })
            )}
            {/* Fridays: the reason, in her words */}
            <div
              className='absolute flex flex-col items-center justify-center text-center'
              style={{ left: u(cellX(4) + 8), top: u(cellY(4)), width: u(colW - 16), height: u(rowH * 4), color: '#9C2618' }}
            >
              <p style={{ fontSize: u(13.5), fontWeight: 600, background: '#FDF1EF', padding: `${u(4)} ${u(6)}`, borderRadius: u(5), lineHeight: 1.3 }}>
                Not Fridays from Oct 1
              </p>
            </div>
            {/* Her classes this term, drawn over the paint */}
            {[
              ['Hand Building', '3:30', 3],
              ['Wheel Throwing', '4:30', 5],
              ['Throwing Lab', '7:30', 11]
            ].map(([name, time, row]) => (
              <div
                key={name as string}
                className='absolute flex items-center'
                style={{
                  left: u(cellX(3) + 6),
                  top: u(cellY(row as number) + 5),
                  width: u(colW - 12),
                  height: u(rowH * 2 - 10),
                  borderRadius: u(6),
                  background: kiln.fill,
                  color: kiln.ink,
                  padding: `0 ${u(7)}`,
                  boxShadow: `0 ${u(2)} ${u(6)} rgba(8,18,70,.3)`
                }}
              >
                <div className='min-w-0'>
                  <p style={{ fontSize: u(13), fontWeight: 600, lineHeight: 1.15 }}>{name}</p>
                  <p className='tabular' style={{ fontSize: u(12), lineHeight: 1.2 }}>
                    {time}
                  </p>
                </div>
              </div>
            ))}
            {/* A stroke in progress: extending Tuesday to 7:00 */}
            <div
              className='absolute'
              style={{
                left: u(cellX(1) + 2),
                top: u(cellY(9)),
                width: u(colW - 4),
                height: u(rowH * 2 - 2),
                background: 'rgba(36,72,216,.55)',
                borderBottomLeftRadius: u(6),
                borderBottomRightRadius: u(6),
                outline: `${u(2)} dashed ${palette.cobalt}`,
                outlineOffset: u(2)
              }}
            />
            <div
              className='absolute tabular'
              style={{
                left: u(cellX(1) + colW - 6),
                top: u(cellY(10) + 18),
                fontSize: u(12.5),
                fontWeight: 600,
                color: '#fff',
                background: palette.ink,
                padding: `${u(5)} ${u(8)}`,
                borderRadius: u(6),
                whiteSpace: 'nowrap',
                zIndex: 3
              }}
            >
              Tue 6:30–7:30 · Available
            </div>
            <svg
              aria-hidden
              viewBox='0 0 14 20'
              className='absolute'
              style={{ left: u(cellX(1) + colW - 26), top: u(cellY(10) + 6), width: u(16), height: u(22), overflow: 'visible', zIndex: 4 }}
            >
              <path d='M1 1 L1 16.2 L4.9 12.6 L7.6 18.6 L10.3 17.4 L7.7 11.6 L13 11.3 Z' fill={palette.ink} stroke='#fff' strokeWidth='1.3' strokeLinejoin='round' />
            </svg>
          </div>
        </main>

        {/* Source and summary */}
        <aside className='flex shrink-0 flex-col' style={{ width: u(316), padding: `${u(22)} ${u(20)}`, gap: u(22), borderLeft: `1px solid ${palette.rule}` }}>
          <div>
            <Eyebrow>Where this came from</Eyebrow>
            <div style={{ marginTop: u(10), padding: `${u(14)} ${u(16)}`, borderRadius: u(10), background: '#FAFBFE', border: `1px solid ${palette.rule}` }}>
              <p style={{ fontSize: u(12.5), color: palette.inkSoft }}>Rosa’s email · Jun 3</p>
              <p style={{ fontSize: u(14.5), lineHeight: 1.5, marginTop: u(6) }}>
                “Tuesdays and Thursdays are best, any time after 3. I can’t do Fridays from October, I’m running firings
                at my own studio. Thursday evenings are fine if the kiln is free.”
              </p>
            </div>
            <p style={{ fontSize: u(12.5), color: palette.inkSoft, marginTop: u(8) }}>Painted by Ines Alvarez on a call, Jun 4</p>
          </div>
          <div>
            <Eyebrow>This term</Eyebrow>
            <div className='tabular' style={{ marginTop: u(10), fontSize: u(14), lineHeight: 1.5 }}>
              <SummaryRow label='Available' value='Tue, Thu · 9 hrs' />
              <SummaryRow label='Prefers' value='Thu 4:30–6:30' />
              <SummaryRow label='Teaching' value='3 classes · 3 hrs' />
            </div>
          </div>
          <div>
            <Eyebrow>How the solver uses it</Eyebrow>
            <ul style={{ marginTop: u(10), fontSize: u(13.5), lineHeight: 1.45 }}>
              {[
                'Never books Rosa outside painted hours.',
                'Tries her preferred hours first.',
                'You can still override it, with a warning.'
              ].map((rule) => (
                <li key={rule} className='flex' style={{ gap: u(8), paddingBlock: u(3) }}>
                  <span style={{ width: u(5), height: u(5), borderRadius: '50%', background: palette.cobalt, marginTop: u(8), flexShrink: 0 }} />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Screen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex justify-between' style={{ paddingBlock: u(7), borderTop: `1px solid ${palette.rule}` }}>
      <span style={{ color: palette.inkSoft }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Hatch({ size }: { size: number }) {
  return (
    <span
      style={{
        width: u(size),
        height: u(size),
        borderRadius: u(3),
        backgroundImage: `repeating-linear-gradient(135deg, #E9A79D 0 ${u(2)}, #FDF1EF ${u(2)} ${u(4)})`,
        boxShadow: 'inset 0 0 0 1px #E9A79D'
      }}
    />
  );
}

function Brush({ children, swatch, active }: { children: ReactNode; swatch: ReactNode; active?: boolean }) {
  return (
    <span
      className='inline-flex items-center'
      style={{
        gap: u(7),
        padding: `${u(6)} ${u(12)}`,
        borderRadius: u(7),
        fontSize: u(13.5),
        fontWeight: 600,
        background: active ? '#fff' : undefined,
        boxShadow: active ? '0 1px 2px rgba(18,26,51,.14)' : undefined,
        color: active ? palette.ink : palette.inkSoft
      }}
    >
      {swatch}
      {children}
    </span>
  );
}
