import type { HTMLAttributes, ReactNode } from 'react';
import { fontFamily } from '../theme';
import { BlockContent } from './blocks';
import { C, Check, Dot, OpenhandStyles, scale, Wordmark } from './kit';
import {
  BLOCK_NAME,
  BRIEF,
  LIBRARY,
  ORDER,
  type BlockId,
  type DraftState,
  type Status
} from './model';

/*
 * The Openhand page editor: block rail, canvas with the org's brief on top,
 * and the page sheet the agent builds. Design size is 480 × 346 units (the
 * live demo); stills draw it larger with `k`, wider with `width`, and can dock
 * a panel on the right.
 */

export type EditorActions = {
  onKeep(id: BlockId): void;
  onTry(id: BlockId): void;
  onPublish(): void;
  onStartOver(): void;
  onLetFinish(): void;
  onPause(): void;
};

export const SHEET = { width: 386, height: 266 };
export const SLOTS: Record<BlockId, { x: number; y: number; w: number; h: number }> = {
  hero: { x: 10, y: 10, w: 366, h: 50 },
  photo: { x: 10, y: 82, w: 226, h: 72 },
  goal: { x: 248, y: 82, w: 128, h: 72 },
  story: { x: 10, y: 176, w: 226, h: 80 },
  donate: { x: 248, y: 176, w: 128, h: 80 }
};

/** Buttons get a 30-unit touch target and an ember focus ring (see `oh-btn` in kit.tsx). */
const btn = 'oh-btn';

/* Top bar ---------------------------------------------------------------- */

function StatusView({
  k,
  status,
  actions,
  targets,
  animate
}: {
  k: number;
  status: Status;
  actions?: EditorActions;
  targets: boolean;
  animate: boolean;
}) {
  const s = scale(k);
  const text = { fontSize: s(12), fontWeight: 600, color: C.inkSoft, whiteSpace: 'nowrap' as const };
  let body: ReactNode;
  switch (status.kind) {
    case 'drafting':
      body = (
        <>
          <span className={animate ? 'oh-breathe flex' : 'flex'}>
            <Dot size={s(7)} color={C.ember} />
          </span>
          <span style={text}>
            Drafting <span style={{ color: C.ink }}>{BLOCK_NAME[status.block]}</span>
          </span>
        </>
      );
      break;
    case 'paused':
      body = <span style={text}>Agent paused</span>;
      break;
    case 'review':
      body = (
        <>
          <Dot size={s(8)} color={C.vermilion} ring />
          <span style={text}>
            <span style={{ color: C.ink }}>{status.count}</span> to review
          </span>
        </>
      );
      break;
    case 'ready':
      body = (
        <>
          <Dot size={s(7)} color={C.kept} />
          <span style={text}>Ready to publish</span>
        </>
      );
      break;
    case 'published':
      body = (
        <>
          <Check size={s(12)} color={C.kept} weight={2.2} />
          <span style={text}>Live for donors</span>
        </>
      );
      break;
  }
  const toggle = status.kind === 'drafting' || status.kind === 'paused';
  const paused = status.kind === 'paused';
  return (
    <div className='flex items-center' style={{ gap: s(6) }}>
      <span
        className='flex items-center'
        style={{ gap: s(6) }}
        data-target={targets ? 'status' : undefined}
        aria-live='polite'
      >
        {body}
      </span>
      {toggle ? (
        <button
          type='button'
          onClick={paused ? actions?.onLetFinish : actions?.onPause}
          tabIndex={actions ? undefined : -1}
          className={btn}
          style={{
            height: s(22),
            padding: `0 ${s(8)}`,
            borderRadius: s(6),
            fontSize: s(11.5),
            fontWeight: 650,
            whiteSpace: 'nowrap',
            color: paused ? C.ember : C.ink,
            background: C.white,
            boxShadow: `inset 0 0 0 1px ${paused ? C.ember : C.rule}`,
            cursor: 'pointer'
          }}
        >
          {paused ? 'Let it finish' : 'Pause'}
        </button>
      ) : null}
    </div>
  );
}

