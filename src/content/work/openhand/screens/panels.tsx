import type { ReactNode } from 'react';
import { summaryOf } from './blocks';
import { C, Check, Dot, Mark, QuoteGlyph, scale, tabular } from './kit';
import { BLOCK_NAME, ORDER, VARIANTS, type DraftState } from './model';

/* Panels that dock to the right of the editor. Design units, scaled by `k`. */

function SmallButton({ k, primary, children }: { k: number; primary?: boolean; children: ReactNode }) {
  const s = scale(k);
  return (
    <span
      className='inline-flex items-center'
      style={{
        height: s(20),
        padding: `0 ${s(8)}`,
        borderRadius: s(5),
        fontSize: s(11),
        fontWeight: 650,
        whiteSpace: 'nowrap',
        background: primary ? C.ember : C.white,
        color: primary ? C.white : C.ember,
        boxShadow: primary ? undefined : `inset 0 0 0 1px ${C.rule}`
      }}
    >
      {children}
    </span>
  );
}

export function ReviewPanel({ k = 1, state }: { k?: number; state: DraftState }) {
  const s = scale(k);
  const kept = ORDER.filter((id) => state.blocks[id].status === 'kept').length;
  const rule = [
    ['$18,000', 'your brief'],
    ['Nov 30', 'your brief'],
    ['$25, $60, $120', 'your settings']
  ];
  return (
    <div style={{ padding: `${s(13)} ${s(14)}` }}>
      <div style={{ fontSize: s(13.5), fontWeight: 750, letterSpacing: '-0.01em' }}>Review the draft</div>
      <div style={{ marginTop: s(2), fontSize: s(11.5), color: C.inkSoft }}>
        Nothing goes live until you keep it.
      </div>

      <div style={{ marginTop: s(10), padding: s(10), borderRadius: s(8), background: C.peach }}>
        <div className='flex items-center' style={{ gap: s(6), fontSize: s(12), fontWeight: 720 }}>
          <QuoteGlyph size={s(10)} />
          Numbers come only from you
        </div>
        <div style={{ marginTop: s(6) }}>
          {rule.map(([value, source]) => (
            <div
              key={value}
              className='flex items-center justify-between'
              style={{ height: s(17), fontSize: s(11.5), borderTop: `1px solid rgba(194,63,29,.14)` }}
            >
              <span style={{ fontWeight: 700, ...tabular }}>{value}</span>
              <span style={{ color: C.inkSoft, fontWeight: 600 }}>{source}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: s(5), fontSize: s(11), lineHeight: 1.35, color: C.ink, textWrap: 'balance' }}>
          No impact claims. Missing numbers stay empty.
        </div>
      </div>

      <div
        className='flex items-center justify-between'
        style={{ marginTop: s(11), fontSize: s(11), fontWeight: 700, color: C.inkSoft }}
      >
        <span>5 suggestions</span>
        <span style={tabular}>{kept} kept</span>
      </div>
      <div style={{ marginTop: s(4) }}>
        {ORDER.map((id) => {
          const block = state.blocks[id];
          const isKept = block.status === 'kept';
          return (
            <div key={id} style={{ padding: `${s(6)} 0`, borderTop: `1px solid ${C.rule}` }}>
              <div className='flex items-center' style={{ gap: s(8) }}>
                <span style={{ width: s(40), flexShrink: 0, fontSize: s(11), fontWeight: 650, color: C.inkSoft }}>
                  {BLOCK_NAME[id]}
                </span>
                <span
                  className='min-w-0 flex-1 truncate'
                  style={{ fontSize: s(12), fontWeight: 600, color: C.ink }}
                >
                  {summaryOf(id, block.variant)}
                </span>
                {isKept ? (
                  <span
                    className='inline-flex items-center'
                    style={{ gap: s(3), fontSize: s(11), fontWeight: 650, color: C.kept }}
                  >
                    <Check size={s(10)} weight={2.4} />
                    Kept
                  </span>
                ) : (
                  <Dot size={s(8)} color={C.vermilion} ring />
                )}
              </div>
              {isKept ? null : (
                <div className='flex items-center' style={{ gap: s(4), marginTop: s(5), paddingLeft: s(48) }}>
                  <SmallButton k={k} primary>
                    Keep
                  </SmallButton>
                  <SmallButton k={k}>Try another</SmallButton>
                  <span style={{ marginLeft: 'auto', fontSize: s(11), color: C.inkSoft, ...tabular }}>
                    {block.variant + 1} of {VARIANTS[id]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Entry = {
  time: string;
  who: 'agent' | 'person';
  text: ReactNode;
  detail?: string;
  undo?: boolean;
  quiet?: boolean;
};

const HISTORY: Entry[] = [
  { time: '10:46', who: 'person', text: <><b>Dolores</b> kept <b>Photo</b></> },
  {
    time: '10:45',
    who: 'agent',
    text: <><b>Agent</b> added <b>Donate</b></>,
    detail: '$25, $60, $120 from your settings',
    undo: true
  },
  {
    time: '10:44',
    who: 'agent',
    text: <><b>Agent</b> added <b>Photo</b></>,
    detail: 'Library illustration, roofline',
    undo: true
  },
  { time: '10:44', who: 'person', text: <><b>Dolores</b> kept <b>Story</b> and <b>Goal</b></> },
  {
    time: '10:43',
    who: 'person',
    text: <><b>Dolores</b> tried another headline</>,
    detail: '“Fix the roof before winter”'
  },
  {
    time: '10:43',
    who: 'agent',
    text: <><b>Agent</b> paused</>,
    detail: 'Dolores moved onto the page',
    quiet: true
  },
  { time: '10:42', who: 'agent', text: <><b>Agent</b> added <b>Story</b></>, detail: 'Why the roof can’t wait', undo: true },
  {
    time: '10:42',
    who: 'agent',
    text: <><b>Agent</b> filled <b>Goal</b></>,
    detail: '$18,000 from your brief',
    undo: true
  },
  { time: '10:41', who: 'agent', text: <><b>Agent</b> added <b>Hero</b></>, detail: 'A dry roof for borrowed tools', undo: true }
];

export function HistoryPanel({ k = 1 }: { k?: number }) {
  const s = scale(k);
  return (
    <div className='flex h-full flex-col'>
      <div style={{ padding: `${s(13)} ${s(14)} ${s(10)}`, borderBottom: `1px solid ${C.rule}` }}>
        <div className='flex items-baseline justify-between'>
          <span style={{ fontSize: s(13.5), fontWeight: 750, letterSpacing: '-0.01em' }}>Activity</span>
          <span style={{ fontSize: s(11), fontWeight: 600, color: C.inkSoft }}>Today</span>
        </div>
        <div className='flex' style={{ marginTop: s(8), gap: s(4) }}>
          {['Everything', 'Agent', 'People'].map((label, i) => (
            <span
              key={label}
              style={{
                height: s(20),
                padding: `0 ${s(8)}`,
                borderRadius: s(10),
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: s(11),
                fontWeight: 650,
                background: i === 0 ? C.ink : C.white,
                color: i === 0 ? C.white : C.inkSoft,
                boxShadow: i === 0 ? undefined : `inset 0 0 0 1px ${C.rule}`
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className='relative min-h-0 flex-1 overflow-hidden' style={{ padding: `${s(4)} ${s(14)} 0` }}>
        <span
          aria-hidden
          className='absolute'
          style={{ left: s(14 + 9.5), top: s(14), bottom: 0, width: 1, background: C.rule }}
        />
        {HISTORY.map((entry, i) => (
          <div key={i} className='relative flex' style={{ gap: s(9), padding: `${s(7)} 0` }}>
            <span
              className='relative flex shrink-0 items-center justify-center'
              style={{
                width: s(19),
                height: s(19),
                borderRadius: '50%',
                background: entry.who === 'agent' ? C.white : C.ink,
                boxShadow: entry.who === 'agent' ? `0 0 0 ${s(2)} ${C.white}` : `0 0 0 ${s(2)} ${C.white}`
              }}
            >
              {entry.who === 'agent' ? (
                <Mark size={s(17)} />
              ) : (
                <span style={{ fontSize: s(11), fontWeight: 700, color: C.white, letterSpacing: '-0.02em' }}>D</span>
              )}
            </span>
            <div className='min-w-0 flex-1'>
              <div
                style={{
                  fontSize: s(12),
                  lineHeight: 1.3,
                  color: entry.quiet ? C.inkSoft : C.ink,
                  fontWeight: 450
                }}
                className='[&_b]:font-[650]'
              >
                {entry.text}
              </div>
              {entry.detail ? (
                <div className='truncate' style={{ marginTop: s(1), fontSize: s(11), color: C.inkSoft }}>
                  {entry.detail}
                </div>
              ) : null}
            </div>
            <div className='flex shrink-0 flex-col items-end' style={{ gap: s(4) }}>
              <span style={{ fontSize: s(11), color: C.inkSoft, ...tabular }}>{entry.time}</span>
              {entry.undo ? (
                <span
                  style={{
                    fontSize: s(11),
                    fontWeight: 650,
                    color: C.ember,
                    textDecorationLine: 'underline',
                    textUnderlineOffset: s(2),
                    textDecorationThickness: 1
                  }}
                >
                  Undo
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
