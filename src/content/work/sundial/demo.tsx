import { useEffect, useId, useMemo, useReducer, useRef, useState } from 'react';
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent
} from 'react';
import { DemoCursor, useDirector } from '~/components/demo/director';
import { Stage, at, u } from '~/components/stage';
import { cn } from '~/lib/utils';
import type { DemoProps } from '~/content/types';
import {
  DATES,
  DAYS,
  DRAFT,
  FINISHED,
  PINNED,
  ROOM_ORDER,
  TIMES,
  classById,
  classes,
  resolve,
  roomShort,
  slotLong,
  teachers
} from './data';
import type { Message, Move, Positions, Slot } from './data';
import { fontFamily, palette } from './theme';
import { AlertGlyph, ArrowGlyph, CheckGlyph, PinGlyph, PlusGlyph, ResetGlyph, SundialMark } from './ui';

/* ---------------------------------------------------------------- geometry */
// Stage units. The window sits on the cobalt panel; everything below is in
// window coordinates.

const WIN = { x: 20, y: 20, w: 480, h: 376 };
const TOOLBAR_H = 38;
const HEAD_H = 20;
const GUTTER = 32;
const COL_W = (WIN.w - GUTTER - 10) / 5;
const ROW_H = 68;
const GRID_Y = TOOLBAR_H + HEAD_H;
const BAR_Y = GRID_Y + ROW_H * TIMES.length;
const BAR_H = WIN.h - BAR_Y;
const INSET = 2;
const GAP = 2;
const LANE_W = COL_W - INSET * 2;
const COMPACT_H = (ROW_H - INSET * 2 - GAP) / 2;
const TRAY = { x: WIN.w - 10 - LANE_W, y: BAR_Y + (BAR_H - COMPACT_H) / 2 };
/** Where the loop's cursor holds a block, as a fraction of its size. */
const GRAB: [number, number] = [0.3, 0.55];
const SOLVE_DELAY = 1250;

type Mode = 'full' | 'compact' | 'tiny';
type Rect = { x: number; y: number; w: number; h: number; mode: Mode };

const cellX = (day: number) => GUTTER + day * COL_W;
const cellY = (time: number) => GRID_Y + time * ROW_H;

/** Where every class sits: each class in a cell gets a lane, grouped by room, newest last. */
function layout(pos: Positions, last: string | null): Record<string, Rect> {
  const rects: Record<string, Rect> = {};
  const cells = new Map<string, string[]>();
  for (const klass of classes) {
    const slot = pos[klass.id];
    if (!slot) {
      rects[klass.id] = { x: TRAY.x, y: TRAY.y, w: LANE_W, h: COMPACT_H, mode: 'compact' };
      continue;
    }
    const key = `${slot.day}-${slot.time}`;
    cells.set(key, [...(cells.get(key) ?? []), klass.id]);
  }
  for (const [key, ids] of cells) {
    const [day, time] = key.split('-').map(Number);
    const rank = (id: string) => ROOM_ORDER.indexOf(classById[id].room) * 2 + (id === last ? 1 : 0);
    const lanes = [...ids].sort((a, b) => rank(a) - rank(b));
    const laneH = (ROW_H - INSET * 2 - GAP * (lanes.length - 1)) / lanes.length;
    const mode: Mode = lanes.length === 1 ? 'full' : lanes.length === 2 ? 'compact' : 'tiny';
    lanes.forEach((id, lane) => {
      rects[id] = {
        x: cellX(day) + INSET,
        y: cellY(time) + INSET + lane * (laneH + GAP),
        w: LANE_W,
        h: laneH,
        mode
      };
    });
  }
  return rects;
}

function hitSlot(x: number, y: number): Slot | null {
  const day = Math.floor((x - GUTTER) / COL_W);
  const time = Math.floor((y - GRID_Y) / ROW_H);
  if (day < 0 || day >= DAYS.length || time < 0 || time >= TIMES.length) return null;
  return { day, time };
}

/* ------------------------------------------------------------------- state */

type State = {
  pos: Positions;
  pinned: Record<string, boolean>;
  last: string | null;
  conflict: boolean;
  clash: string[];
  blockers: string[];
  pending: { pos: Positions; moves: Move[]; result: Message } | null;
  moved: string[];
  message: Message;
  lifted: string | null;
  carry: { id: string; x: number; y: number; duration: number } | null;
  /** How the next layout change should animate. */
  motion: 'glide' | 'settle';
  seq: number;
};