function TopBar({
  k,
  status,
  actions,
  targets,
  animate
}: {
  k: number;
  status: Status;
  actions?: EditorActions;
  targets: boolean;
  animate: boolean;
}) {
  const s = scale(k);
  const ready = status.kind === 'ready';
  const published = status.kind === 'published';
  return (
    <div
      className='flex shrink-0 items-center'
      style={{
        height: s(34),
        padding: `0 ${s(8)} 0 ${s(12)}`,
        gap: s(10),
        borderBottom: `1px solid ${C.hairline}`,
        background: C.white
      }}
    >
      <Wordmark k={k} size={12.5} />
      <span style={{ width: 1, height: s(14), background: C.hairline }} />
      <span style={{ fontSize: s(12), fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>
        Riverside roof
      </span>
      <span className='flex-1' />
      <StatusView k={k} status={status} actions={actions} targets={targets} animate={animate} />
      <button
        type='button'
        data-target={targets ? 'publish' : undefined}
        disabled={!ready}
        tabIndex={actions ? undefined : -1}
        onClick={actions?.onPublish}
        className={`${btn} flex items-center`}
        style={{
          height: s(24),
          padding: `0 ${s(11)}`,
          gap: s(4),
          borderRadius: s(6),
          fontSize: s(12),
          fontWeight: 700,
          whiteSpace: 'nowrap',
          cursor: ready ? 'pointer' : 'default',
          color: ready || published ? C.white : C.inkSoft,
          background: published ? C.kept : ready ? C.ember : C.rule,
          transition: 'background-color 240ms ease, color 240ms ease'
        }}
      >
        {published ? <Check size={s(11)} weight={2.4} /> : null}
        {published ? 'Published' : 'Publish'}
      </button>
    </div>
  );
}

/* Rail ------------------------------------------------------------------- */

function Rail({
  k,
  state,
  actions,
  targets
}: {
  k: number;
  state: DraftState;
  actions?: EditorActions;
  targets: boolean;
}) {
  const s = scale(k);
  return (
    <div
      className='relative flex shrink-0 flex-col'
      style={{ width: s(74), padding: `${s(10)} ${s(7)}`, background: C.white, borderRight: `1px solid ${C.hairline}` }}
    >
      <div style={{ padding: `0 ${s(5)}`, fontSize: s(11), fontWeight: 650, color: C.inkSoft, whiteSpace: 'nowrap' }}>
        12 blocks
      </div>
      <ul style={{ marginTop: s(6) }} aria-label='Openhand blocks'>
        {LIBRARY.map((item, i) => {
          const block = item.id ? state.blocks[item.id] : undefined;
          const used = block && block.status !== 'empty';
          const active = item.id && state.carrying === item.id;
          return (
            <li
              key={item.name}
              data-target={targets && item.id ? `rail-${item.id}` : undefined}
              className='flex items-center justify-between'
              style={{
                height: s(18),
                padding: `0 ${s(5)}`,
                marginTop: i === 5 ? s(9) : 0,
                borderRadius: s(4),
                fontSize: s(11.5),
                fontWeight: used || active ? 650 : 500,
                color: active ? C.ember : used ? C.ink : C.inkSoft,
                background: active ? C.peach : 'transparent',
                transition: 'background-color 160ms ease, color 160ms ease'
              }}
            >
              {item.name}
              {block?.status === 'kept' ? (
                <Dot size={s(6)} color={C.kept} />
              ) : used ? (
                <Dot size={s(7)} color={C.vermilion} ring />
              ) : null}
            </li>
          );
        })}
      </ul>
      {actions ? (
        <div className='absolute' style={{ left: s(7), right: s(7), bottom: s(10) }}>
        <button
          type='button'
          onClick={actions.onStartOver}
          data-target={targets ? 'start-over' : undefined}
          aria-label='Start over: clear the page and watch the agent draft it again'
          className={`${btn} w-full`}
          style={{
            height: s(24),
            borderRadius: s(6),
            fontSize: s(11.5),
            fontWeight: 650,
            color: C.ink,
            background: C.white,
            boxShadow: `inset 0 0 0 1px ${C.rule}`,
            cursor: 'pointer'
          }}
        >
          Start over
        </button>
        </div>
      ) : null}
    </div>
  );
}

/* Canvas ----------------------------------------------------------------- */

function BriefChip({ k, reading, targets }: { k: number; reading: boolean; targets: boolean }) {
  const s = scale(k);
  const fact = {
    fontWeight: 650,
    textDecorationLine: 'underline',
    textDecorationColor: C.vermilion,
    textDecorationThickness: s(1.5),
    textUnderlineOffset: s(2.5),
    fontVariantNumeric: 'tabular-nums'
  } as const;
  return (
    <div
      className='inline-flex items-center'
      style={{
        height: s(22),
        padding: `0 ${s(10)} 0 ${s(4)}`,
        gap: s(7),
        borderRadius: s(11),
        background: C.white,
        boxShadow: `0 0 0 1px ${C.rule}`,
        fontSize: s(11.5),
        color: C.ink,
        whiteSpace: 'nowrap'
      }}
    >
      <span
        style={{
          height: s(15),
          padding: `0 ${s(6)}`,
          borderRadius: s(8),
          background: C.ember,
          color: C.white,
          fontSize: s(11),
          fontWeight: 700,
          lineHeight: s(15)
        }}
      >
        Brief
      </span>
      <span>
        {BRIEF.before}
        <span
          data-target={targets ? 'brief-amount' : undefined}
          key={reading ? 'reading' : 'idle'}
          className={reading ? 'oh-glow' : undefined}
          style={{ ...fact, borderRadius: s(3), padding: `0 ${s(1.5)}`, margin: `0 ${s(-1.5)}` }}
        >
          {BRIEF.amount}
        </span>
        {BRIEF.middle}
        <span style={fact}>{BRIEF.date}</span>
        {BRIEF.after}
      </span>
    </div>
  );
}

function Tabs({
  k,
  id,
  inside,
  actions,
  targets
}: {
  k: number;
  id: BlockId;
  inside: boolean;
  actions?: EditorActions;
  targets: boolean;
}) {
  const s = scale(k);
  const name = BLOCK_NAME[id].toLowerCase();
  const button = {
    height: s(18),
    padding: `0 ${s(7)}`,
    borderRadius: s(5),
    fontSize: s(11),
    fontWeight: 650,
    lineHeight: 1,
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer'
  };
  return (
    <div
      className='absolute flex'
      style={{
        gap: s(3),
        right: inside ? s(6) : 0,
        zIndex: 4,
        ...(inside ? { top: s(6) } : { bottom: '100%', marginBottom: s(2) })
      }}
    >
      <button
        type='button'
        data-target={targets ? `keep-${id}` : undefined}
        aria-label={`Keep the ${name}`}
        tabIndex={actions ? undefined : -1}
        onClick={actions ? () => actions.onKeep(id) : undefined}
        className={btn}
        style={{ ...button, background: C.ember, color: C.white }}
      >
        Keep
      </button>
      <button
        type='button'
        data-target={targets ? `try-${id}` : undefined}
        aria-label={`Try another ${name}`}
        tabIndex={actions ? undefined : -1}
        onClick={actions ? () => actions.onTry(id) : undefined}
        className={btn}
        style={{ ...button, background: C.white, color: C.ember, boxShadow: `inset 0 0 0 1px ${C.rule}` }}
      >
        Try another
      </button>
    </div>
  );
}

function BlockFrame({
  k,
  id,
  state,
  actions,
  targets,
  animate
}: {
  k: number;
  id: BlockId;
  state: DraftState;
  actions?: EditorActions;
  targets: boolean;
  animate: boolean;
}) {
  const s = scale(k);
  const slot = SLOTS[id];
  const block = state.blocks[id];
  const pending = block.status === 'pending';
  const drafting = block.status === 'drafting';
  const dropping = block.status === 'empty' && state.carrying === id;
  const agent = pending || drafting;
  const name = BLOCK_NAME[id];
  return (
    <div
      role='group'
      aria-label={
        block.status === 'empty'
          ? undefined
          : `${name} block, ${block.status === 'kept' ? 'kept' : 'agent draft, waiting for you'}`
      }
      data-target={targets ? `slot-${id}` : undefined}
      className='absolute'
      style={{
        left: s(slot.x),
        top: s(slot.y),
        width: s(slot.w),
        height: s(slot.h),
        borderRadius: s(7),
        outlineStyle: 'dashed',
        outlineWidth: s(1.5),
        outlineOffset: 0,
        outlineColor: agent ? C.vermilion : dropping ? 'rgba(232,85,47,.55)' : 'rgba(232,85,47,0)',
        background: agent ? C.tint : dropping ? 'rgba(232,85,47,.06)' : 'rgba(254,245,241,0)',
        transition: 'outline-color 280ms ease, background-color 280ms ease'
      }}
    >
      {block.status === 'empty' || (drafting && id !== 'hero') ? (
        dropping ? (
          <span
            className='absolute inset-0 flex items-center justify-center'
            style={{ fontSize: s(11), fontWeight: 650, color: C.ember }}
          >
            {name}
          </span>
        ) : null
      ) : (
        <BlockContent
          id={id}
          k={k}
          variant={block.variant}
          typed={id === 'hero' ? state.typed : null}
          animate={animate && agent}
        />
      )}
      {drafting && id !== 'hero' ? (
        <span
          className={animate ? 'oh-breathe absolute' : 'absolute'}
          style={{ left: s(10), top: s(9), fontSize: s(11), fontWeight: 650, color: C.ember }}
        >
          Drafting {name.toLowerCase()}
        </span>
      ) : null}
      {pending ? <Tabs k={k} id={id} inside={id === 'hero'} actions={actions} targets={targets} /> : null}
      {state.justKept === id && block.status === 'kept' && animate ? (
        <span
          className='oh-kept absolute flex items-center'
          style={{
            right: id === 'hero' ? s(6) : 0,
            ...(id === 'hero' ? { top: s(6) } : { bottom: '100%', marginBottom: s(2) }),
            gap: s(3),
            height: s(18),
            padding: `0 ${s(7)} 0 ${s(5)}`,
            borderRadius: s(9),
            background: C.kept,
            color: C.white,
            fontSize: s(11),
            fontWeight: 650,
            zIndex: 4
          }}
        >
          <Check size={s(10)} weight={2.4} />
          Kept
        </span>
      ) : null}
    </div>
  );
}

function PublishedPill({ k }: { k: number }) {
  const s = scale(k);
  return (
    <div
      role='status'
      className='oh-in inline-flex items-center'
      style={{
        height: s(22),
        gap: s(6),
        padding: `0 ${s(11)} 0 ${s(4)}`,
        borderRadius: s(11),
        background: C.ink,
        color: C.white,
        fontSize: s(11.5),
        fontWeight: 600,
        whiteSpace: 'nowrap'
      }}
    >
      <span
        className='flex items-center justify-center'
        style={{ width: s(15), height: s(15), borderRadius: '50%', background: C.kept }}
      >
        <Check size={s(9.5)} weight={2.6} />
      </span>
      Published to openhand.org/riverside-roof
    </div>
  );
}

/* Editor ----------------------------------------------------------------- */

export function Editor({
  k = 1,
  width = 480,
  height = 346,
  state,
  status,
  actions,
  targets = false,
  animate = false,
  panel,
  panelWidth = 0,
  sheetOverlay,
  canvasProps,
  canvasTop = 0
}: {
  k?: number;
  width?: number;
  height?: number;
  state: DraftState;
  status: Status;
  actions?: EditorActions;
  targets?: boolean;
  animate?: boolean;
  panel?: ReactNode;
  panelWidth?: number;
  /** Drawn on top of the page sheet, in sheet design units. */
  sheetOverlay?: ReactNode;
  canvasProps?: HTMLAttributes<HTMLDivElement>;
  /** Extra space above the brief and page, for tall compositions. */
  canvasTop?: number;
}) {
  const s = scale(k);
  return (
    <div
      className='relative flex flex-col'
      style={{ width: s(width), height: s(height), background: C.white, color: C.ink, fontFamily }}
    >
      <OpenhandStyles />
      <TopBar k={k} status={status} actions={actions} targets={targets} animate={animate} />
      <div className='flex min-h-0 flex-1'>
        <Rail k={k} state={state} actions={actions} targets={targets} />
        <div
          {...canvasProps}
          className='relative min-w-0 flex-1'
          style={{
            background: C.canvas,
            backgroundImage: `radial-gradient(circle, ${C.rule} ${s(0.9)}, transparent ${s(1.1)})`,
            backgroundSize: `${s(12)} ${s(12)}`
          }}
        >
          <div className='flex justify-center' style={{ paddingTop: s(8 + canvasTop) }}>
            {state.published ? (
              <PublishedPill k={k} />
            ) : (
              <BriefChip k={k} reading={state.reading} targets={targets} />
            )}
          </div>
          <div
            className='relative'
            style={{
              margin: `${s(8)} auto 0`,
              width: s(SHEET.width),
              height: s(SHEET.height),
              borderRadius: s(8),
              background: C.white,
              boxShadow: `0 0 0 1px ${C.hairline}, 0 ${s(6)} ${s(18)} ${s(-10)} rgba(43,26,20,.28)`
            }}
          >
            {ORDER.map((id) => (
              <BlockFrame
                key={id}
                k={k}
                id={id}
                state={state}
                actions={actions}
                targets={targets}
                animate={animate}
              />
            ))}
            {ORDER.every((id) => state.blocks[id].status === 'empty') ? (
              <div
                className='pointer-events-none absolute inset-x-0 text-center'
                style={{ top: s(118), fontSize: s(12), fontWeight: 600, color: C.inkSoft }}
              >
                Drafting from your brief, one block at a time
              </div>
            ) : null}
            {sheetOverlay}
          </div>
        </div>
        {panel ? (
          <div className='relative shrink-0' style={{ width: s(panelWidth), borderLeft: `1px solid ${C.hairline}`, background: C.white }}>
            {panel}
          </div>
        ) : null}
      </div>
    </div>
  );
}
