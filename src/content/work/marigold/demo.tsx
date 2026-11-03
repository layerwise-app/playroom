import { useReducer, useRef } from 'react';
import { DemoCursor, useDirector } from '~/components/demo/director';
import { Phone } from '~/components/frames';
import { Stage, u } from '~/components/stage';
import type { DemoProps } from '~/content/types';
import { cn } from '~/lib/utils';
import { CheckGlyph, DayRing, MarigoldMark, MarigoldStyles, ResetGlyph } from './parts';
import type { SlotId } from './parts';
import { HomeScreen, homeStates } from './screens';
import type { HomePhase } from './screens';
import { fontFamily, palette } from './theme';

type State = {
  phase: HomePhase;
  selected: SlotId | null;
  peek: SlotId;
  time: string;
  /** Replays the soft arrival pulse. */
  arrival: number;
  /** Counts changes after the first render, so updates animate but the server render doesn't. */
  seq: number;
};

type Action =
  | { type: 'reset' }
  | { type: 'take' }
  | { type: 'notYet' }
  | { type: 'select'; slot: SlotId }
  | { type: 'back' };

const FINISHED: State = {
  phase: 'done',
  selected: null,
  peek: 'midday',
  time: '8:04',
  arrival: 0,
  seq: 0
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'reset':
      return {
        ...state,
        phase: 'ask',
        selected: null,
        time: '8:00',
        arrival: state.arrival + 1,
        seq: state.seq + 1
      };
    case 'take':
      return { ...state, phase: 'done', selected: null, time: '8:04', seq: state.seq + 1 };
    case 'notYet':
      return { ...state, phase: 'later', selected: null, time: '8:01', seq: state.seq + 1 };
    case 'select': {
      // The morning slot is "now" until it's answered, so tapping it just shows the question.
      const isNow = action.slot === 'morning' && state.phase !== 'done';
      const selected = isNow || state.selected === action.slot ? null : action.slot;
      return { ...state, selected, peek: selected ?? state.peek };
    }
    case 'back':
      return { ...state, selected: null };
  }
}

const caregiverCopy: Record<HomePhase, { line: string; when: string; foot: string }> = {
  ask: {
    line: 'Ada was asked about her morning pills',
    when: '8:00 am',
    foot: 'We text you only if she needs a hand.'
  },
  later: {
    line: 'Ada said not yet. Marigold checks in again at 8:30.',
    when: '8:01 am',
    foot: 'Nothing for you to do.'
  },
  done: {
    line: 'Ada took her morning pills',
    when: '8:04 am',
    foot: 'Nothing for you to do.'
  }
};

