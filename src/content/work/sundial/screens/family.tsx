import { u } from '~/components/stage';
import { fontFamily, palette } from '../theme';
import { tint } from './chrome';

/*
 * What a family sees. Before an enrolled class moves, Sundial asks the
 * families in it, in plain words, and waits for their answers.
 */

const WEEK = [
  { day: 'Mon', date: '14', name: 'Kids Clay', time: '4:30–5:30 pm', who: 'Maya', room: 'kiln', roomName: 'Kiln room', teacher: 'Dana Hale' },
  { day: 'Tue', date: '15', name: 'Hip-Hop I', time: '3:30–4:30 pm', who: 'Maya', room: 'studioB', roomName: 'Studio B', teacher: 'Jun Kim' },
  { day: 'Wed', date: '16', name: 'Guitar Lab', time: '5:30–6:30 pm', who: 'Leo', room: 'music', roomName: 'Music room', teacher: 'Sam Novak', asked: true }
];

/** The family schedule inside a phone screen, about 412 × 840. */
export function FamilyScreen() {
  return (
    <div className='flex h-full flex-col' style={{ fontFamily, color: palette.ink, background: '#F5F6FA' }}>
      <div className='flex items-center justify-between' style={{ padding: `${u(10)} ${u(22)} ${u(6)}` }}>
        <span style={{ fontSize: u(15), fontWeight: 600, letterSpacing: '0.01em' }}>
          Fernwood <span style={{ fontWeight: 400, color: palette.inkSoft }}>School of the Arts</span>
        </span>
        <span className='tabular' style={{ fontSize: u(14), color: palette.inkSoft }}>
          Fall 2024
        </span>
      </div>
      <div style={{ padding: `${u(12)} ${u(22)} 0` }}>
        <h3 style={{ fontSize: u(30), fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.1 }}>Hi, Kenji</h3>
        <p className='tabular' style={{ fontSize: u(17), color: palette.inkSoft, marginTop: u(4) }}>
          Maya and Leo’s week, Oct 14–18
        </p>
      </div>

      <div
        style={{
          margin: `${u(18)} ${u(14)} 0`,
          padding: `${u(18)} ${u(18)} ${u(16)}`,
          borderRadius: u(18),
          background: '#fff',
          boxShadow: `0 0 0 ${u(2)} ${palette.cobalt}, 0 ${u(12)} ${u(26)} ${u(-14)} rgba(22,48,143,.45)`
        }}
      >
        <p style={{ fontSize: u(13.5), fontWeight: 600, color: palette.cobalt }}>We’re asking first · please answer by Oct 18</p>
        <p style={{ fontSize: u(25), fontWeight: 600, lineHeight: 1.15, marginTop: u(6), letterSpacing: '-0.01em' }}>
          Can Guitar Lab move to 6:00?
        </p>
        <p className='tabular' style={{ fontSize: u(16.5), lineHeight: 1.45, marginTop: u(8) }}>
          From Wednesday, Oct 23, Leo’s class would run 6:00–7:00 pm instead of 5:30–6:30. Same teacher, same room.
        </p>
        <div className='flex flex-col' style={{ gap: u(8), marginTop: u(14) }}>
          <span
            className='flex items-center justify-center'
            style={{ height: u(50), borderRadius: u(12), background: palette.cobalt, color: '#fff', fontSize: u(17), fontWeight: 600 }}
          >
            Yes, 6:00 works for Leo
          </span>
          <span
            className='flex items-center justify-center'
            style={{ height: u(50), borderRadius: u(12), border: `1.5px solid ${palette.rule}`, fontSize: u(17), fontWeight: 600 }}
          >
            No, that doesn’t work
          </span>
        </div>
        <p className='tabular' style={{ fontSize: u(14), color: palette.inkSoft, marginTop: u(10), textAlign: 'center' }}>
          Nothing changes unless the families say yes.
        </p>
      </div>

      <p style={{ fontSize: u(13.5), fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: palette.inkSoft, margin: `${u(22)} ${u(22)} ${u(8)}` }}>
        This week
      </p>
      <div className='flex flex-col' style={{ gap: u(8), paddingInline: u(14) }}>
        {WEEK.map((c) => {
          const t = tint(c.room);
          return (
            <div key={c.name} className='flex items-stretch' style={{ borderRadius: u(14), background: '#fff', overflow: 'hidden' }}>
              <div
                className='flex shrink-0 flex-col items-center justify-center tabular'
                style={{ width: u(62), background: t.fill, color: t.ink }}
              >
                <span style={{ fontSize: u(13.5), fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.day}</span>
                <span style={{ fontSize: u(22), fontWeight: 600, lineHeight: 1.1 }}>{c.date}</span>
              </div>
              <div className='min-w-0 flex-1' style={{ padding: `${u(11)} ${u(14)}` }}>
                <div className='flex items-center justify-between' style={{ gap: u(8) }}>
                  <p style={{ fontSize: u(18), fontWeight: 600 }}>{c.name}</p>
                  {c.asked ? (
                    <span style={{ fontSize: u(12.5), fontWeight: 600, color: palette.cobaltDeep, background: palette.ice, padding: `${u(3)} ${u(7)}`, borderRadius: u(5) }}>
                      Question above
                    </span>
                  ) : null}
                </div>
                <p className='tabular' style={{ fontSize: u(15.5), marginTop: u(2) }}>
                  {c.time} · {c.who}
                </p>
                <p style={{ fontSize: u(14.5), color: palette.inkSoft, marginTop: u(1) }}>
                  {c.roomName} · {c.teacher}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <p className='tabular' style={{ fontSize: u(14), color: palette.inkSoft, textAlign: 'center', marginTop: 'auto', padding: `${u(16)} ${u(22)} ${u(30)}` }}>
        Questions? Ines at the front desk, (412) 555-0186
      </p>
    </div>
  );
}

/** The email that brings families to the page. */
export function AskEmail() {
  return (
    <div
      style={{
        width: u(420),
        borderRadius: u(16),
        background: '#fff',
        fontFamily,
        color: palette.ink,
        boxShadow: `0 ${u(24)} ${u(50)} ${u(-20)} rgba(18,26,51,.45), 0 0 0 1px rgba(18,26,51,.06)`,
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: `${u(16)} ${u(20)}`, borderBottom: `1px solid ${palette.rule}` }}>
        <div className='flex items-baseline justify-between'>
          <p style={{ fontSize: u(15), fontWeight: 600 }}>Fernwood School of the Arts</p>
          <p className='tabular' style={{ fontSize: u(13), color: palette.inkSoft }}>
            Mon 9:04 am
          </p>
        </div>
        <p style={{ fontSize: u(16), fontWeight: 600, marginTop: u(4) }}>A quick question about Leo’s Guitar Lab</p>
      </div>
      <div style={{ padding: `${u(14)} ${u(20)} ${u(18)}`, fontSize: u(15), lineHeight: 1.5 }}>
        <p>Hi Kenji, we’d like to move Guitar Lab half an hour later from Oct 23. It only happens if the families in the class agree.</p>
        <p style={{ marginTop: u(10), color: palette.cobalt, fontWeight: 600 }}>Answer in one tap →</p>
      </div>
    </div>
  );
}