const FINISHED_STATE: State = {
  pos: FINISHED.pos,
  pinned: PINNED,
  last: 'raku',
  conflict: false,
  clash: [],
  blockers: [],
  pending: null,
  moved: FINISHED.moves.map((m) => m.id),
  message: FINISHED.result,
  lifted: null,
  carry: null,
  motion: 'glide',
  seq: 0
};

const DRAFT_MESSAGE: Message = {
  tone: 'draft',
  title: '1 new class to place',
  detail: 'Drag Raku Firing onto the week, or focus it and press Enter'
};

type Action =
  | { type: 'rewind' }
  | { type: 'lift'; id: string }
  | { type: 'carry'; id: string; x: number; y: number; duration: number }
  | { type: 'cancel' }
  | { type: 'drop'; id: string; slot: Slot }
  | { type: 'solve' }
  | { type: 'pin'; id: string }
  | { type: 'clearBlockers' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'rewind':
      return {
        ...FINISHED_STATE,
        pos: DRAFT,
        last: null,
        moved: [],
        message: DRAFT_MESSAGE,
        motion: 'glide',
        seq: state.seq + 1
      };
    case 'lift':
      return { ...state, lifted: action.id };
    case 'carry':
      return { ...state, lifted: action.id, carry: action };
    case 'cancel':
      return { ...state, lifted: null, carry: null, motion: 'settle' };
    case 'drop': {
      const base = { ...state, lifted: null, carry: null, motion: 'settle' as const, seq: state.seq + 1 };
      const current = state.pos[action.id];
      if (current && current.day === action.slot.day && current.time === action.slot.time) {
        return base;
      }
      const result = resolve(state.pos, state.pinned, action.id, action.slot);
      if (!result.ok) {
        return { ...base, blockers: result.blockers, message: result.message, moved: [] };
      }
      if (result.clash.length) {
        return {
          ...base,
          pos: { ...state.pos, [action.id]: action.slot },
          last: action.id,
          conflict: true,
          clash: result.clash,
          blockers: [],
          pending: { pos: result.pos, moves: result.moves, result: result.result },
          moved: [],
          message: result.conflict ?? result.result
        };
      }
      return {
        ...base,
        pos: result.pos,
        last: action.id,
        conflict: false,
        clash: [],
        blockers: [],
        moved: [],
        message: result.result
      };
    }
    case 'solve': {
      if (!state.pending) return state;
      return {
        ...state,
        pos: state.pending.pos,
        conflict: false,
        clash: [],
        pending: null,
        moved: state.pending.moves.map((m) => m.id),
        message: state.pending.result,
        motion: 'glide',
        seq: state.seq + 1
      };
    }
    case 'pin': {
      const klass = classById[action.id];
      const slot = state.pos[action.id];
      if (!slot || state.conflict) return state;
      const pinned = !state.pinned[action.id];
      return {
        ...state,
        pinned: { ...state.pinned, [action.id]: pinned },
        blockers: [],
        message: pinned
          ? {
              tone: 'info',
              title: `${klass.name} is pinned to ${slotLong(slot)}`,
              detail: 'The solver will route other classes around it.'
            }
          : {
              tone: 'info',
              title: `${klass.name} is unpinned`,
              detail: 'The solver may move it to make room.'
            }
      };
    }
    case 'clearBlockers':
      return { ...state, blockers: [] };
  }
}

/* -------------------------------------------------------------------- demo */

