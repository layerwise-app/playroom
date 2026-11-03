import type { CSSProperties, ReactNode } from 'react';
import { fontFamily } from '../theme';
import { RoofScene } from './illustration';
import { C, Check, Mark, QuoteGlyph, scale, SourceTag, StillCursor, tabular, Wordmark } from './kit';
import { BRIEF, DONATION_AMOUNTS, ORG, STORIES } from './model';

/* Openhand screens outside the editor. All in design units, scaled by `k`. */

const fact = (k: number): CSSProperties => ({
  fontWeight: 650,
  textDecorationLine: 'underline',
  textDecorationColor: C.vermilion,
  textDecorationThickness: scale(k)(2),
  textUnderlineOffset: scale(k)(4),
  fontVariantNumeric: 'tabular-nums'
});

function AppNav({ k = 1, active }: { k?: number; active: string }) {
  const s = scale(k);
  return (
    <div
      className='flex shrink-0 items-center'
      style={{ height: s(44), padding: `0 ${s(20)}`, gap: s(22), borderBottom: `1px solid ${C.hairline}`, background: C.white }}
    >
      <Wordmark k={k} size={14} />
      <nav className='flex' style={{ gap: s(16), fontSize: s(12.5), fontWeight: 600 }}>
        {['Pages', 'Donors', 'Payouts', 'Settings'].map((item) => (
          <span key={item} style={{ color: item === active ? C.ink : C.inkSoft }}>
            {item}
          </span>
        ))}
      </nav>
      <span className='flex-1' />
      <span style={{ fontSize: s(12.5), fontWeight: 600, color: C.ink }}>{ORG}</span>
      <span
        className='flex items-center justify-center'
        style={{ width: s(26), height: s(26), borderRadius: '50%', background: C.ink, color: C.white, fontSize: s(11), fontWeight: 700 }}
      >
        DV
      </span>
    </div>
  );
}

