import type { CSSProperties, ReactNode, Ref } from 'react';
import { u } from '~/components/stage';
import { cn } from '~/lib/utils';
import {
  CheckGlyph,
  ChimeGlyph,
  DayRing,
  MarigoldMark,
  PhoneGlyph,
  PillArt,
  SpeakerGlyph,
  TextGlyph,
  pillCount,
  pills,
  slotById,
  slots
} from './parts';
import type { DoseState, Pill, SlotId } from './parts';
import { fontFamily, palette } from './theme';

const p = palette;
const system = '-apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';
const focusRing = 'mg-focus';

/* ------------------------------------------------------------------ */
/* Home: Ada's phone. One question at a time, the day ring on top.     */
/* ------------------------------------------------------------------ */

export type HomePhase = 'ask' | 'later' | 'done';

export const homeStates = (phase: HomePhase): Record<SlotId, DoseState> => ({
  morning: phase === 'done' ? 'done' : 'due',
  midday: 'later',
  evening: 'later',
  bedtime: 'later'
});

const TAKEN_AT = '8:04 am';

const peekStatus: Record<SlotId, string> = {
  morning: `You took these at ${TAKEN_AT}.`,
  midday: 'Coming up at 1:00 pm.',
  evening: 'Later, at 6:00 pm.',
  bedtime: 'Tonight, at 9:00 pm.'
};

function ringLabel(id: SlotId, state: DoseState) {
  const slot = slotById(id);
  const status =
    state === 'done' ? `taken at ${TAKEN_AT}` : state === 'due' ? 'due now' : pillCount(slot);
  return `${slot.label}, ${slot.time}: ${status}`;
}

/** Quadrant buttons over the ring, clockwise from the top: morning first. */
const quadrants: Record<SlotId, CSSProperties> = {
  morning: { right: 0, top: 0 },
  midday: { right: 0, bottom: 0 },
  evening: { left: 0, bottom: 0 },
  bedtime: { left: 0, top: 0 }
};