export default function SundialDemo(_props: DemoProps) {
  const [state, dispatch] = useReducer(reducer, FINISHED_STATE);
  const hintId = useId();

  const d = useDirector(async (x) => {
    await x.wait(1800);
    x.hide();
    dispatch({ type: 'rewind' });
    await x.wait(1300);
    await x.appear({ x: 330, y: 250 });
    await x.move('class-raku', { anchor: GRAB });
    await x.wait(140);
    x.down();
    dispatch({ type: 'lift', id: 'raku' });
    await x.wait(220);
    const target = x.point('cell-1-1', { anchor: [0.34, 0.36] });
    const duration = 1100;
    dispatch({
      type: 'carry',
      id: 'raku',
      x: target.x - WIN.x - GRAB[0] * LANE_W,
      y: target.y - WIN.y - GRAB[1] * COMPACT_H,
      duration
    });
    await x.move(target, { duration });
    await x.wait(140);
    x.up();
    dispatch({ type: 'drop', id: 'raku', slot: { day: 1, time: 1 } });
    await x.wait(420);
    await x.move({ x: WIN.x + WIN.w - 70, y: WIN.y + BAR_Y + BAR_H / 2 + 4 }, { duration: 800 });
    await x.wait(SOLVE_DELAY + 1400);
    x.hide();
    await x.wait(1600);
  });

  // The solver runs a beat after a conflict appears, so you see what collided.
  useEffect(() => {
    if (!state.conflict) return;
    const id = setTimeout(() => dispatch({ type: 'solve' }), SOLVE_DELAY);
    return () => clearTimeout(id);
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- each new conflict (seq) restarts the solver's beat
  }, [state.conflict, state.seq]);

  useEffect(() => {
    if (!state.blockers.length) return;
    const id = setTimeout(() => dispatch({ type: 'clearBlockers' }), 1800);
    return () => clearTimeout(id);
  }, [state.blockers]);

  // If a visitor takes over mid-drag, put the class down where it came from.
  useEffect(() => {
    if (!d.playing && (state.carry || state.lifted)) dispatch({ type: 'cancel' });
  }, [d.playing, state.carry, state.lifted]);

  const rects = useMemo(() => layout(state.pos, state.last), [state.pos, state.last]);

  /* Visitor dragging */
  const drag = useRef<{
    id: string;
    pointerId: number;
    startX: number;
    startY: number;
    left: number;
    top: number;
    scale: number;
    grabX: number;
    grabY: number;
    active: boolean;
  } | null>(null);
  const [dragging, setDragging] = useState<{ id: string; x: number; y: number; over: Slot | null } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  /** A class picked up with the keyboard, and the slot it would drop into. */
  const [keyMove, setKeyMove] = useState<{ id: string; slot: Slot } | null>(null);

  const aim = dragging?.over ? { id: dragging.id, slot: dragging.over } : keyMove;
  const preview = useMemo(() => {
    if (!aim) return null;
    const result = resolve(state.pos, state.pinned, aim.id, aim.slot);
    return { id: aim.id, slot: aim.slot, result };
    // oxlint-disable-next-line react-hooks/exhaustive-deps, react/memo-dependencies -- keyed on the aim's fields so a new object for the same slot doesn't re-solve
  }, [aim?.id, aim?.slot.day, aim?.slot.time, state.pos, state.pinned]);

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    if (event.button !== 0 || state.conflict) return;
    // On touch, the first tap selects; a selected class can then be dragged.
    if (event.pointerType === 'touch' && selected !== id) return;
    const root = d.rootRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const scale = box.width / 520;
    const rect = rects[id];
    const px = (event.clientX - box.left) / scale - WIN.x;
    const py = (event.clientY - box.top) / scale - WIN.y;
    drag.current = {
      id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: box.left,
      top: box.top,
      scale,
      grabX: px - rect.x,
      grabY: py - rect.y,
      active: false
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const g = drag.current;
    if (!g || g.pointerId !== event.pointerId) return;
    if (!g.active && Math.hypot(event.clientX - g.startX, event.clientY - g.startY) < 4) return;
    g.active = true;
    const px = (event.clientX - g.left) / g.scale - WIN.x;
    const py = (event.clientY - g.top) / g.scale - WIN.y;
    setDragging({ id: g.id, x: px - g.grabX, y: py - g.grabY, over: hitSlot(px, py) });
  };

  const endDrag = (event: ReactPointerEvent<HTMLButtonElement>, commit: boolean) => {
    const g = drag.current;
    if (!g || g.pointerId !== event.pointerId) return;
    drag.current = null;
    if (g.active) {
      const px = (event.clientX - g.left) / g.scale - WIN.x;
      const py = (event.clientY - g.top) / g.scale - WIN.y;
      const slot = commit ? hitSlot(px, py) : null;
      if (slot) dispatch({ type: 'drop', id: g.id, slot });
      else dispatch({ type: 'cancel' });
    }
    setDragging(null);
  };

  const firstFit = (id: string): Slot => {
    for (let day = 0; day < DAYS.length; day++) {
      for (let time = 0; time < TIMES.length; time++) {
        const r = resolve(state.pos, state.pinned, id, { day, time });
        if (r.ok && !r.clash.length) return { day, time };
      }
    }
    return { day: 0, time: 0 };
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (state.conflict) return;
    const slot = state.pos[id];
    const step: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1]
    };
    const delta = step[event.key];
    const confirm = event.key === 'Enter' || event.key === ' ';
    const carrying = keyMove?.id === id ? keyMove : null;

    if (carrying) {
      if (delta) {
        event.preventDefault();
        setKeyMove({
          id,
          slot: {
            day: Math.min(DAYS.length - 1, Math.max(0, carrying.slot.day + delta[0])),
            time: Math.min(TIMES.length - 1, Math.max(0, carrying.slot.time + delta[1]))
          }
        });
      } else if (confirm) {
        event.preventDefault();
        setKeyMove(null);
        dispatch({ type: 'drop', id, slot: carrying.slot });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setKeyMove(null);
      }
      return;
    }

    if ((event.key === 'p' || event.key === 'P') && slot) {
      event.preventDefault();
      dispatch({ type: 'pin', id });
      return;
    }
    if (delta || confirm) {
      // Pick it up. Arrows aim, Enter drops, Escape puts it back.
      event.preventDefault();
      const from = slot ?? firstFit(id);
      setKeyMove({
        id,
        slot: delta && slot
          ? {
              day: Math.min(DAYS.length - 1, Math.max(0, from.day + delta[0])),
              time: Math.min(TIMES.length - 1, Math.max(0, from.time + delta[1]))
            }
          : from
      });
    }
  };

  const aimMessage: Message | null =
    keyMove && preview
      ? preview.result.ok
        ? {
            tone: 'move',
            title: `${classById[keyMove.id].name} → ${slotLong(keyMove.slot)}`,
            detail: preview.result.moves.length
              ? `Enter to drop. ${preview.result.moves.length === 1 ? '1 class' : `${preview.result.moves.length} classes`} will move. Esc cancels.`
              : 'Enter to drop here, Esc to cancel'
          }
        : preview.result.message
      : null;

  const message = aimMessage ?? state.message;
  const trayBusy = classes.some((c) => !state.pos[c.id]);

  return (
    <Stage width={520} height={416} innerRef={d.rootRef} style={{ fontFamily, color: palette.ink }}>
      <div
        className='absolute flex flex-col overflow-hidden'
        style={{
          left: u(WIN.x),
          top: u(WIN.y),
          width: u(WIN.w),
          height: u(WIN.h),
          borderRadius: u(12),
          background: palette.paper,
          boxShadow: `0 ${u(20)} ${u(44)} ${u(-18)} rgba(8,18,70,.6), 0 ${u(2)} ${u(6)} rgba(8,18,70,.18)`
        }}
      >
        {/* Toolbar */}
        <div
          className='flex shrink-0 items-center'
          style={{ height: u(TOOLBAR_H), paddingInline: u(12), gap: u(10), borderBottom: `1px solid ${palette.rule}` }}
        >
          <div className='flex items-center' style={{ gap: u(6) }}>
            <SundialMark size={16} />
            <span style={{ fontSize: u(14), fontWeight: 600, letterSpacing: '-0.01em' }}>Sundial</span>
          </div>
          <span aria-hidden style={{ width: 1, height: u(16), background: palette.rule }} />
          <span style={{ fontSize: u(12), fontWeight: 600 }}>Fall 2024</span>
          <span
            style={{
              fontSize: u(11),
              fontWeight: 600,
              color: palette.cobaltDeep,
              background: palette.ice,
              padding: `${u(2)} ${u(6)}`,
              borderRadius: u(4),
              marginLeft: u(-4)
            }}
          >
            Draft
          </span>
          <span style={{ fontSize: u(12), color: palette.inkSoft }}>Ground floor · 5 of 14 rooms</span>
          <button
            type='button'
            onClick={() => dispatch({ type: 'rewind' })}
            className='ml-auto flex items-center focus-visible:outline-2 focus-visible:outline-offset-2'
            style={{
              height: u(30),
              paddingInline: u(10),
              gap: u(6),
              borderRadius: u(7),
              border: `1px solid ${palette.rule}`,
              fontSize: u(12),
              fontWeight: 500,
              color: palette.ink,
              background: palette.paper,
              outlineColor: palette.cobalt,
              cursor: 'pointer'
            }}
          >
            <ResetGlyph size={12} color={palette.inkSoft} />
            Reset week
          </button>
        </div>

        {/* Day header */}
        <div className='relative shrink-0' style={{ height: u(HEAD_H), borderBottom: `1px solid ${palette.rule}` }}>
          {DAYS.map((day, i) => (
            <span
              key={day}
              className='absolute tabular'
              style={{ left: u(cellX(i) + 7), top: u(3), fontSize: u(12), lineHeight: 1.2 }}
            >
              <span style={{ fontWeight: 600 }}>{day}</span>{' '}
              <span style={{ color: palette.inkSoft }}>{DATES[i]}</span>
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className='relative shrink-0' style={{ height: u(ROW_H * TIMES.length) }}>
          {TIMES.map((time, t) => (
            <span
              key={time}
              className='absolute tabular'
              style={{
                left: 0,
                width: u(GUTTER - 6),
                top: u(t * ROW_H + 4),
                textAlign: 'right',
                fontSize: u(11),
                fontWeight: 500,
                color: palette.inkSoft
              }}
            >
              {time}
            </span>
          ))}
          {TIMES.map((_, t) =>
            DAYS.map((_day, dIndex) => (
              <div
                key={`${dIndex}-${t}`}
                data-target={`cell-${dIndex}-${t}`}
                className='absolute'
                style={{
                  left: u(cellX(dIndex)),
                  top: u(t * ROW_H),
                  width: u(COL_W),
                  height: u(ROW_H),
                  borderLeft: `1px solid ${palette.rule}`,
                  borderTop: t ? `1px solid ${palette.rule}` : undefined
                }}
              />
            ))
          )}
        </div>

        {/* Status bar */}
        <div
          role='status'
          aria-live='polite'
          className='absolute flex items-center'
          style={{
            left: 0,
            right: 0,
            top: u(BAR_Y),
            height: u(BAR_H),
            paddingLeft: u(12),
            paddingRight: u(LANE_W + 22),
            gap: u(9),
            borderTop: `1px solid ${palette.rule}`,
            background: message.tone === 'conflict' || message.tone === 'blocked' ? '#FFF8F7' : '#FAFBFE',
            transition: 'background-color 200ms ease'
          }}
        >
          {message.tone === 'ok' ? (
            <CheckGlyph size={15} />
          ) : message.tone === 'conflict' || message.tone === 'blocked' ? (
            <AlertGlyph size={15} />
          ) : message.tone === 'draft' ? (
            <PlusGlyph size={15} />
          ) : message.tone === 'move' ? (
            <span
              className='flex shrink-0 items-center justify-center'
              style={{ width: u(15), height: u(15), borderRadius: '50%', background: palette.cobalt }}
            >
              <ArrowGlyph size={10} color='#fff' />
            </span>
          ) : (
            <PinGlyph pinned size={14} color={palette.cobalt} />
          )}
          <div className='min-w-0'>
            <p
              className='truncate'
              style={{
                fontSize: u(13),
                fontWeight: 600,
                lineHeight: 1.2,
                color: message.tone === 'conflict' || message.tone === 'blocked' ? '#B42A1B' : palette.ink
              }}
            >
              {message.title}
            </p>
            {message.detail ? (
              <p className='truncate' style={{ fontSize: u(12), lineHeight: 1.25, color: palette.inkSoft, marginTop: u(1) }}>
                {message.detail}
              </p>
            ) : null}
          </div>
        </div>
        {!trayBusy ? (
          <p
            aria-hidden
            className='absolute text-right'
            style={{
              right: u(12),
              top: u(BAR_Y + 10),
              fontSize: u(11),
              lineHeight: 1.25,
              color: palette.inkSoft,
              opacity: d.engaged ? 1 : 0,
              transition: 'opacity 200ms ease'
            }}
          >
            {d.canHover ? (
              <>
                Drag to move
                <br />
                <span style={{ fontWeight: 600, color: palette.ink }}>P</span> to pin
              </>
            ) : (
              <>
                Tap a class,
                <br />
                then drag it
              </>
            )}
          </p>
        ) : null}

        {/* Drop preview */}
        {preview ? (
          <div
            aria-hidden
            className='absolute'
            style={{
              left: u(cellX(preview.slot.day) + 1),
              top: u(cellY(preview.slot.time) + 1),
              width: u(COL_W - 1),
              height: u(ROW_H - 1),
              border: `${u(1.5)} dashed ${preview.result.ok ? palette.cobalt : palette.conflict}`,
              background: preview.result.ok ? 'rgba(36,72,216,.07)' : 'rgba(214,58,42,.07)',
              borderRadius: u(6),
              zIndex: 35
            }}
          />
        ) : null}

        {/* Classes */}
        {classes.map((klass) => {
          const rect = rects[klass.id];
          const slot = state.pos[klass.id];
          const isDragging = dragging?.id === klass.id;
          const isAimed = keyMove?.id === klass.id;
          const isCarried = state.carry?.id === klass.id;
          const lifted = isDragging || isCarried || isAimed || state.lifted === klass.id;
          const x = isDragging ? dragging.x : isCarried ? state.carry!.x : isAimed ? cellX(keyMove.slot.day) + INSET + 2 : rect.x;
          const y = isDragging ? dragging.y : isCarried ? state.carry!.y : isAimed ? cellY(keyMove.slot.time) + 18 : rect.y;
          const moved = state.moved.includes(klass.id);
          const order = state.moved.indexOf(klass.id);
          const transition = isDragging
            ? 'box-shadow 160ms ease'
            : isAimed
              ? 'transform 220ms var(--ease-settle), width 180ms ease, height 180ms ease, box-shadow 160ms ease'
            : isCarried
              ? `transform ${state.carry!.duration}ms var(--ease-glide), box-shadow 160ms ease`
              : moved || state.motion === 'glide'
                ? `transform 700ms var(--ease-glide) ${moved ? order * 140 : 0}ms, width 320ms ease ${moved ? 300 : 0}ms, height 320ms ease ${moved ? 300 : 0}ms, box-shadow 200ms ease`
                : 'transform 300ms var(--ease-settle), width 260ms ease, height 260ms ease, box-shadow 200ms ease';
          return (
            <ClassBlock
              key={klass.id}
              id={klass.id}
              rect={isAimed ? { ...rect, w: LANE_W, h: COMPACT_H, mode: 'compact' } : rect}
              style={{
                transform: `${at(x, y)}${lifted ? ' scale(1.04)' : ''}`,
                transition,
                zIndex: lifted ? 40 : moved ? 20 : 10
              }}
              slot={slot}
              pinned={!!state.pinned[klass.id]}
              clash={state.clash.includes(klass.id) || state.blockers.includes(klass.id)}
              moved={moved}
              lifted={lifted}
              selected={selected === klass.id}
              hintId={hintId}
              onPin={() => dispatch({ type: 'pin', id: klass.id })}
              bodyProps={{
                onPointerDown: (event) => onPointerDown(event, klass.id),
                onPointerMove,
                onPointerUp: (event) => endDrag(event, true),
                onPointerCancel: (event) => endDrag(event, false),
                onKeyDown: (event) => onKeyDown(event, klass.id),
                onFocus: () => setSelected(klass.id),
                onBlur: () => {
                  setSelected((current) => (current === klass.id ? null : current));
                  setKeyMove((current) => (current?.id === klass.id ? null : current));
                }
              }}
            />
          );
        })}
      </div>
      <span id={hintId} className='sr-only'>
        Drag it to a new slot. Or press an arrow key to pick it up, use the arrows to choose a slot, and press Enter to drop it. Press P to pin it in place.
      </span>
      <DemoCursor cursor={d.cursor} label='Ines' color={palette.ink} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ pieces */

function ClassBlock({
  id,
  rect,
  style,
  slot,
  pinned,
  clash,
  moved,
  lifted,
  selected,
  hintId,
  onPin,
  bodyProps
}: {
  id: string;
  rect: Rect;
  style: CSSProperties;
  slot: Slot | null;
  pinned: boolean;
  clash: boolean;
  moved: boolean;
  lifted: boolean;
  selected: boolean;
  hintId: string;
  onPin: () => void;
  bodyProps: ButtonHTMLAttributes<HTMLButtonElement>;
}) {
  const klass = classById[id];
  const room = palette.rooms[klass.room];
  const teacher = teachers[klass.teacher];
  const ring = clash
    ? `0 0 0 ${u(2)} ${palette.conflict}`
    : moved
      ? `0 0 0 ${u(1.75)} ${palette.cobalt}`
      : `inset 0 0 0 1px color-mix(in srgb, ${room.ink} ${pinned ? 38 : 14}%, transparent)`;
  const shadow = lifted ? `, 0 ${u(10)} ${u(20)} ${u(-6)} rgba(18,26,51,.35)` : '';
  const where = slot ? slotLong(slot) : 'not placed yet';
  return (
    <div
      data-target={`class-${id}`}
      className='group absolute left-0 top-0'
      style={{ width: u(rect.w), height: u(rect.h), ...style }}
    >
      <button
        type='button'
        aria-label={`${klass.name}, ${teacher.short}, ${room.name}, ${where}${pinned ? ', pinned' : ''}`}
        aria-describedby={hintId}
        aria-keyshortcuts={slot ? 'ArrowLeft ArrowRight ArrowUp ArrowDown Enter Escape P' : 'Enter'}
        className='absolute inset-0 overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-offset-2'
        style={{
          borderRadius: u(6),
          background: room.fill,
          color: room.ink,
          boxShadow: ring + shadow,
          outline: selected ? `${u(2)} solid ${palette.cobalt}` : undefined,
          outlineOffset: u(1.5),
          outlineColor: palette.cobalt,
          cursor: lifted ? 'grabbing' : 'grab',
          touchAction: selected ? 'none' : 'manipulation',
          paddingInline: u(6),
          paddingTop: rect.mode === 'tiny' ? 0 : u(rect.mode === 'full' ? 5 : 4),
          display: rect.mode === 'tiny' ? 'flex' : undefined,
          alignItems: 'center',
          transition: 'box-shadow 200ms ease'
        }}
        {...bodyProps}
      >
        {rect.mode === 'full' ? (
          <span className='block' style={{ paddingRight: u(8) }}>
            <span
              className='block'
              style={{
                fontSize: u(12),
                fontWeight: 600,
                lineHeight: 1.125,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {klass.name}
            </span>
            <span className='block' style={{ fontSize: u(11), lineHeight: 1.2, marginTop: u(2) }}>
              {teacher.short}
            </span>
            <span className='block' style={{ fontSize: u(11), lineHeight: 1.2, opacity: 0.86 }}>
              {room.name}
            </span>
          </span>
        ) : rect.mode === 'compact' ? (
          <span className='block overflow-hidden' style={{ height: u(26.5) }}>
            <span className='block' style={{ fontSize: u(12), fontWeight: 600, lineHeight: 1.125 }}>
              {klass.name}
            </span>
            <span className='block truncate' style={{ fontSize: u(11), lineHeight: 1.2 }}>
              {slot ? roomShort[klass.room] : `${teacher.short} · ${roomShort[klass.room]}`}
            </span>
          </span>
        ) : (
          <span
            className='block w-full min-w-0 truncate'
            style={{ fontSize: u(11), fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.01em', marginInline: u(-3) }}
          >
            {klass.name}
          </span>
        )}
      </button>
      {slot ? (
        <button
          type='button'
          aria-label={`Pin ${klass.name}`}
          aria-pressed={pinned}
          onClick={onPin}
          className={cn(
            'absolute flex items-end justify-end transition-opacity focus-visible:outline-2',
            pinned || selected
              ? 'opacity-100'
              : 'pointer-events-none opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100'
          )}
          style={{
            right: 0,
            bottom: 0,
            width: u(24),
            height: u(Math.min(24, rect.h)),
            padding: rect.mode === 'tiny' ? `${u(4)} ${u(4)}` : `${u(5)} ${u(5)}`,
            borderRadius: u(6),
            background: `linear-gradient(to left, ${room.fill} 60%, transparent)`,
            color: pinned ? palette.ink : room.ink,
            outlineColor: palette.cobalt,
            cursor: 'pointer'
          }}
        >
          <PinGlyph pinned={pinned} size={11} />
        </button>
      ) : null}
    </div>
  );
}