/** Step one: the org's sentence, and what the agent found in it. */
export function BriefScreen({ k = 1, width = 760, height = 470 }: { k?: number; width?: number; height?: number }) {
  const s = scale(k);
  const rows: { label: string; value: ReactNode; source?: string; note?: string }[] = [
    { label: 'Goal', value: '$18,000', source: 'From your brief' },
    { label: 'Deadline', value: 'Nov 30', source: 'From your brief' },
    { label: 'Cause', value: 'Building repair' },
    { label: 'Suggested gifts', value: '$25 · $60 · $120', source: 'From your settings' }
  ];
  return (
    <div className='flex flex-col' style={{ width: s(width), height: s(height), background: C.cream, color: C.ink, fontFamily }}>
      <AppNav k={k} active='Pages' />
      <div className='flex flex-1' style={{ padding: `${s(34)} ${s(44)}`, gap: s(30) }}>
        <div className='min-w-0 flex-1'>
          <div style={{ fontSize: s(12), fontWeight: 700, color: C.ember }}>New campaign page</div>
          <h2
            style={{
              marginTop: s(6),
              fontSize: s(27),
              fontWeight: 780,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              textWrap: 'balance'
            }}
          >
            Tell us about your campaign in a sentence.
          </h2>
          <p style={{ marginTop: s(8), fontSize: s(13), lineHeight: 1.45, color: C.inkSoft, maxWidth: s(400) }}>
            Openhand drafts a page from it with your usual blocks. You keep what works. Nothing goes live until you
            publish.
          </p>
          <div
            style={{
              marginTop: s(18),
              padding: `${s(14)} ${s(16)}`,
              borderRadius: s(10),
              background: C.white,
              boxShadow: `0 0 0 ${s(1.5)} ${C.ember}, 0 0 0 ${s(5)} rgba(232,85,47,.16)`
            }}
          >
            <p style={{ fontSize: s(18), lineHeight: 1.4, fontWeight: 500 }}>
              {BRIEF.before}
              <span style={fact(k)}>{BRIEF.amount}</span>
              {BRIEF.middle}
              <span style={fact(k)}>{BRIEF.date}</span>
              {BRIEF.after}
              <span
                aria-hidden
                style={{ display: 'inline-block', width: s(2), height: s(20), marginLeft: s(2), verticalAlign: '-0.18em', background: C.ember }}
              />
            </p>
            <div className='flex items-center justify-between' style={{ marginTop: s(12), fontSize: s(11.5), color: C.inkSoft }}>
              <span>One sentence is plenty. Add a number only if it’s true.</span>
              <span style={tabular}>50 / 280</span>
            </div>
          </div>
          <div className='flex items-center' style={{ marginTop: s(16), gap: s(14) }}>
            <span
              className='inline-flex shrink-0 items-center'
              style={{
                whiteSpace: 'nowrap',
                height: s(36),
                padding: `0 ${s(18)}`,
                borderRadius: s(8),
                background: C.ember,
                color: C.white,
                fontSize: s(13.5),
                fontWeight: 700
              }}
            >
              Draft my page
            </span>
            <span style={{ fontSize: s(12), color: C.inkSoft, textWrap: 'balance' }}>
              About a minute. Move your mouse to stop it.
            </span>
          </div>
        </div>
        <div style={{ width: s(268), flexShrink: 0 }}>
          <div
            style={{
              padding: `${s(14)} ${s(14)} ${s(6)}`,
              borderRadius: s(12),
              background: C.white,
              boxShadow: `0 0 0 1px ${C.hairline}, 0 ${s(10)} ${s(24)} ${s(-14)} rgba(43,26,20,.3)`
            }}
          >
            <div className='flex items-center justify-between'>
              <span style={{ fontSize: s(13), fontWeight: 750 }}>What we found</span>
              <span style={{ fontSize: s(11), fontWeight: 600, color: C.inkSoft }}>Updates as you type</span>
            </div>
            {rows.map((row) => (
              <div key={row.label} style={{ padding: `${s(8)} 0`, borderTop: `1px solid ${C.rule}`, marginTop: s(row.label === 'Goal' ? 9 : 0) }}>
                <div style={{ fontSize: s(11), fontWeight: 650, color: C.inkSoft }}>{row.label}</div>
                <div className='flex items-center justify-between' style={{ marginTop: s(3), gap: s(8) }}>
                  <span style={{ fontSize: s(15.5), fontWeight: 750, letterSpacing: '-0.01em', whiteSpace: 'nowrap', ...tabular }}>{row.value}</span>
                  {row.source ? <SourceTag k={k}>{row.source}</SourceTag> : null}
                </div>
                {row.note ? <div style={{ marginTop: s(2), fontSize: s(11), color: C.inkSoft }}>{row.note}</div> : null}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: s(10),
              padding: `${s(10)} ${s(12)}`,
              borderRadius: s(10),
              background: C.peach,
              fontSize: s(11.5),
              lineHeight: 1.4
            }}
          >
            <b style={{ fontWeight: 700 }}>Impact claims: none.</b> We won’t say what a gift buys unless you tell us.
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ k, value, height = 7 }: { k: number; value: number; height?: number }) {
  const s = scale(k);
  return (
    <div style={{ height: s(height), borderRadius: s(height), background: C.rule, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', borderRadius: s(height), background: C.vermilion }} />
    </div>
  );
}

function Amounts({ k, size = 13, height = 34 }: { k: number; size?: number; height?: number }) {
  const s = scale(k);
  return (
    <div className='flex' style={{ gap: s(6) }}>
      {DONATION_AMOUNTS.map((amount, i) => (
        <span
          key={amount}
          className='flex flex-1 items-center justify-center'
          style={{
            height: s(height),
            borderRadius: s(7),
            fontSize: s(size),
            fontWeight: 700,
            ...tabular,
            background: i === 1 ? C.peach : C.white,
            boxShadow: `inset 0 0 0 ${i === 1 ? s(1.75) : '1px'} ${i === 1 ? C.ember : C.rule}`
          }}
        >
          {amount}
        </span>
      ))}
    </div>
  );
}

const ORG_PARAGRAPH =
  'After every storm our volunteers move the table saws away from the drips. Our roofer can start as soon as we reach the goal.';

/** The published page a donor sees on a laptop. */
export function DonorDesktop({ k = 1, width = 640, height = 560 }: { k?: number; width?: number; height?: number }) {
  const s = scale(k);
  const story = STORIES[0];
  return (
    <div style={{ width: s(width), height: s(height), background: C.white, color: C.ink, fontFamily }} className='flex flex-col'>
      <div
        className='flex shrink-0 items-center'
        style={{ height: s(40), padding: `0 ${s(24)}`, gap: s(10), borderBottom: `1px solid ${C.rule}` }}
      >
        <Mark size={s(18)} />
        <span style={{ fontSize: s(12.5), fontWeight: 700 }}>{ORG}</span>
        <span className='flex-1' />
        <span style={{ fontSize: s(12), fontWeight: 600, color: C.inkSoft }}>Share</span>
      </div>
      <div className='flex flex-1' style={{ padding: `${s(24)} ${s(24)} 0`, gap: s(24) }}>
        <div className='min-w-0 flex-1'>
          <div style={{ fontSize: s(12), fontWeight: 650, color: C.inkSoft }}>{ORG}</div>
          <h2 style={{ marginTop: s(4), fontSize: s(29), fontWeight: 780, lineHeight: 1.08, letterSpacing: '-0.025em' }}>
            Fix the roof before winter
          </h2>
          <div className='overflow-hidden' style={{ marginTop: s(16), height: s(150), borderRadius: s(10) }}>
            <RoofScene variant={0} />
          </div>
          <h3 style={{ marginTop: s(18), fontSize: s(15), fontWeight: 740, letterSpacing: '-0.01em' }}>{story.heading}</h3>
          <p style={{ marginTop: s(5), fontSize: s(13), lineHeight: 1.5 }}>{story.body}</p>
          <p style={{ marginTop: s(8), fontSize: s(13), lineHeight: 1.5 }}>{ORG_PARAGRAPH}</p>
        </div>
        <div style={{ width: s(214), flexShrink: 0 }}>
          <div
            style={{
              padding: s(16),
              borderRadius: s(12),
              background: C.white,
              boxShadow: `0 0 0 1px ${C.rule}, 0 ${s(12)} ${s(28)} ${s(-18)} rgba(43,26,20,.35)`
            }}
          >
            <div style={{ fontSize: s(25), fontWeight: 780, letterSpacing: '-0.02em', ...tabular }}>$7,340</div>
            <div style={{ fontSize: s(12), color: C.inkSoft, ...tabular }}>raised of $18,000</div>
            <div style={{ marginTop: s(10) }}>
              <ProgressBar k={k} value={41} />
            </div>
            <div className='flex justify-between' style={{ marginTop: s(7), fontSize: s(11.5), color: C.inkSoft, ...tabular }}>
              <span>
                <b style={{ color: C.ink, fontWeight: 700 }}>112</b> donors
              </span>
              <span>Ends Nov 30</span>
            </div>
            <div style={{ marginTop: s(14) }}>
              <Amounts k={k} size={13} height={32} />
            </div>
            <div
              className='flex items-center justify-center'
              style={{ marginTop: s(8), height: s(38), borderRadius: s(8), background: C.ember, color: C.white, fontSize: s(14), fontWeight: 700 }}
            >
              Donate $60
            </div>
            <div style={{ marginTop: s(10), fontSize: s(11), color: C.inkSoft, textAlign: 'center' }}>
              Secure giving through Openhand
            </div>
          </div>
          <div style={{ marginTop: s(14), padding: `0 ${s(4)}` }}>
            <div style={{ fontSize: s(11), fontWeight: 700, color: C.inkSoft }}>Recent gifts</div>
            {[
              ['Ana R.', '$60', '2 min ago'],
              ['Marcus T.', '$25', '18 min ago'],
              ['The Okoro family', '$120', '1 hr ago']
            ].map(([name, amount, when]) => (
              <div
                key={name}
                className='flex items-baseline justify-between'
                style={{ padding: `${s(6)} 0`, borderBottom: `1px solid ${C.rule}`, fontSize: s(12) }}
              >
                <span style={{ fontWeight: 600 }}>{name}</span>
                <span style={{ color: C.inkSoft, ...tabular }}>
                  <b style={{ color: C.ink, fontWeight: 700 }}>{amount}</b> · {when}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** The same page on a phone. Fills a `Phone` screen (282 × 558 design units). */
export function DonorMobile({ k = 1 }: { k?: number }) {
  const s = scale(k);
  const story = STORIES[0];
  return (
    <div className='relative flex h-full flex-col' style={{ color: C.ink, fontFamily, background: C.white }}>
      <div className='flex shrink-0 items-center' style={{ height: s(36), padding: `0 ${s(18)}`, gap: s(8) }}>
        <Mark size={s(17)} />
        <span style={{ fontSize: s(12), fontWeight: 700 }}>{ORG}</span>
        <span className='flex-1' />
        <span style={{ fontSize: s(12), fontWeight: 600, color: C.inkSoft }}>Share</span>
      </div>
      <div className='overflow-hidden' style={{ height: s(150), margin: `0 ${s(12)}`, borderRadius: s(12) }}>
        <RoofScene variant={0} />
      </div>
      <div style={{ padding: `${s(14)} ${s(18)} 0` }}>
        <h2 style={{ fontSize: s(24), fontWeight: 780, lineHeight: 1.08, letterSpacing: '-0.025em', textWrap: 'balance' }}>
          Fix the roof before winter
        </h2>
        <div className='flex' style={{ marginTop: s(12), gap: s(6), alignItems: 'baseline', ...tabular }}>
          <span style={{ fontSize: s(20), fontWeight: 780, letterSpacing: '-0.02em' }}>$7,340</span>
          <span style={{ fontSize: s(12), color: C.inkSoft }}>raised of $18,000</span>
        </div>
        <div style={{ marginTop: s(8) }}>
          <ProgressBar k={k} value={41} height={6} />
        </div>
        <div className='flex justify-between' style={{ marginTop: s(6), fontSize: s(11.5), color: C.inkSoft, ...tabular }}>
          <span>
            <b style={{ color: C.ink, fontWeight: 700 }}>112</b> donors
          </span>
          <span>Ends Nov 30</span>
        </div>
        <h3 style={{ marginTop: s(16), fontSize: s(14.5), fontWeight: 740 }}>{story.heading}</h3>
        <p style={{ marginTop: s(4), fontSize: s(13), lineHeight: 1.45 }}>{story.body}</p>
      </div>
      <div
        className='absolute inset-x-0 bottom-0'
        style={{ padding: `${s(12)} ${s(14)} ${s(26)}`, background: C.white, borderTop: `1px solid ${C.rule}` }}
      >
        <Amounts k={k} size={13} height={32} />
        <div
          className='flex items-center justify-center'
          style={{ marginTop: s(8), height: s(40), borderRadius: s(10), background: C.ember, color: C.white, fontSize: s(14.5), fontWeight: 700 }}
        >
          Donate $60
        </div>
      </div>
    </div>
  );
}

/** A different org whose brief had no number: the goal stays empty. */
export function EmptyGoalCard({ k = 1 }: { k?: number }) {
  const s = scale(k);
  return (
    <div
      className='relative'
      style={{
        width: s(470),
        padding: s(22),
        borderRadius: s(16),
        background: C.white,
        color: C.ink,
        fontFamily,
        boxShadow: `0 0 0 1px ${C.hairline}, 0 ${s(24)} ${s(50)} ${s(-24)} rgba(43,26,20,.45)`
      }}
    >
      <div className='flex items-center' style={{ gap: s(8) }}>
        <span
          style={{
            height: s(17),
            padding: `0 ${s(7)}`,
            borderRadius: s(9),
            background: C.ember,
            color: C.white,
            fontSize: s(11),
            fontWeight: 700,
            lineHeight: s(17)
          }}
        >
          Brief
        </span>
        <span style={{ fontSize: s(12.5), fontWeight: 500 }}>
          New goals and pinnies for our spring season, please help!
        </span>
      </div>
      <div style={{ marginTop: s(4), paddingLeft: s(46), fontSize: s(11), color: C.inkSoft, fontWeight: 600 }}>
        Eastside Youth Soccer · no amount, no date
      </div>

      <div style={{ marginTop: s(18), fontSize: s(11), fontWeight: 650, color: C.inkSoft }}>Eastside Youth Soccer</div>
      <div style={{ marginTop: s(2), fontSize: s(20), fontWeight: 780, letterSpacing: '-0.02em' }}>
        New goals for the spring season
      </div>

      <div
        className='relative'
        style={{
          marginTop: s(30),
          padding: s(14),
          borderRadius: s(9),
          background: C.tint,
          outline: `${s(1.5)} dashed ${C.vermilion}`
        }}
      >
        <div
          className='absolute flex items-center'
          style={{
            right: 0,
            bottom: '100%',
            marginBottom: s(5),
            gap: s(4),
            fontSize: s(11),
            fontWeight: 650,
            color: C.ember
          }}
        >
          <span className='flex' style={{ width: s(7), height: s(7), borderRadius: '50%', boxShadow: `inset 0 0 0 ${s(1.8)} ${C.vermilion}` }} />
          Waiting for you
        </div>
        <div className='flex items-center justify-between'>
          <span style={{ fontSize: s(12), fontWeight: 700 }}>Goal</span>
          <span style={{ fontSize: s(11), color: C.inkSoft, fontWeight: 600 }}>Required to publish</span>
        </div>
        <div
          className='flex items-center'
          style={{
            marginTop: s(8),
            height: s(40),
            padding: `0 ${s(12)}`,
            gap: s(8),
            borderRadius: s(8),
            background: C.white,
            boxShadow: `inset 0 0 0 1px ${C.rule}`
          }}
        >
          <span style={{ fontSize: s(16), fontWeight: 700, color: C.inkSoft }}>$</span>
          <span style={{ fontSize: s(15), color: C.inkSoft }}>Add your goal. We won’t guess.</span>
        </div>
        <div className='flex items-center' style={{ marginTop: s(9), gap: s(6), fontSize: s(11.5), color: C.ink }}>
          <QuoteGlyph size={s(9)} />
          Your brief didn’t include an amount, so this field stays empty.
        </div>
      </div>

      <div className='flex' style={{ marginTop: s(14), gap: s(10) }}>
        {[
          ['Deadline', 'Add an end date'],
          ['Suggested gifts', '$20 · $50 · $100']
        ].map(([label, value], i) => (
          <div
            key={label}
            className='flex-1'
            style={{
              padding: `${s(10)} ${s(12)}`,
              borderRadius: s(9),
              background: i === 0 ? C.tint : C.white,
              outline: i === 0 ? `${s(1.5)} dashed ${C.vermilion}` : undefined,
              boxShadow: i === 0 ? undefined : `inset 0 0 0 1px ${C.rule}`
            }}
          >
            <div style={{ fontSize: s(11), fontWeight: 650, color: C.inkSoft }}>{label}</div>
            <div className='flex items-center justify-between' style={{ marginTop: s(3) }}>
              <span style={{ fontSize: s(13.5), fontWeight: i === 0 ? 500 : 700, color: i === 0 ? C.inkSoft : C.ink, ...tabular }}>
                {value}
              </span>
              {i === 1 ? (
                <span className='inline-flex items-center' style={{ gap: s(3), fontSize: s(11), fontWeight: 650, color: C.kept }}>
                  <Check size={s(10)} weight={2.4} />
                  Settings
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <StillCursor k={k} x={318} y={190} label='Left empty for you' />
    </div>
  );
}