export function HomeScreen({
  phase,
  selected = null,
  peek = 'midday',
  arrival = 0,
  live = false,
  greeting = 'Good morning, Ada',
  date = 'Tuesday, March 12',
  footer = false,
  onTake,
  onNotYet,
  onSelect,
  onBack,
  cardRef
}: {
  phase: HomePhase;
  selected?: SlotId | null;
  /** The slot shown in the peek layer (kept while it fades out). */
  peek?: SlotId;
  /** Increments when a reminder arrives, to replay the soft pulse. */
  arrival?: number;
  /** The live demo: animate the ring and the arrival. */
  live?: boolean;
  greeting?: string;
  date?: string;
  /** Show the quiet tools under the card (tall phones only). */
  footer?: boolean;
  onTake?: () => void;
  onNotYet?: () => void;
  onSelect?: (slot: SlotId) => void;
  onBack?: () => void;
  cardRef?: Ref<HTMLDivElement>;
}) {
  const states = homeStates(phase);
  const done = Object.values(states).filter((s) => s === 'done').length;
  const layer: 'ask' | 'later' | 'done' | 'peek' = selected ? 'peek' : phase;
  const peekSlot = slotById(selected ?? peek);
  const morning = slotById('morning');

  return (
    <div
      className='flex h-full flex-col'
      style={{ background: p.cream, color: p.ink, padding: `${u(4)} ${u(12)} 0`, fontFamily }}
    >
      <header className='flex shrink-0 items-center justify-between' style={{ height: u(62), paddingLeft: u(4) }}>
        <div>
          <p style={{ fontSize: u(18), fontWeight: 700, lineHeight: 1.15 }}>{greeting}</p>
          <p style={{ fontSize: u(13), color: p.inkSoft, marginTop: u(3) }}>{date}</p>
        </div>
        <div className='relative' style={{ marginRight: u(6) }}>
          <DayRing size={56} thickness={7} states={states} selected={selected} pulse={live}>
            <span className='tabular' style={{ fontSize: u(13), fontWeight: 700, lineHeight: 1 }}>
              {done} of 4
            </span>
          </DayRing>
          {onSelect ? (
            <div className='absolute' style={{ inset: u(-8) }}>
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type='button'
                  data-target={`ring-${slot.id}`}
                  aria-label={ringLabel(slot.id, states[slot.id])}
                  aria-pressed={selected === slot.id}
                  onClick={() => onSelect(slot.id)}
                  className={cn('absolute rounded-full', focusRing)}
                  style={{ width: '50%', height: '50%', ...quadrants[slot.id] }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <div
        ref={cardRef}
        className='relative shrink-0'
        style={{
          marginTop: u(8),
          height: u(256),
          borderRadius: u(22),
          background: p.white,
          border: `1px solid ${p.rule}`,
          boxShadow: `0 ${u(1)} ${u(2)} rgba(60,40,10,.05), 0 ${u(10)} ${u(24)} ${u(-12)} rgba(60,40,10,.18)`
        }}
      >
        {live && arrival > 0 ? (
          <span
            key={arrival}
            aria-hidden
            className='mg-pulse pointer-events-none absolute inset-0'
            style={{ borderRadius: u(22) }}
          />
        ) : null}

        <Layer active={layer === 'ask'}>
          <CardTitle
            label='Morning pills'
            right={morning.time}
            chime={<ChimeGlyph key={arrival} size={17} color={p.green} ringing={live && arrival > 0} />}
          />
          <h3 style={{ fontSize: u(22), fontWeight: 700, lineHeight: 1.15, marginTop: u(6) }}>
            Did you take them?
          </h3>
          <PillsRow pills={morning.pills} style={{ marginTop: u(12) }} />
          <div className='mt-auto flex flex-col' style={{ gap: u(8) }}>
            <BigButton target='took' onClick={onTake}>
              <CheckGlyph size={20} />I took them
            </BigButton>
            <BigButton target='not-yet' tone='quiet' onClick={onNotYet}>
              Not yet
            </BigButton>
          </div>
        </Layer>

        <Layer active={layer === 'later'}>
          <CardTitle label='Morning pills' right={morning.time} chime={<ChimeGlyph size={17} color={p.green} />} />
          <h3 style={{ fontSize: u(21), fontWeight: 700, lineHeight: 1.15, marginTop: u(6) }}>
            I'll check in at 8:30.
          </h3>
          <p style={{ fontSize: u(15), color: p.inkSoft, marginTop: u(3) }}>Just a chime, no alarm.</p>
          <PillsRow pills={morning.pills} style={{ marginTop: u(10) }} />
          <div className='mt-auto'>
            <BigButton target='took-later' onClick={onTake}>
              <CheckGlyph size={20} />I took them
            </BigButton>
          </div>
        </Layer>

        <Layer active={layer === 'done'}>
          <CardTitle
            label='Morning pills'
            right={
              <span className='flex items-center' style={{ gap: u(4), color: p.green, fontWeight: 700 }}>
                <CheckGlyph size={14} />
                {TAKEN_AT}
              </span>
            }
          />
          <div className='flex items-center' style={{ gap: u(12), marginTop: u(10) }}>
            <span
              className='flex shrink-0 items-center justify-center rounded-full'
              style={{ width: u(44), height: u(44), background: p.green, color: p.cream }}
            >
              <CheckGlyph size={24} />
            </span>
            <h3 style={{ fontSize: u(21), fontWeight: 700, lineHeight: 1.15, textWrap: 'balance' }}>
              Done for this morning.
            </h3>
          </div>
          <PillsRow pills={morning.pills} style={{ marginTop: u(12) }} />
          <div
            className='mt-auto flex items-center'
            style={{ gap: u(10), background: p.butter, borderRadius: u(14), padding: `${u(9)} ${u(12)}` }}
          >
            <PillArt pill={pills.metformin} size={40} />
            <p style={{ lineHeight: 1.2 }}>
              <span style={{ display: 'block', fontSize: u(13), color: p.inkSoft }}>Next</span>
              <span className='tabular' style={{ display: 'block', fontSize: u(16), fontWeight: 700 }}>
                1 pill at 1:00 pm
              </span>
            </p>
          </div>
        </Layer>

        <Layer active={layer === 'peek'}>
          <CardTitle
            label={`${peekSlot.label} ${peekSlot.pills.length === 1 ? 'pill' : 'pills'}`}
            right={peekSlot.time}
          />
          <h3 style={{ fontSize: u(19), fontWeight: 700, lineHeight: 1.15, marginTop: u(6) }}>
            {peekStatus[peekSlot.id]}
          </h3>
          <PillsRow pills={peekSlot.pills} detail='full' style={{ marginTop: u(12) }} />
          <div className='mt-auto'>
            <BigButton target='back' tone='quiet' onClick={onBack}>
              Back to now
            </BigButton>
          </div>
        </Layer>
      </div>

      {footer ? (
        <div className='grid' style={{ gridTemplateColumns: '1fr 1fr', gap: u(8), marginTop: u(12) }}>
          <QuietTool icon={<SpeakerGlyph size={18} />}>Read it to me</QuietTool>
          <QuietTool icon={<PillArt pill={pills.metformin} size={24} />}>Which one is this?</QuietTool>
          <p className='text-center' style={{ gridColumn: '1 / -1', fontSize: u(13), color: p.inkSoft, marginTop: u(10), lineHeight: 1.35 }}>
            No answer by 8:15? I'll say it out loud.
            <br />
            Daniel hears from me only after 8:45.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Layer({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div
      inert={!active}
      aria-hidden={!active}
      tabIndex={-1}
      data-active={active || undefined}
      className='absolute inset-0 flex flex-col outline-none'
      style={{
        padding: u(14),
        opacity: active ? 1 : 0,
        transform: active ? 'none' : `translateY(${u(5)})`,
        transition: active
          ? 'opacity 480ms ease 140ms, transform 620ms cubic-bezier(.2,.8,.2,1) 140ms'
          : 'opacity 260ms ease, transform 260ms ease'
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ label, right, chime }: { label: string; right: ReactNode; chime?: ReactNode }) {
  return (
    <div className='flex items-center' style={{ gap: u(6), height: u(18) }}>
      {chime}
      <span style={{ fontSize: u(15), fontWeight: 700, color: p.green }}>{label}</span>
      <span className='tabular ml-auto' style={{ fontSize: u(14), color: p.inkSoft }}>
        {right}
      </span>
    </div>
  );
}

function BigButton({
  children,
  tone = 'solid',
  target,
  onClick
}: {
  children: ReactNode;
  tone?: 'solid' | 'quiet';
  target?: string;
  onClick?: () => void;
}) {
  const solid = tone === 'solid';
  return (
    <button
      type='button'
      data-target={target}
      onClick={onClick}
      className={cn(
        'mg-press flex w-full items-center justify-center',
        focusRing
      )}
      style={{
        height: u(solid ? 52 : 44),
        gap: u(8),
        borderRadius: u(16),
        background: solid ? p.green : p.white,
        color: solid ? p.cream : p.green,
        border: solid ? 'none' : `${u(2)} solid ${p.green}`,
        fontSize: u(solid ? 18 : 17),
        fontWeight: 700
      }}
    >
      {children}
    </button>
  );
}

function QuietTool({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span
      className='flex flex-col items-start justify-between'
      style={{
        height: u(70),
        padding: u(12),
        borderRadius: u(16),
        background: p.butter,
        color: p.ink,
        fontSize: u(14),
        fontWeight: 700,
        lineHeight: 1.15
      }}
    >
      <span style={{ color: p.green }}>{icon}</span>
      {children}
    </span>
  );
}

export function PillsRow({
  pills: list,
  detail = 'name',
  style
}: {
  pills: Pill[];
  detail?: 'name' | 'full';
  style?: CSSProperties;
}) {
  if (detail === 'full' && list.length === 1) {
    const pill = list[0];
    return (
      <div className='flex items-center' style={{ gap: u(12), ...style }}>
        <span
          className='flex shrink-0 items-center justify-center'
          style={{ width: u(64), height: u(56), borderRadius: u(14), background: p.cream }}
        >
          <PillArt pill={pill} size={56} />
        </span>
        <div style={{ lineHeight: 1.2 }}>
          <p style={{ fontSize: u(15), fontWeight: 700 }}>{pill.looks}</p>
          <p style={{ fontSize: u(15) }}>{pill.purpose}</p>
          <p style={{ fontSize: u(12), color: p.inkSoft, marginTop: u(3) }}>
            {pill.name} {pill.dose}
          </p>
        </div>
      </div>
    );
  }
  return (
    <ul className='flex' style={{ gap: u(4), ...style }}>
      {list.map((pill) => (
        <li
          key={pill.id}
          className='flex min-w-0 flex-1 flex-col items-center text-center'
          aria-label={`${pill.looks}, ${pill.purpose}: ${pill.name} ${pill.dose}`}
        >
          <span
            className='flex w-full items-center justify-center'
            style={{ height: u(32), borderRadius: u(10), background: p.cream }}
          >
            <PillArt pill={pill} size={44} />
          </span>
          {detail === 'full' ? (
            <span style={{ fontSize: u(13), fontWeight: 700, lineHeight: 1.15, marginTop: u(6) }}>
              {pill.purpose.replace(/^for /, '')}
            </span>
          ) : null}
          <span
            style={{
              fontSize: u(12),
              color: p.inkSoft,
              lineHeight: 1.2,
              marginTop: u(detail === 'full' ? 2 : 5)
            }}
          >
            {pill.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Today: the whole day at a glance                                    */
/* ------------------------------------------------------------------ */

const dayLog: Record<SlotId, { state: DoseState; note: string }> = {
  morning: { state: 'done', note: 'Taken 8:04 am' },
  midday: { state: 'done', note: 'Taken 1:10 pm' },
  evening: { state: 'due', note: 'Next, at 6:00 pm' },
  bedtime: { state: 'later', note: 'At 9:00 pm' }
};

export function TodayScreen() {
  const states = Object.fromEntries(
    slots.map((slot) => [slot.id, dayLog[slot.id].state])
  ) as Record<SlotId, DoseState>;
  const corner: Record<SlotId, CSSProperties> = {
    morning: { right: u(2), top: u(18) },
    midday: { right: u(2), bottom: u(18) },
    evening: { left: u(2), bottom: u(18) },
    bedtime: { left: u(2), top: u(18) }
  };
  return (
    <div className='flex h-full flex-col' style={{ background: p.cream, color: p.ink, padding: `${u(4)} ${u(16)} 0`, fontFamily }}>
      <p style={{ fontSize: u(18), fontWeight: 700, lineHeight: 1.15 }}>Good afternoon, Ada</p>
      <p style={{ fontSize: u(13), color: p.inkSoft, marginTop: u(3) }}>Tuesday, March 12</p>

      <div className='relative' style={{ height: u(206), marginTop: u(10) }}>
        <DayRing
          size={176}
          thickness={20}
          gap={7}
          states={states}
          className='absolute'
          style={{ left: '50%', top: u(14), marginLeft: u(-88) }}
        >
          <span className='tabular' style={{ fontSize: u(40), fontWeight: 700, lineHeight: 1 }}>
            2 of 4
          </span>
          <span style={{ fontSize: u(14), color: p.inkSoft, marginTop: u(4) }}>done today</span>
        </DayRing>
        {slots.map((slot) => (
          <span
            key={slot.id}
            className='absolute flex items-center'
            style={{
              ...corner[slot.id],
              gap: u(3),
              fontSize: u(13),
              fontWeight: 700,
              color: states[slot.id] === 'later' ? p.inkSoft : p.ink
            }}
          >
            {states[slot.id] === 'done' ? <CheckGlyph size={13} color={p.green} /> : null}
            {slot.label}
          </span>
        ))}
      </div>

      <ol className='flex flex-col' style={{ gap: u(6), marginTop: u(8) }}>
        {slots.map((slot) => {
          const log = dayLog[slot.id];
          const next = log.state === 'due';
          return (
            <li
              key={slot.id}
              className='flex items-center'
              style={{
                gap: u(10),
                padding: `${u(9)} ${u(12)}`,
                borderRadius: u(16),
                background: next ? p.white : 'transparent',
                border: `1px solid ${next ? p.marigold : p.rule}`,
                boxShadow: next ? `0 0 0 ${u(2)} ${p.butter}` : undefined
              }}
            >
              <span
                className='flex shrink-0 items-center justify-center rounded-full'
                style={{
                  width: u(28),
                  height: u(28),
                  background: log.state === 'done' ? p.green : next ? p.butter : 'transparent',
                  border: log.state === 'later' ? `${u(2)} solid #E7D8B6` : undefined,
                  color: p.cream
                }}
              >
                {log.state === 'done' ? <CheckGlyph size={16} /> : null}
                {next ? <ChimeGlyph size={15} color={p.green} /> : null}
              </span>
              <div className='min-w-0 flex-1'>
                <p style={{ fontSize: u(16), fontWeight: 700, lineHeight: 1.15 }}>{slot.label}</p>
                <p className='tabular' style={{ fontSize: u(13), color: p.inkSoft, marginTop: u(2) }}>
                  {log.note}
                </p>
              </div>
              <span className='flex shrink-0 items-center'>
                {slot.pills.map((pill, i) => (
                  <PillArt key={`${pill.id}${i}`} pill={pill} size={25} />
                ))}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Which one is this? Looks and purpose first, the name second         */
/* ------------------------------------------------------------------ */


export function PillIdScreen({ chosen = 'metformin' }: { chosen?: string }) {
  const list = [pills.amlodipine, pills.metformin, pills.omeprazole, pills.atorvastatin, pills.gabapentin];
  return (
    <div className='flex h-full flex-col' style={{ background: p.cream, color: p.ink, padding: `${u(2)} ${u(14)} 0`, fontFamily }}>
      <span className='flex items-center' style={{ gap: u(4), fontSize: u(14), fontWeight: 700, color: p.green }}>
        <svg viewBox='0 0 10 16' aria-hidden style={{ width: u(8), height: u(13) }}>
          <path d='M8 2 L2 8 L8 14' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
        Today
      </span>
      <h2 style={{ fontSize: u(25), fontWeight: 700, lineHeight: 1.1, marginTop: u(8) }}>
        Which one is this?
      </h2>
      <p style={{ fontSize: u(15), color: p.inkSoft, lineHeight: 1.3, marginTop: u(4), textWrap: 'pretty' }}>
        Match the pill in your hand.
      </p>
      <ul className='flex flex-col' style={{ gap: u(5), marginTop: u(12) }}>
        {list.map((pill) => {
          const on = pill.id === chosen;
          return (
            <li
              key={pill.id}
              className='flex items-center'
              style={{
                gap: u(12),
                padding: on ? u(6.5) : u(8),
                borderRadius: u(18),
                background: p.white,
                border: on ? `${u(2.5)} solid ${p.green}` : `1px solid ${p.rule}`
              }}
            >
              <span
                className='flex shrink-0 items-center justify-center'
                style={{ width: u(58), height: u(50), borderRadius: u(12), background: on ? p.butter : p.cream }}
              >
                <PillArt pill={pill} size={52} />
              </span>
              <div className='min-w-0 flex-1' style={{ lineHeight: 1.2 }}>
                <p style={{ fontSize: u(14.5), fontWeight: 700 }}>{pill.looks}</p>
                <p style={{ fontSize: u(14.5) }}>{pill.purpose}</p>
                <p style={{ fontSize: u(12), color: p.inkSoft, marginTop: u(3) }}>
                  {pill.name} {pill.dose}
                </p>
              </div>
              {on ? (
                <span
                  className='flex shrink-0 items-center justify-center rounded-full'
                  style={{ width: u(26), height: u(26), marginRight: u(4), background: p.green, color: p.cream }}
                >
                  <CheckGlyph size={15} />
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div
        className='flex items-center'
        style={{ gap: u(10), marginTop: u(7), padding: `${u(8)} ${u(8)} ${u(8)} ${u(14)}`, borderRadius: u(18), background: p.green, color: p.cream }}
      >
        <p className='min-w-0 flex-1' style={{ fontSize: u(14), lineHeight: 1.25 }}>
          <b>Not here?</b> Don't take it.
        </p>
        <span
          className='flex shrink-0 items-center'
          style={{ gap: u(6), height: u(40), padding: `0 ${u(14)}`, borderRadius: u(20), background: p.marigold, color: p.ink, fontSize: u(14), fontWeight: 700 }}
        >
          <PhoneGlyph size={14} color={p.ink} />
          Call Rosa
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Daniel's phone: the text that arrives after 45 minutes              */
/* ------------------------------------------------------------------ */

export function CaregiverTextScreen() {
  const bubble = (from: 'them' | 'me'): CSSProperties => ({
    alignSelf: from === 'me' ? 'flex-end' : 'flex-start',
    maxWidth: '78%',
    padding: `${u(8)} ${u(12)}`,
    borderRadius: u(18),
    fontSize: u(15),
    lineHeight: 1.3,
    background: from === 'me' ? '#34C759' : '#E9E9EB',
    color: from === 'me' ? '#FFFFFF' : '#111111'
  });
  return (
    <div className='flex h-full flex-col' style={{ background: '#FFFFFF', fontFamily: system, color: '#111' }}>
      <div
        className='flex shrink-0 flex-col items-center'
        style={{ paddingBottom: u(10), borderBottom: '1px solid #E5E5EA', background: '#F7F7F8' }}
      >
        <span
          className='flex items-center justify-center rounded-full'
          style={{ width: u(46), height: u(46), background: p.cream, border: `1px solid ${p.rule}` }}
        >
          <MarigoldMark size={30} />
        </span>
        <span style={{ fontSize: u(12), marginTop: u(5) }}>Marigold · Northside</span>
      </div>
      <div className='flex flex-1 flex-col' style={{ padding: `${u(12)} ${u(12)}`, gap: u(6) }}>
        <span style={{ alignSelf: 'center', fontSize: u(11.5), color: '#8A8A8E', marginBottom: u(4) }}>
          <b style={{ fontWeight: 600 }}>Today</b> 6:45 PM
        </span>
        <p style={bubble('them')}>
          Hi Daniel, it's Marigold. Ada hasn't answered about her evening pills. She may be out. Want to
          call her?
        </p>
        <p style={bubble('them')}>
          Call Ada: <span style={{ color: '#0A66D8', textDecoration: 'underline' }}>(773) 555-0142</span>
        </p>
        <p style={{ ...bubble('me'), marginTop: u(6) }}>Calling her now</p>
        <span style={{ alignSelf: 'flex-end', fontSize: u(11.5), color: '#8A8A8E' }}>Delivered</span>
        <span style={{ alignSelf: 'center', fontSize: u(11.5), color: '#8A8A8E', margin: `${u(10)} 0 ${u(4)}` }}>
          7:02 PM
        </span>
        <p style={bubble('them')}>
          Ada just answered: she took her evening pills at 7:01 pm. Nothing else needed tonight.
        </p>
      </div>
      <div className='flex shrink-0 items-center' style={{ gap: u(8), padding: `${u(8)} ${u(12)} ${u(26)}` }}>
        <span
          className='flex-1'
          style={{
            height: u(34),
            borderRadius: u(17),
            border: '1px solid #D1D1D6',
            fontSize: u(15),
            color: '#A0A0A5',
            display: 'flex',
            alignItems: 'center',
            paddingInline: u(14)
          }}
        >
          Text Message
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The BEFORE: a typical pill-box alarm app                            */
/* ------------------------------------------------------------------ */

export function OldAlarmScreen() {
  const rows = [
    ['AMLODIPINE BESYLATE 5MG TAB', 'Take 1 tablet(s) by mouth once daily'],
    ['METFORMIN HCL 500MG TAB', 'Take 1 tablet(s) by mouth 3 times daily w/ meals'],
    ['OMEPRAZOLE DR 20MG CAP', 'Take 1 capsule(s) by mouth daily before breakfast']
  ];
  return (
    <div className='flex h-full flex-col' style={{ background: '#121418', color: '#E8E9EC', fontFamily: system }}>
      <div
        className='flex shrink-0 items-center justify-center'
        style={{ gap: u(8), height: u(58), background: '#E0201B', color: '#fff' }}
      >
        <svg viewBox='0 0 20 20' aria-hidden style={{ width: u(22), height: u(22) }}>
          <path
            d='M10 2.5 C6.6 2.5 5 5 5 8 V11.5 L3.2 14.2 H16.8 L15 11.5 V8 C15 5 13.4 2.5 10 2.5 Z M8 15.6 Q10 18 12 15.6'
            fill='#fff'
          />
          <path d='M2.2 6 Q2.6 3.4 4.4 2 M17.8 6 Q17.4 3.4 15.6 2' stroke='#fff' strokeWidth='1.6' fill='none' strokeLinecap='round' />
        </svg>
        <span style={{ fontSize: u(24), fontWeight: 800, letterSpacing: '0.12em' }}>ALARM</span>
      </div>
      <div className='flex flex-col items-center' style={{ padding: `${u(18)} ${u(16)} 0` }}>
        <span className='tabular' style={{ fontSize: u(64), fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em' }}>
          08:00
        </span>
        <span style={{ fontSize: u(10), color: '#9BA0A8', letterSpacing: '0.08em', marginTop: u(6) }}>
          MEDICATION REMINDER · DOSE 1 OF 6
        </span>
      </div>
      <div style={{ margin: `${u(16)} ${u(12)} 0`, borderTop: '1px solid #2A2E35' }}>
        {rows.map(([name, sig]) => (
          <div key={name} className='flex items-start' style={{ gap: u(8), padding: `${u(9)} ${u(2)}`, borderBottom: '1px solid #2A2E35' }}>
            <span
              style={{
                width: u(12),
                height: u(12),
                marginTop: u(1),
                border: '1px solid #5A606A',
                borderRadius: u(2),
                flexShrink: 0
              }}
            />
            <div>
              <p style={{ fontSize: u(9.5), fontWeight: 700, letterSpacing: '0.02em' }}>{name}</p>
              <p style={{ fontSize: u(9), color: '#8E949D', marginTop: u(2) }}>{sig}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        className='flex items-center'
        style={{
          gap: u(8),
          margin: `${u(14)} ${u(12)} 0`,
          padding: `${u(8)} ${u(10)}`,
          borderRadius: u(6),
          background: 'rgba(224,32,27,.14)',
          color: '#FF6B66',
          fontSize: u(10),
          fontWeight: 600
        }}
      >
        <span style={{ fontSize: u(15), fontWeight: 800 }}>0</span>
        <span style={{ lineHeight: 1.25 }}>
          DAY STREAK · You missed 3 doses this week. Don't break the chain!
        </span>
      </div>
      <div className='mt-auto grid' style={{ gridTemplateColumns: '1fr 1fr', gap: u(8), padding: `0 ${u(12)} ${u(30)}` }}>
        {['SNOOZE 10 MIN', 'DISMISS'].map((label, i) => (
          <span
            key={label}
            className='flex items-center justify-center'
            style={{
              height: u(38),
              borderRadius: u(6),
              background: i === 0 ? '#2A2E35' : '#E0201B',
              color: '#fff',
              fontSize: u(11),
              fontWeight: 700,
              letterSpacing: '0.06em'
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Setup: a nurse or family member adds a medication                   */
/* ------------------------------------------------------------------ */

const shapeOptions = [
  { label: 'Round', pill: pills.amlodipine },
  { label: 'Oval', pill: { ...pills.atorvastatin, tones: ['white'] as ['white'] } },
  { label: 'Capsule', pill: { ...pills.omeprazole, tones: ['white', 'white'] as ['white', 'white'] } },
  {
    label: 'Long',
    pill: { ...pills.atorvastatin, id: 'long', tones: ['white'] as ['white'], w: 40, h: 13 }
  }
];

const swatches = [
  ['White', '#FFFFFF'],
  ['Cream', '#F6EBCF'],
  ['Yellow', '#F7D45E'],
  ['Peach', '#F8C6A0'],
  ['Orange', '#F29A4B'],
  ['Pink', '#F3A5B7'],
  ['Red', '#D9564A'],
  ['Blue', '#9FC5EA'],
  ['Green', '#9CCB9F'],
  ['Brown', '#B08560']
];

function Field({ n, label, hint, children }: { n: number; label: string; hint?: string; children: ReactNode }) {
  return (
    <section style={{ paddingBlock: u(17), borderTop: `1px solid ${p.rule}` }}>
      <div className='flex' style={{ alignItems: 'baseline', gap: u(10) }}>
        <span
          className='tabular flex items-center justify-center rounded-full'
          style={{ width: u(26), height: u(26), background: p.green, color: p.cream, fontSize: u(14), fontWeight: 700, flexShrink: 0, transform: `translateY(${u(5)})` }}
        >
          {n}
        </span>
        <div>
          <h3 style={{ fontSize: u(20), fontWeight: 700 }}>{label}</h3>
          {hint ? <p style={{ fontSize: u(15), color: p.inkSoft, marginTop: u(2) }}>{hint}</p> : null}
        </div>
      </div>
      <div style={{ marginTop: u(12), marginLeft: u(36) }}>{children}</div>
    </section>
  );
}

export function SetupScreen() {
  const ada = [pills.amlodipine, pills.metformin, pills.omeprazole, pills.gabapentin];
  return (
    <div className='flex h-full' style={{ background: p.cream, color: p.ink, fontFamily }}>
      <aside
        className='flex shrink-0 flex-col'
        style={{ width: u(270), padding: `${u(28)} ${u(24)}`, borderRight: `1px solid ${p.rule}`, background: '#FFFCF4' }}
      >
        <span className='flex items-center' style={{ gap: u(8), fontSize: u(17), fontWeight: 700, color: p.green }}>
          <MarigoldMark size={22} />
          Marigold
        </span>
        <p style={{ fontSize: u(13), color: p.inkSoft, marginTop: u(30) }}>Setting up for</p>
        <p style={{ fontSize: u(22), fontWeight: 700, marginTop: u(2) }}>Ada Kowalski</p>
        <p style={{ fontSize: u(14), color: p.inkSoft, marginTop: u(4), lineHeight: 1.35 }}>
          With Rosa Delgado, RN
          <br />
          Northside home visit, March 4
        </p>
        <p style={{ fontSize: u(13), fontWeight: 700, color: p.inkSoft, marginTop: u(30), letterSpacing: '0.04em' }}>
          HER PILLS · 5
        </p>
        <ul className='flex flex-col' style={{ marginTop: u(10), gap: u(4) }}>
          {ada.map((pill) => (
            <li key={pill.id} className='flex items-center' style={{ gap: u(10), paddingBlock: u(7) }}>
              <PillArt pill={pill} size={34} />
              <span style={{ lineHeight: 1.2 }}>
                <span style={{ display: 'block', fontSize: u(15), fontWeight: 700 }}>{pill.name}</span>
                <span style={{ display: 'block', fontSize: u(13), color: p.inkSoft }}>{pill.purpose}</span>
              </span>
            </li>
          ))}
          <li
            className='flex items-center'
            style={{ gap: u(10), padding: `${u(7)} ${u(8)}`, margin: `0 ${u(-8)}`, borderRadius: u(12), background: p.butter }}
          >
            <PillArt pill={pills.atorvastatin} size={34} />
            <span style={{ lineHeight: 1.2 }}>
              <span style={{ display: 'block', fontSize: u(15), fontWeight: 700 }}>Atorvastatin</span>
              <span style={{ display: 'block', fontSize: u(13), color: p.inkSoft }}>Adding now</span>
            </span>
          </li>
        </ul>
      </aside>

      <main className='min-w-0 flex-1' style={{ padding: `${u(28)} ${u(40)} 0` }}>
        <p style={{ fontSize: u(14), color: p.inkSoft }}>Medication 5 of 5</p>
        <h2 style={{ fontSize: u(32), fontWeight: 700, lineHeight: 1.1, marginTop: u(4), marginBottom: u(18) }}>
          Add a medication
        </h2>

        <Field n={1} label='Name on the bottle'>
          <div className='flex items-center' style={{ gap: u(12) }}>
            <span
              className='flex items-center'
              style={{ width: u(360), height: u(50), padding: `0 ${u(16)}`, borderRadius: u(12), background: p.white, border: `${u(2)} solid ${p.green}`, fontSize: u(18) }}
            >
              Atorvastatin 20 mg
              <span style={{ width: u(2), height: u(22), background: p.green, marginLeft: u(2) }} />
            </span>
            <span style={{ fontSize: u(14), color: p.inkSoft }}>Matched in Northside's pharmacy list</span>
          </div>
        </Field>

        <Field n={2} label='What does it look like?' hint='Hold it in your hand. No photo needed.'>
          <div className='flex' style={{ gap: u(10) }}>
            {shapeOptions.map((option) => {
              const on = option.label === 'Oval';
              return (
                <span
                  key={option.label}
                  className='flex flex-col items-center justify-center'
                  style={{
                    width: u(104),
                    height: u(84),
                    gap: u(6),
                    borderRadius: u(14),
                    background: on ? p.butter : p.white,
                    border: on ? `${u(2)} solid ${p.green}` : `1px solid ${p.rule}`,
                    fontSize: u(15),
                    fontWeight: on ? 700 : 400
                  }}
                >
                  <PillArt pill={on ? pills.atorvastatin : option.pill} size={56} />
                  {option.label}
                </span>
              );
            })}
          </div>
          <div className='flex flex-wrap' style={{ gap: u(8), marginTop: u(14), maxWidth: u(640) }}>
            {swatches.map(([name, hex]) => {
              const on = name === 'Peach';
              return (
                <span
                  key={name}
                  className='flex items-center'
                  style={{
                    gap: u(8),
                    height: u(40),
                    padding: `0 ${u(14)} 0 ${u(8)}`,
                    borderRadius: u(20),
                    background: on ? p.butter : p.white,
                    border: on ? `${u(2)} solid ${p.green}` : `1px solid ${p.rule}`,
                    fontSize: u(15),
                    fontWeight: on ? 700 : 400
                  }}
                >
                  <span className='rounded-full' style={{ width: u(24), height: u(24), background: hex, border: '1px solid rgba(60,40,10,.18)' }} />
                  {name}
                </span>
              );
            })}
          </div>
        </Field>

        <Field n={3} label='What is it for, in plain words?'>
          <div className='flex items-center' style={{ gap: u(10) }}>
            <span
              className='flex items-center'
              style={{ width: u(300), height: u(50), padding: `0 ${u(16)}`, borderRadius: u(12), background: p.white, border: `1px solid ${p.rule}`, fontSize: u(18) }}
            >
              for cholesterol
            </span>
            <span style={{ fontSize: u(14), color: p.inkSoft }}>Suggested by Dr. Reyes's list</span>
          </div>
        </Field>

        <Field n={4} label='When does Ada take it?'>
          <div className='flex' style={{ gap: u(10) }}>
            {slots.map((slot) => {
              const on = slot.id === 'evening';
              return (
                <span
                  key={slot.id}
                  className='flex items-center'
                  style={{
                    gap: u(10),
                    height: u(60),
                    padding: `0 ${u(20)}`,
                    borderRadius: u(30),
                    background: on ? p.green : p.white,
                    color: on ? p.cream : p.ink,
                    border: on ? 'none' : `1px solid ${p.rule}`
                  }}
                >
                  {on ? <CheckGlyph size={18} /> : null}
                  <span style={{ lineHeight: 1.1 }}>
                    <span style={{ display: 'block', fontSize: u(17), fontWeight: 700 }}>{slot.label}</span>
                    <span className='tabular' style={{ display: 'block', fontSize: u(14), opacity: 0.85 }}>
                      {slot.time}
                    </span>
                  </span>
                </span>
              );
            })}
          </div>
        </Field>
      </main>

      <aside className='flex shrink-0 flex-col' style={{ width: u(330), padding: `${u(28)} ${u(28)} ${u(28)} 0` }}>
        <p style={{ fontSize: u(14), fontWeight: 700, color: p.inkSoft }}>Ada will see it like this</p>
        <div
          style={{
            marginTop: u(12),
            padding: u(18),
            borderRadius: u(22),
            background: p.white,
            border: `1px solid ${p.rule}`,
            boxShadow: `0 ${u(14)} ${u(30)} ${u(-16)} rgba(60,40,10,.25)`
          }}
        >
          <span
            className='flex items-center justify-center'
            style={{ height: u(110), borderRadius: u(16), background: p.cream }}
          >
            <PillArt pill={pills.atorvastatin} size={120} />
          </span>
          <p style={{ fontSize: u(20), fontWeight: 700, marginTop: u(14) }}>Peach oval</p>
          <p style={{ fontSize: u(20) }}>for cholesterol</p>
          <p style={{ fontSize: u(14), color: p.inkSoft, marginTop: u(6) }}>Atorvastatin 20 mg</p>
          <div style={{ marginTop: u(16), paddingTop: u(14), borderTop: `1px solid ${p.rule}` }}>
            <p style={{ fontSize: u(15), fontWeight: 700, color: p.green }}>Evening pills · 6:00 pm</p>
            <PillsRow pills={slotById('evening').pills} style={{ marginTop: u(10) }} />
          </div>
        </div>
        <div className='mt-auto flex flex-col' style={{ gap: u(10) }}>
          <span
            className='flex items-center justify-center'
            style={{ height: u(54), borderRadius: u(16), background: p.green, color: p.cream, fontSize: u(18), fontWeight: 700 }}
          >
            Save for Ada
          </span>
          <span className='text-center' style={{ fontSize: u(14), color: p.inkSoft }}>
            Daniel gets a copy of the list
          </span>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The family's week: what happened, no score                          */
/* ------------------------------------------------------------------ */

type Cell = { s: 'on' | 'late' | 'none'; t: string };
const week: { day: string; date: string; cells: Cell[] }[] = [
  { day: 'Mon', date: '4', cells: [{ s: 'on', t: '8:02' }, { s: 'on', t: '1:05' }, { s: 'on', t: '6:11' }, { s: 'on', t: '9:03' }] },
  { day: 'Tue', date: '5', cells: [{ s: 'on', t: '8:10' }, { s: 'on', t: '1:02' }, { s: 'on', t: '6:04' }, { s: 'on', t: '9:20' }] },
  { day: 'Wed', date: '6', cells: [{ s: 'on', t: '7:58' }, { s: 'late', t: '1:48' }, { s: 'on', t: '6:00' }, { s: 'on', t: '9:01' }] },
  { day: 'Thu', date: '7', cells: [{ s: 'on', t: '8:04' }, { s: 'on', t: '1:12' }, { s: 'late', t: '7:10' }, { s: 'on', t: '9:15' }] },
  { day: 'Fri', date: '8', cells: [{ s: 'on', t: '8:01' }, { s: 'on', t: '1:00' }, { s: 'on', t: '6:09' }, { s: 'on', t: '9:06' }] },
  { day: 'Sat', date: '9', cells: [{ s: 'on', t: '8:22' }, { s: 'on', t: '1:30' }, { s: 'none', t: '7:01' }, { s: 'on', t: '9:12' }] },
  { day: 'Sun', date: '10', cells: [{ s: 'on', t: '8:06' }, { s: 'on', t: '1:04' }, { s: 'on', t: '6:02' }, { s: 'on', t: '9:00' }] }
];

export function WeeklyScreen() {
  return (
    <div className='flex h-full flex-col' style={{ background: p.cream, color: p.ink, fontFamily }}>
      <div
        className='flex shrink-0 items-center'
        style={{ height: u(64), padding: `0 ${u(36)}`, borderBottom: `1px solid ${p.rule}`, background: '#FFFCF4', gap: u(28) }}
      >
        <span className='flex items-center' style={{ gap: u(8), fontSize: u(17), fontWeight: 700, color: p.green }}>
          <MarigoldMark size={22} />
          Marigold
        </span>
        {['Today', 'Week', 'Her pills', 'People'].map((tab) => (
          <span
            key={tab}
            style={{
              fontSize: u(15),
              fontWeight: tab === 'Week' ? 700 : 400,
              color: tab === 'Week' ? p.ink : p.inkSoft,
              paddingBlock: u(20),
              borderBottom: tab === 'Week' ? `${u(3)} solid ${p.marigold}` : `${u(3)} solid transparent`
            }}
          >
            {tab}
          </span>
        ))}
        <span className='ml-auto' style={{ fontSize: u(14), color: p.inkSoft }}>
          Daniel Kowalski · son
        </span>
      </div>

      <div className='flex min-h-0 flex-1' style={{ padding: `${u(32)} ${u(36)}`, gap: u(36) }}>
        <div className='min-w-0 flex-1'>
          <p style={{ fontSize: u(15), color: p.inkSoft }}>Ada's week · March 4 to 10</p>
          <h2 style={{ fontSize: u(34), fontWeight: 700, lineHeight: 1.12, marginTop: u(6), maxWidth: u(620), textWrap: 'balance' }}>
            A steady week. Every dose answered, 25 on the first chime.
          </h2>

          <div
            style={{
              marginTop: u(26),
              padding: `${u(18)} ${u(20)}`,
              borderRadius: u(20),
              background: p.white,
              border: `1px solid ${p.rule}`
            }}
          >
            <div className='grid' style={{ gridTemplateColumns: `${u(84)} repeat(7, 1fr)`, gap: u(6) }}>
              <span />
              {week.map((d) => (
                <span key={d.day} className='text-center' style={{ fontSize: u(14), color: p.inkSoft, paddingBottom: u(4) }}>
                  <b style={{ color: p.ink }}>{d.day}</b> {d.date}
                </span>
              ))}
              {slots.map((slot, row) => (
                <WeekRow key={slot.id} label={slot.label} cells={week.map((d) => d.cells[row])} />
              ))}
            </div>
            <div className='flex items-center' style={{ gap: u(20), marginTop: u(14), fontSize: u(13), color: p.inkSoft }}>
              <Legend tone='on'>Answered</Legend>
              <Legend tone='late'>After a spoken reminder</Legend>
              <Legend tone='none'>After a text to you</Legend>
            </div>
          </div>

          <div className='flex' style={{ gap: u(16), marginTop: u(16) }}>
            <div className='flex-1' style={{ padding: `${u(18)} ${u(20)}`, borderRadius: u(20), background: p.white, border: `1px solid ${p.rule}` }}>
              <p style={{ fontSize: u(16), fontWeight: 700 }}>If Ada doesn't answer</p>
              <ol className='flex flex-col' style={{ gap: u(9), marginTop: u(12) }}>
                {[
                  ['0 min', 'A soft chime on her phone'],
                  ['15 min', 'A spoken reminder'],
                  ['45 min', 'A text to you'],
                  ['75 min', "Northside's nurse line, if you haven't replied"]
                ].map(([when, what]) => (
                  <li key={when} className='flex' style={{ alignItems: 'baseline', gap: u(12), fontSize: u(15) }}>
                    <span className='tabular shrink-0' style={{ width: u(58), color: p.inkSoft, fontSize: u(14) }}>{when}</span>
                    {what}
                  </li>
                ))}
              </ol>
            </div>
            <div className='flex flex-col' style={{ width: u(270), padding: `${u(18)} ${u(20)}`, borderRadius: u(20), background: p.green, color: p.cream }}>
              <p style={{ fontSize: u(14), color: p.marigold, fontWeight: 700 }}>Next home visit</p>
              <p style={{ fontSize: u(22), fontWeight: 700, marginTop: u(6), lineHeight: 1.15 }}>Thursday, March 14</p>
              <p style={{ fontSize: u(15), marginTop: u(4), opacity: 0.85 }}>Rosa Delgado, RN · 10:30 am</p>
              <p style={{ fontSize: u(14), marginTop: 'auto', paddingTop: u(12), opacity: 0.85, lineHeight: 1.35 }}>
                She'll bring the new metformin and check the pill list with Ada.
              </p>
            </div>
          </div>
        </div>

        <aside className='flex shrink-0 flex-col' style={{ width: u(330), gap: u(12) }}>
          <p style={{ fontSize: u(14), fontWeight: 700, color: p.inkSoft, letterSpacing: '0.04em' }}>WORTH KNOWING</p>
          <Note title='Saturday evening'>
            No answer by 6:45 pm, so we texted you. You called, and she took them at 7:01 pm.
          </Note>
          <Note title='Wednesday and Thursday'>
            Two reminders answered after the spoken one. Both were within an hour.
          </Note>
          <Note title='Refill coming up'>
            Metformin runs out around March 19. Northside's pharmacy has the order.
          </Note>
          <div
            className='flex items-center'
            style={{ gap: u(14), marginTop: u(4), padding: `${u(14)} ${u(16)}`, borderRadius: u(16), background: p.greenSoft }}
          >
            <TextGlyph size={22} color={p.green} />
            <p style={{ fontSize: u(15), lineHeight: 1.3 }}>
              <b>1 text</b> to you this week. Rosa sees this page too.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function WeekRow({ label, cells }: { label: string; cells: Cell[] }) {
  return (
    <>
      <span className='flex items-center' style={{ fontSize: u(15), fontWeight: 700 }}>
        {label}
      </span>
      {cells.map((cell, i) => (
        <span
          key={i}
          className='tabular flex items-center justify-center'
          style={{
            height: u(46),
            borderRadius: u(12),
            fontSize: u(14),
            gap: u(4),
            background: cell.s === 'on' ? p.greenSoft : cell.s === 'late' ? p.butter : 'transparent',
            border: cell.s === 'none' ? `${u(2)} dashed #D9C9A6` : 'none',
            color: p.ink
          }}
        >
          {cell.s === 'none' ? <TextGlyph size={16} color={p.inkSoft} /> : null}
          {cell.t}
        </span>
      ))}
    </>
  );
}

function Legend({ tone, children }: { tone: Cell['s']; children: ReactNode }) {
  return (
    <span className='flex items-center' style={{ gap: u(6) }}>
      <span
        style={{
          width: u(16),
          height: u(16),
          borderRadius: u(5),
          background: tone === 'on' ? p.greenSoft : tone === 'late' ? p.butter : 'transparent',
          border: tone === 'none' ? `${u(1.5)} dashed #D9C9A6` : 'none'
        }}
      />
      {children}
    </span>
  );
}

function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ padding: `${u(14)} ${u(16)}`, borderRadius: u(16), background: p.white, border: `1px solid ${p.rule}` }}>
      <p style={{ fontSize: u(15), fontWeight: 700 }}>{title}</p>
      <p style={{ fontSize: u(15), lineHeight: 1.35, color: p.inkSoft, marginTop: u(3) }}>{children}</p>
    </div>
  );
}