export default function MarigoldDemo(_props: DemoProps) {
  const [state, dispatch] = useReducer(reducer, FINISHED);
  const cardRef = useRef<HTMLDivElement>(null);

  // Keep keyboard focus inside the card when its layer changes.
  const act = (action: Action) => {
    const card = cardRef.current;
    const hadFocus = !!card && card.contains(document.activeElement);
    dispatch(action);
    if (hadFocus) {
      requestAnimationFrame(() => {
        const layer = card?.querySelector<HTMLElement>('[data-active]');
        const target = layer?.querySelector<HTMLElement>('button') ?? layer;
        target?.focus({ preventScroll: true });
      });
    }
  };

  const d = useDirector(async (x) => {
    await x.wait(2000);
    dispatch({ type: 'reset' });
    await x.wait(2600);
    await x.appear('took', { offset: [70, 90] });
    await x.move('took', { duration: 900, anchor: [0.62, 0.55] });
    await x.wait(350);
    await x.press();
    dispatch({ type: 'take' });
    await x.wait(1900);
    await x.move('ring-midday', { duration: 900, anchor: [0.4, 0.42] });
    await x.wait(250);
    await x.press();
    dispatch({ type: 'select', slot: 'midday' });
    await x.wait(2300);
    await x.move('back', { duration: 800, anchor: [0.6, 0.5] });
    await x.wait(250);
    await x.press();
    dispatch({ type: 'back' });
    await x.wait(500);
    x.hide();
    await x.wait(2200);
  });

  const copy = caregiverCopy[state.phase];
  const states = homeStates(state.phase);

  return (
    <Stage width={520} height={416} innerRef={d.rootRef} style={{ fontFamily, color: palette.ink }}>
      <MarigoldStyles />

      <Phone
        width={276}
        height={600}
        time={state.time}
        screen={palette.cream}
        className='absolute'
        style={{ left: u(24), top: u(14) }}
      >
        <HomeScreen
          phase={state.phase}
          selected={state.selected}
          peek={state.peek}
          arrival={state.arrival}
          live
          onTake={() => act({ type: 'take' })}
          onNotYet={() => act({ type: 'notYet' })}
          onSelect={(slot) => act({ type: 'select', slot })}
          onBack={() => act({ type: 'back' })}
          cardRef={cardRef}
        />
      </Phone>

      <div className='absolute' style={{ left: u(318), top: u(117), width: u(178) }}>
        <p className='flex items-center' style={{ gap: u(6), fontSize: u(12), fontWeight: 700, lineHeight: 1, paddingLeft: u(2) }}>
          What Daniel, her son, sees
        </p>
        <section
          aria-label="Daniel's view"
          style={{
            marginTop: u(10),
            padding: `${u(14)} ${u(14)} ${u(13)}`,
            borderRadius: u(20),
            background: palette.white,
            boxShadow: `0 ${u(14)} ${u(30)} ${u(-16)} rgba(60,30,0,.45), 0 ${u(1)} ${u(3)} rgba(60,30,0,.12)`
          }}
        >
          <div className='flex items-center' style={{ gap: u(10) }}>
            <DayRing size={40} thickness={6} states={states} />
            <div style={{ lineHeight: 1.15 }}>
              <p style={{ fontSize: u(15), fontWeight: 700 }}>Ada today</p>
              <p className='tabular' style={{ fontSize: u(12), color: palette.inkSoft, marginTop: u(2) }}>
                {state.phase === 'done' ? 1 : 0} of 4 done
              </p>
            </div>
            <MarigoldMark size={16} className='ml-auto self-start' />
          </div>
          <div
            aria-live='polite'
            style={{ marginTop: u(12), paddingTop: u(8), borderTop: `1px solid ${palette.rule}`, minHeight: u(66) }}
          >
            <div
              key={`${state.phase}-${state.seq}`}
              className={cn(state.seq > 0 && 'mg-arrive')}
              style={{
                margin: `0 ${u(-6)}`,
                padding: `${u(5)} ${u(6)}`,
                borderRadius: u(10),
                animationDelay: state.phase === 'done' ? '700ms' : '300ms'
              }}
            >
              <p style={{ fontSize: u(14), lineHeight: 1.3, textWrap: 'pretty' }}>{copy.line}</p>
              <p className='tabular flex items-center' style={{ gap: u(5), marginTop: u(4), fontSize: u(12), color: palette.inkSoft }}>
                <span
                  className='flex shrink-0 items-center justify-center rounded-full'
                  style={{
                    width: u(15),
                    height: u(15),
                    background: state.phase === 'done' ? palette.green : palette.butter,
                    color: palette.cream
                  }}
                >
                  {state.phase === 'done' ? <CheckGlyph size={10} /> : null}
                </span>
                {copy.when}
              </p>
            </div>
          </div>
          <p style={{ fontSize: u(12), color: palette.inkSoft, marginTop: u(6), lineHeight: 1.3 }}>{copy.foot}</p>
        </section>

      </div>

      <p
        aria-hidden={!d.engaged}
        className='absolute'
        style={{
          left: u(320),
          top: u(40),
          width: u(170),
          fontSize: u(13),
          lineHeight: 1.3,
          opacity: d.engaged ? 1 : 0,
          transform: d.engaged ? 'none' : `translateY(${u(4)})`,
          transition: 'opacity 300ms ease, transform 400ms ease'
        }}
      >
        Your turn. Answer for Ada, or tap a time on her ring.
      </p>

      <button
        type='button'
        onClick={() => act({ type: 'reset' })}
        className='mg-focus-ink mg-press absolute flex items-center rounded-full'
        style={{
          left: u(318),
          bottom: u(22),
          gap: u(7),
          height: u(34),
          padding: `0 ${u(14)} 0 ${u(12)}`,
          fontSize: u(13),
          fontWeight: 700,
          color: palette.ink,
          border: `${u(1.5)} solid rgba(42,33,16,.55)`
        }}
      >
        <ResetGlyph size={14} />
        Start the day again
      </button>

      <DemoCursor cursor={d.cursor} kind='touch' color={palette.marigoldDeep} />
    </Stage>
  );
}
