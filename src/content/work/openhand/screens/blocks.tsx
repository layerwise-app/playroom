import type { CSSProperties } from 'react';
import { RoofScene } from './illustration';
import { C, QuoteGlyph, scale, SourceTag, tabular } from './kit';
import {
  BRIEF_TEXT,
  DONATION_AMOUNTS,
  FIRST_DRAFT,
  HEADLINES,
  ORG,
  STORIES,
  type BlockId
} from './model';

/*
 * What each block shows once it's filled. Sizes are the editor's design
 * units; `k` scales the whole block for larger compositions.
 */

type ContentProps = {
  k: number;
  variant: number;
  animate: boolean;
  /** Hero only: the headline while it's being typed. */
  typed?: string | null;
};

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

function HeroContent({ k, variant, animate, typed }: ContentProps) {
  const s = scale(k);
  const typing = typed != null;
  return (
    <div style={{ padding: `${s(7)} ${s(10)}` }}>
      <div style={{ fontSize: s(11), fontWeight: 600, color: C.inkSoft, lineHeight: 1.25 }}>{ORG}</div>
      <div
        key={typing ? FIRST_DRAFT.hero : variant}
        className={animate ? 'oh-in' : undefined}
        style={{
          marginTop: s(2.5),
          fontSize: s(19),
          fontWeight: 760,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: C.ink,
          whiteSpace: 'nowrap'
        }}
      >
        {typing ? typed : HEADLINES[variant]}
        {typing ? (
          <span
            className='oh-caret'
            aria-hidden
            style={{
              display: 'inline-block',
              width: s(1.6),
              height: s(17),
              marginLeft: s(1.5),
              verticalAlign: '-0.12em',
              background: C.ember
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function GoalContent({ k, variant, animate }: ContentProps) {
  const s = scale(k);
  const amount = (
    <span style={{ fontSize: s(20), fontWeight: 760, letterSpacing: '-0.02em', lineHeight: 1.12, ...tabular }}>
      $18,000
    </span>
  );
  const tag = (
    <div className={animate ? 'oh-pop' : undefined} style={{ ...delay(260), marginTop: s(variant === 0 ? 7 : 5) }}>
      <SourceTag k={k}>From your brief</SourceTag>
    </div>
  );
  if (variant === 1) {
    return (
      <div key='v1' style={{ padding: `${s(7)} ${s(9)}` }}>
        <div className={animate ? 'oh-in' : undefined}>{amount}</div>
        <div
          className={animate ? 'oh-in' : undefined}
          style={{ ...delay(120), fontSize: s(12), fontWeight: 600, marginTop: s(1), color: C.ink }}
        >
          by Nov 30
        </div>
        {tag}
      </div>
    );
  }
  return (
    <div key='v0' style={{ padding: `${s(7)} ${s(9)}` }}>
      <div className={animate ? 'oh-in' : undefined} style={{ display: 'flex', alignItems: 'baseline', gap: s(4) }}>
        {amount}
        <span style={{ fontSize: s(11), fontWeight: 600, color: C.inkSoft }}>goal</span>
      </div>
      <div
        className={animate ? 'oh-fade' : undefined}
        style={{ ...delay(120), marginTop: s(6), height: s(5), borderRadius: s(3), background: C.rule }}
      />
      {tag}
    </div>
  );
}

function Words({ text, animate, start }: { text: string; animate: boolean; start: number }) {
  if (!animate) return <>{text}</>;
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className='oh-fade' style={delay(start + i * 34)}>
          {word}{' '}
        </span>
      ))}
    </>
  );
}

function StoryContent({ k, variant, animate }: ContentProps) {
  const s = scale(k);
  const story = STORIES[variant] ?? STORIES[0];
  if (story.kind === 'quote') {
    return (
      <div key={variant} style={{ padding: `${s(8)} ${s(10)}`, display: 'flex', gap: s(8) }}>
        <span
          className={animate ? 'oh-fade' : undefined}
          style={{ width: s(2.5), borderRadius: s(2), background: C.vermilion, flexShrink: 0 }}
        />
        <div>
          <p
            className={animate ? 'oh-in' : undefined}
            style={{ fontSize: s(14), fontWeight: 650, lineHeight: 1.3, letterSpacing: '-0.01em', color: C.ink, textWrap: 'balance' }}
          >
            “{BRIEF_TEXT}”
          </p>
          <div className={animate ? 'oh-pop' : undefined} style={{ ...delay(240), marginTop: s(6) }}>
            <SourceTag k={k}>Quoted from your brief</SourceTag>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div key={variant} style={{ padding: `${s(7)} ${s(10)}` }}>
      <div
        className={animate ? 'oh-in' : undefined}
        style={{ fontSize: s(13), fontWeight: 720, lineHeight: 1.25, letterSpacing: '-0.01em', color: C.ink }}
      >
        {story.heading}
      </div>
      <p style={{ marginTop: s(2), fontSize: s(12), lineHeight: 15.5 / 12, color: C.ink }}>
        <Words text={story.body} animate={animate} start={160} />
      </p>
    </div>
  );
}

function PhotoContent({ k, variant, animate }: ContentProps) {
  const s = scale(k);
  return (
    <>
      <div className='absolute inset-0 overflow-hidden' style={{ borderRadius: s(7) }}>
        <RoofScene key={variant} variant={variant} animate={animate} />
      </div>
      <span
        className={animate ? 'absolute oh-fade' : 'absolute'}
        style={{
          ...delay(420),
          right: s(6),
          top: s(6),
          padding: `${s(3.5)} ${s(6)}`,
          borderRadius: s(4),
          background: 'rgba(255,255,255,.94)',
          fontSize: s(11),
          fontWeight: 600,
          lineHeight: 1,
          color: C.ink
        }}
      >
        Add your photo
      </span>
    </>
  );
}

export function SettingsNote({ k = 1 }: { k?: number }) {
  const s = scale(k);
  return (
    <div
      className='flex items-center'
      style={{ gap: s(3.5), fontSize: s(11), fontWeight: 600, color: C.inkSoft, lineHeight: 1.25, whiteSpace: 'nowrap' }}
    >
      <QuoteGlyph size={s(8)} />
      From your settings
    </div>
  );
}

function DonateContent({ k, variant, animate }: ContentProps) {
  const s = scale(k);
  if (variant === 1) {
    return (
      <div key='v1' style={{ padding: `${s(6)} ${s(9)}` }}>
        {DONATION_AMOUNTS.map((amount, i) => (
          <div
            key={amount}
            className={animate ? 'oh-in' : undefined}
            style={{
              ...delay(i * 90),
              height: s(16),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${C.rule}`,
              fontSize: s(12),
              fontWeight: 650
            }}
          >
            <span style={tabular}>Give {amount}</span>
            <span style={{ color: C.ember }}>→</span>
          </div>
        ))}
        <div className={animate ? 'oh-fade' : undefined} style={{ ...delay(320), marginTop: s(6) }}>
          <SettingsNote k={k} />
        </div>
      </div>
    );
  }
  return (
    <div key='v0' style={{ padding: `${s(7)} ${s(9)}` }}>
      <div className='flex' style={{ gap: s(4) }}>
        {DONATION_AMOUNTS.map((amount, i) => (
          <span
            key={amount}
            className={animate ? 'oh-pop' : undefined}
            style={{
              ...delay(i * 80),
              flex: 1,
              height: s(20),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: s(5),
              fontSize: s(12),
              fontWeight: 700,
              ...tabular,
              background: i === 1 ? C.peach : C.white,
              boxShadow: `inset 0 0 0 ${i === 1 ? s(1.5) : '1px'} ${i === 1 ? C.ember : C.rule}`
            }}
          >
            {amount}
          </span>
        ))}
      </div>
      <div
        className={animate ? 'oh-in' : undefined}
        style={{
          ...delay(280),
          marginTop: s(5),
          height: s(22),
          borderRadius: s(5),
          background: C.ember,
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s(12),
          fontWeight: 700
        }}
      >
        Donate
      </div>
      <div className={animate ? 'oh-fade' : undefined} style={{ ...delay(380), marginTop: s(5) }}>
        <SettingsNote k={k} />
      </div>
    </div>
  );
}

export function BlockContent({ id, ...props }: ContentProps & { id: BlockId }) {
  switch (id) {
    case 'hero':
      return <HeroContent {...props} />;
    case 'goal':
      return <GoalContent {...props} />;
    case 'story':
      return <StoryContent {...props} />;
    case 'photo':
      return <PhotoContent {...props} />;
    case 'donate':
      return <DonateContent {...props} />;
  }
}

/** One line describing a block's current draft, for the review panel. */
export function summaryOf(id: BlockId, variant: number) {
  switch (id) {
    case 'hero':
      return HEADLINES[variant];
    case 'goal':
      return variant === 1 ? '$18,000 by Nov 30' : '$18,000 goal, progress bar';
    case 'story':
      return STORIES[variant].kind === 'quote' ? 'Pull quote from your brief' : STORIES[variant].heading;
    case 'photo':
      return ['Roofline illustration', 'Tool wall illustration', 'Repair illustration'][variant];
    case 'donate':
      return variant === 1 ? 'List: $25, $60, $120' : 'Buttons: $25, $60, $120';
  }
}
