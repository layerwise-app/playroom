import { memo, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { DemoCursor, useDirector } from '~/components/demo/director';
import type { CursorState } from '~/components/demo/director';
import { Stage, at, u } from '~/components/stage';
import type { DemoProps } from '~/content/types';
import { LogoMark, NightMarketPoster, deep, inkGrain, paperGrain, riso, tint } from './riso';
import { fontFamily, palette } from './theme';

/* ------------------------------------------------------------------ */
/* Model                                                               */
/* ------------------------------------------------------------------ */

export type Prompt = 'noticed' | 'wonder' | 'whatif';
type Person = 'jun' | 'amara' | 'theo';
type Author = Person | 'you';

export const PROMPTS: Record<Prompt, { label: string; tint: string; deep: string; solid: string }> = {
  noticed: { label: 'I noticed', tint: tint.blue, deep: deep.blue, solid: palette.blue },
  wonder: { label: 'I wonder', tint: tint.pink, deep: deep.pink, solid: palette.pink },
  whatif: { label: 'What if', tint: tint.over, deep: deep.over, solid: palette.overprint }
};

export const PEOPLE: Record<Person, { name: string; color: string; text: string; entry: { x: number; y: number } }> = {
  jun: { name: 'Jun', color: palette.pink, text: palette.ink, entry: { x: 70, y: 430 } },
  amara: { name: 'Amara', color: palette.blue, text: palette.white, entry: { x: -20, y: 150 } },
  theo: { name: 'Theo', color: palette.overprint, text: palette.white, entry: { x: 540, y: 110 } }
};

type Note = {
  id: string;
  prompt: Prompt;
  author: Author;
  text: string;
  x: number;
  y: number;
  rot: number;
  z: number;
  status: 'draft' | 'pinned' | 'leaving';
  /** The whole text a scripted note is typing toward. */
  full?: string;
  /** Milliseconds for a scripted glide; unset for direct moves. */
  glide?: number;
  lifted?: boolean;
};

type State = { notes: Note[]; seq: number; focus?: string };

/* Board geometry, in board units (the board sits 18 units inside the stage). */
const BOARD = { x: 18, y: 18, w: 484, h: 380 };
const NOTE_W = 126;
const NOTE_H = 104;
const AREA = { left: 8, top: 38, right: BOARD.w - 8, bottom: 326 };
const POSTER = { x: 161, y: 44, w: 162, h: 243 };

type Spec = { id: string; prompt: Prompt; author: Person; text: string; x: number; y: number; rot: number };

const SPECS: Record<'date' | 'pink' | 'quad' | 'muddy', Spec> = {
  pink: { id: 'pink', prompt: 'whatif', author: 'amara', text: 'the pink only marks the time? Lanterns could go blue.', x: 16, y: 48, rot: -2.4 },
  date: { id: 'date', prompt: 'noticed', author: 'jun', text: 'the date is the first thing I read, which is right.', x: 22, y: 182, rot: 1.8 },
  muddy: { id: 'muddy', prompt: 'noticed', author: 'amara', text: 'the title goes muddy where it crosses the lanterns.', x: 342, y: 50, rot: 2.2 },
  quad: { id: 'quad', prompt: 'wonder', author: 'theo', text: 'if first-years know which quad. Is it North?', x: 336, y: 188, rot: -1.6 }
};

const pinned = (spec: Spec, z: number): Note => ({ ...spec, z, status: 'pinned' });

const FINISHED: State = {
  notes: [pinned(SPECS.pink, 1), pinned(SPECS.date, 2), pinned(SPECS.muddy, 3), pinned(SPECS.quad, 4)],
  seq: 0
};

type Action =
  | { type: 'leave' }
  | { type: 'clear' }
  | { type: 'restore' }
  | { type: 'add'; note: Note }
  | { type: 'compose'; prompt: Prompt; x: number; y: number }
  | { type: 'text'; id: string; text: string }
  | { type: 'pin'; id: string; focus?: boolean }
  | { type: 'remove'; id: string }
  | { type: 'move'; id: string; x: number; y: number; glide?: number }
  | { type: 'lift'; id: string; on: boolean }
  | { type: 'settle' };

// Easing curves, matching the site's glide (the demo cursor) and settle.
const GLIDE = 'cubic-bezier(0.65, 0, 0.35, 1)';
const SETTLE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

const ROTS = [-2.2, 1.6, -1.1, 2.5, -2.8, 1.2];
const clampX = (x: number) => Math.min(AREA.right - NOTE_W, Math.max(AREA.left, x));
const clampY = (y: number) => Math.min(AREA.bottom - NOTE_H + 8, Math.max(AREA.top + 6, y));
const topZ = (notes: Note[]) => notes.reduce((z, n) => Math.max(z, n.z), 0) + 1;
const update = (state: State, id: string, patch: (n: Note) => Partial<Note>): State => ({
  ...state,
  notes: state.notes.map((n) => (n.id === id ? { ...n, ...patch(n) } : n))
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'leave':
      return { ...state, notes: state.notes.map((n) => ({ ...n, status: 'leaving' })) };
    case 'clear':
      return { ...state, notes: [], focus: undefined };
    case 'restore':
      return { ...FINISHED, seq: state.seq };
    case 'add':
      return { ...state, notes: [...state.notes, { ...action.note, z: topZ(state.notes) }] };
    case 'compose': {
      // One draft at a time: an earlier draft is pinned if it has words, dropped if not.
      const notes = state.notes
        .filter((n) => !(n.author === 'you' && n.status === 'draft' && !n.text.trim()))
        .map((n) => (n.author === 'you' && n.status === 'draft' ? { ...n, status: 'pinned' as const } : n));
      const seq = state.seq + 1;
      const note: Note = {
        id: `you-${seq}`,
        prompt: action.prompt,
        author: 'you',
        text: '',
        x: action.x,
        y: action.y,
        rot: ROTS[seq % ROTS.length],
        z: topZ(notes),
        status: 'draft'
      };
      return { ...state, notes: [...notes, note], seq, focus: undefined };
    }
    case 'text':
      return update(state, action.id, () => ({ text: action.text }));
    case 'pin':
      return {
        ...update(state, action.id, () => ({ status: 'pinned' })),
        focus: action.focus ? action.id : state.focus
      };
    case 'remove':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.id) };
    case 'move':
      return update(state, action.id, () => ({ x: action.x, y: action.y, glide: action.glide }));
    case 'lift':
      return update(state, action.id, (n) => ({ lifted: action.on, z: action.on ? topZ(state.notes) : n.z }));
    case 'settle':
      // The loop was interrupted: finish whatever the scripted people were doing.
      return {
        ...state,
        notes: state.notes
          .filter((n) => n.status !== 'leaving')
          .map((n) =>
            n.author === 'you'
              ? n
              : { ...n, text: n.full ?? n.text, status: 'pinned', glide: undefined, lifted: false }
          )
      };
  }
}

/** The free spot for a new note: the first candidate that overlaps least. */
function freeSpot(notes: Note[]) {
  const candidates: [number, number][] = [
    [SPECS.pink.x, SPECS.pink.y],
    [SPECS.muddy.x, SPECS.muddy.y],
    [SPECS.date.x, SPECS.date.y],
    [SPECS.quad.x, SPECS.quad.y],
    [14, 222],
    [344, 222],
    [180, 70],
    [180, 196],
    [60, 130],
    [300, 130]
  ];
  const overlap = (ax: number, ay: number, bx: number, by: number, bw: number, bh: number) =>
    Math.max(0, Math.min(ax + NOTE_W, bx + bw) - Math.max(ax, bx)) *
    Math.max(0, Math.min(ay + NOTE_H, by + bh) - Math.max(ay, by));
  let best = candidates[0];
  let bestScore = Infinity;
  for (const [x, y] of candidates) {
    const score =
      notes.reduce((sum, n) => sum + overlap(x, y, n.x, n.y, NOTE_W, NOTE_H), 0) +
      overlap(x, y, POSTER.x, POSTER.y, POSTER.w, POSTER.h) * 0.35;
    if (score < bestScore - 1) {
      best = [x, y];
      bestScore = score;
    }
  }
  return { x: best[0], y: best[1] };
}

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

type Ghosts = Record<Person, CursorState>;
const offstage = (who: Person): CursorState => ({ ...PEOPLE[who].entry, visible: false, pressed: false, duration: 0 });
const HIDDEN: Ghosts = { jun: offstage('jun'), amara: offstage('amara'), theo: offstage('theo') };

export default function StudioHoursDemo(_props: DemoProps) {
  const [state, dispatch] = useReducer(reducer, FINISHED);
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  });
  const [ghosts, setGhosts] = useState<Ghosts>(HIDDEN);
  const ghostRef = useRef(ghosts);

  const d = useDirector(async (x) => {
    const set = (who: Person, next: Partial<CursorState>) => {
      ghostRef.current = { ...ghostRef.current, [who]: { ...ghostRef.current[who], ...next } };
      setGhosts(ghostRef.current);
    };
    const glide = async (who: Person, target: string, anchor?: [number, number]) => {
      const p = x.point(target, { anchor });
      if (!ghostRef.current[who].visible) {
        set(who, { ...PEOPLE[who].entry, visible: true, duration: 0 });
        await x.wait(40);
      }
      const from = ghostRef.current[who];
      const duration = Math.min(1000, Math.max(380, 300 + Math.hypot(p.x - from.x, p.y - from.y) * 1.4));
      set(who, { ...p, duration });
      await x.wait(duration);
    };
    const click = async (who: Person) => {
      set(who, { pressed: true });
      await x.wait(140);
      set(who, { pressed: false });
      await x.wait(100);
    };
    const leave = async (spec: Spec, place?: { x: number; y: number }) => {
      const who = spec.author;
      await glide(who, `prompt-${spec.prompt}`);
      await click(who);
      dispatch({
        type: 'add',
        note: { ...spec, ...place, text: '', full: spec.text, z: 0, status: 'draft' }
      });
      await x.wait(180);
      await glide(who, `note-${spec.id}`, [0.84, 0.86]);
      await x.type(spec.text, (text) => dispatch({ type: 'text', id: spec.id, text }), { cps: 30 });
      await x.wait(320);
      dispatch({ type: 'pin', id: spec.id });
      await x.wait(260);
    };
    const drag = async (who: Person, id: string, to: { x: number; y: number }) => {
      await glide(who, `note-${id}`, [0.5, 0.16]);
      set(who, { pressed: true });
      dispatch({ type: 'lift', id, on: true });
      await x.wait(200);
      const note = stateRef.current.notes.find((n) => n.id === id);
      if (!note) return;
      const cur = ghostRef.current[who];
      const duration = 820;
      dispatch({ type: 'move', id, ...to, glide: duration });
      set(who, { x: cur.x + to.x - note.x, y: cur.y + to.y - note.y, duration });
      await x.wait(duration + 40);
      set(who, { pressed: false });
      dispatch({ type: 'lift', id, on: false });
      await x.wait(200);
    };
    const away = (who: Person) => set(who, { visible: false });
    // Lanes run side by side, like three people on one board.
    const lane = (run: () => Promise<void>) => {
      const p = run();
      p.catch(() => {});
      return p;
    };

    await x.wait(2600);
    dispatch({ type: 'leave' });
    await x.wait(420);
    dispatch({ type: 'clear' });
    await x.wait(500);

    const jun = lane(async () => {
      await leave(SPECS.date);
      await x.wait(300);
      away('jun');
    });
    const amara = lane(async () => {
      await x.wait(1500);
      await leave(SPECS.pink);
    });
    await x.wait(3300);
    const theo = lane(async () => {
      await leave(SPECS.quad, { x: SPECS.muddy.x, y: SPECS.muddy.y });
      await drag('theo', 'quad', { x: SPECS.quad.x, y: SPECS.quad.y });
      await x.wait(200);
      away('theo');
    });
    await Promise.all([jun, amara]);
    await x.wait(1700);
    await leave(SPECS.muddy);
    await x.wait(300);
    away('amara');
    await theo;
    await x.wait(1200);
  });

  // When a visitor takes over mid-pass, finish the scripted notes and send the cursors away.
  useEffect(() => {
    if (d.playing) return;
    dispatch({ type: 'settle' });
    ghostRef.current = HIDDEN;
    setGhosts(ghostRef.current);
  }, [d.playing]);

  // Keep keyboard focus on a note after it's pinned, so arrows work right away.
  useEffect(() => {
    if (!state.focus) return;
    d.rootRef.current?.querySelector<HTMLElement>(`[data-note="${state.focus}"]`)?.focus();
  }, [state.focus, d.rootRef]);

  const scale = useRef(1);
  const dragging = useRef<{ id: string; px: number; py: number; x0: number; y0: number } | null>(null);

  const compose = (prompt: Prompt) => {
    const others = stateRef.current.notes.filter((n) => !(n.author === 'you' && n.status === 'draft'));
    dispatch({ type: 'compose', prompt, ...freeSpot(others) });
  };

  const onPointerDown = (note: Note) => (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest('textarea, button')) return;
    const root = d.rootRef.current;
    if (!root) return;
    scale.current = root.getBoundingClientRect().width / 520;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = { id: note.id, px: event.clientX, py: event.clientY, x0: note.x, y0: note.y };
    dispatch({ type: 'lift', id: note.id, on: true });
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragging.current;
    if (!drag) return;
    dispatch({
      type: 'move',
      id: drag.id,
      x: clampX(drag.x0 + (event.clientX - drag.px) / scale.current),
      y: clampY(drag.y0 + (event.clientY - drag.py) / scale.current)
    });
  };
  const onPointerUp = () => {
    const drag = dragging.current;
    if (!drag) return;
    dragging.current = null;
    dispatch({ type: 'lift', id: drag.id, on: false });
  };
  const onKeyDown = (note: Note) => (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const step = event.shiftKey ? 24 : 8;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    const move = delta[event.key];
    if (move) {
      event.preventDefault();
      dispatch({ type: 'move', id: note.id, x: clampX(note.x + move[0]), y: clampY(note.y + move[1]), glide: 150 });
    } else if ((event.key === 'Delete' || event.key === 'Backspace') && note.author === 'you') {
      event.preventDefault();
      dispatch({ type: 'remove', id: note.id });
    }
  };

  const empty = state.notes.length === 0;
  const you = d.engaged;

  return (
    <Stage width={520} height={416} innerRef={d.rootRef} style={{ fontFamily, color: palette.ink }}>
      <div
        className='sh-wall absolute overflow-hidden'
        style={{
          left: u(BOARD.x),
          top: u(BOARD.y),
          width: u(BOARD.w),
          height: u(BOARD.h),
          borderRadius: u(14),
          isolation: 'isolate',
          ...riso(palette.newsprint),
          boxShadow: `0 ${u(20)} ${u(40)} ${u(-20)} rgba(27,27,58,.55), 0 0 0 1px rgba(27,27,58,.06)`
        }}
      >
        <style>{WALL_CSS}</style>
        <BoardHeader you={you} />
        <PinnedPoster />

        {state.notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            engaged={d.engaged}
            onPointerDown={onPointerDown(note)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onKeyDown={onKeyDown(note)}
            onText={(text) => dispatch({ type: 'text', id: note.id, text })}
            onPin={() => dispatch({ type: 'pin', id: note.id, focus: true })}
            onCancel={() => {
              dispatch({ type: 'remove', id: note.id });
              d.rootRef.current?.querySelector<HTMLElement>(`[data-target="prompt-${note.prompt}"]`)?.focus();
            }}
            onRemove={() => dispatch({ type: 'remove', id: note.id })}
          />
        ))}

        <Toolbar
          empty={empty}
          onPrompt={compose}
          onClear={() => dispatch({ type: empty ? 'restore' : 'clear' })}
        />
      </div>

      {(Object.keys(PEOPLE) as Person[]).map((who) => (
        <DemoCursor
          key={who}
          cursor={{ ...ghosts[who], visible: ghosts[who].visible && d.playing }}
          label={PEOPLE[who].name}
          color={PEOPLE[who].color}
          ink={PEOPLE[who].text}
        />
      ))}
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

// Focus rings, hover, and the note's arrival, scoped to the wall.
const WALL_CSS = `
.sh-wall .sh-focus{outline:none}
.sh-wall .sh-focus:focus-visible{outline:2px solid ${palette.blue};outline-offset:2px}
.sh-wall .sh-tool{transition:background-color 150ms ease}
.sh-wall .sh-tool:hover{background:${palette.newsprint}}
.sh-wall textarea::placeholder{color:${palette.inkSoft};opacity:1}
.sh-note-in{animation:sh-note-in 300ms cubic-bezier(.2,.8,.2,1) both}
@keyframes sh-note-in{from{opacity:0;transform:scale(.9)}}
.sh-caret{animation:sh-caret 1s steps(1) infinite}
@keyframes sh-caret{50%{opacity:0}}
`;

function BoardHeader({ you }: { you: boolean }) {
  return (
    <div
      className='absolute flex items-center justify-between'
      style={{ left: u(14), right: u(12), top: u(9), height: u(24) }}
    >
      <div className='flex items-center' style={{ gap: u(7) }}>
        <LogoMark size={18} flat />
        <span style={{ fontSize: u(13), fontWeight: 750, letterSpacing: '-0.01em' }}>Crit wall</span>
        {you ? (
          <span
            style={{
              fontSize: u(11.5),
              fontWeight: 650,
              padding: `${u(3)} ${u(7)}`,
              borderRadius: u(5),
              background: palette.ink,
              color: palette.paper
            }}
          >
            Your turn: pick a prompt
          </span>
        ) : (
          <span style={{ fontSize: u(12), color: palette.inkSoft, fontWeight: 500 }}>Thursday, Hale B14</span>
        )}
      </div>
      <div className='flex items-center' aria-label='On the wall: Jun, Amara, Theo'>
        {(Object.keys(PEOPLE) as Person[]).map((who, i) => (
          <span
            key={who}
            className='flex items-center justify-center'
            style={{
              width: u(22),
              height: u(22),
              marginLeft: i ? u(-4) : 0,
              zIndex: 3 - i,
              borderRadius: '50%',
              background: PEOPLE[who].color,
              color: PEOPLE[who].text,
              fontSize: u(11),
              fontWeight: 750,
              boxShadow: `0 0 0 ${u(2)} ${palette.newsprint}`
            }}
          >
            {PEOPLE[who].name[0]}
          </span>
        ))}
      </div>
    </div>
  );
}

const PinnedPoster = memo(function PinnedPoster() {
  return (
    <div className='absolute' style={{ left: u(POSTER.x), top: u(POSTER.y), width: u(POSTER.w) }}>
      <div
        style={{
          transform: 'rotate(-0.8deg)',
          boxShadow: `0 ${u(1)} ${u(1)} rgba(27,27,58,.12), 0 ${u(10)} ${u(18)} ${u(-10)} rgba(27,27,58,.4)`
        }}
      >
        <NightMarketPoster version='draft' style={{ width: '100%', height: 'auto' }} />
      </div>
      <Tape style={{ left: u(-10), top: u(-6), transform: 'rotate(-32deg)' }} />
      <Tape style={{ right: u(-10), top: u(-6), transform: 'rotate(30deg)' }} />
      <p
        className='absolute text-center'
        style={{ left: u(-30), right: u(-30), top: u(POSTER.h + 6), fontSize: u(11), color: palette.inkSoft, fontWeight: 550 }}
      >
        Night Market poster, draft 3 · Noor
      </p>
    </div>
  );
});

function Tape({ style }: { style: CSSProperties }) {
  return (
    <span
      aria-hidden
      className='absolute'
      style={{
        width: u(34),
        height: u(12),
        background: 'rgba(250, 247, 238, 0.72)',
        backgroundImage: paperGrain,
        backgroundSize: `${u(120)} ${u(120)}`,
        boxShadow: '0 0 0 1px rgba(27,27,58,.06)',
        ...style
      }}
    />
  );
}

function StickyNote({
  note,
  engaged,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  onText,
  onPin,
  onCancel,
  onRemove
}: {
  note: Note;
  engaged: boolean;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onText: (text: string) => void;
  onPin: () => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const prompt = PROMPTS[note.prompt];
  const mine = note.author === 'you';
  const draft = note.status === 'draft';
  const leaving = note.status === 'leaving';
  const person = note.author === 'you' ? null : PEOPLE[note.author];
  const author = person ? person.name : 'You';
  const editing = mine && draft;
  const typing = !mine && draft;

  const rot = draft ? 0 : note.rot;
  const lift = note.lifted || draft;
  const transform = `${at(note.x, note.y + (leaving ? 8 : 0))} rotate(${rot}deg) scale(${note.lifted ? 1.045 : leaving ? 0.96 : 1})`;
  const transition = note.glide
    ? `transform ${note.glide}ms ${GLIDE}, opacity 300ms ease`
    : note.lifted && !note.glide
      ? 'transform 90ms linear, opacity 300ms ease'
      : `transform 420ms ${SETTLE}, opacity 320ms ease`;

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- a focusable note you drag or move with arrow keys
    <div
      data-note={note.id}
      data-target={`note-${note.id}`}
      role='group'
      tabIndex={editing ? -1 : 0}
      aria-label={`${prompt.label} ${note.full ?? note.text}, from ${author}.${editing ? '' : ' Arrow keys move it.'}${mine && !editing ? ' Delete removes it.' : ''}`}
      className='sh-focus absolute'
      style={{
        left: 0,
        top: 0,
        width: u(NOTE_W),
        zIndex: note.z + (note.lifted ? 100 : 0),
        transform,
        transition,
        opacity: leaving ? 0 : 1,
        // A lifted note gets its own layer, so dragging it never repaints the poster's grain.
        willChange: note.lifted ? 'transform' : undefined,
        touchAction: engaged ? 'none' : 'pan-y',
        cursor: editing ? 'default' : note.lifted ? 'grabbing' : 'grab'
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div
        className='sh-note-in'
        style={{
          position: 'relative',
          padding: `${u(9)} ${u(10)} ${u(8)}`,
          minHeight: u(92),
          backgroundColor: prompt.tint,
          backgroundImage: `${inkGrain}, ${paperGrain}`,
          backgroundSize: `${u(110)} ${u(110)}, ${u(160)} ${u(160)}`,
          borderRadius: u(2),
          outline: draft ? `${u(1.5)} dashed ${prompt.solid}` : undefined,
          outlineOffset: u(3),
          boxShadow: lift
            ? `0 ${u(2)} ${u(3)} rgba(27,27,58,.12), 0 ${u(16)} ${u(22)} ${u(-10)} rgba(27,27,58,.42)`
            : `0 ${u(1)} ${u(1)} rgba(27,27,58,.12), 0 ${u(7)} ${u(10)} ${u(-6)} rgba(27,27,58,.32)`,
          transition: 'box-shadow 300ms ease'
        }}
      >
        <div className='flex items-center' style={{ gap: u(5), color: prompt.deep, fontSize: u(12), fontWeight: 750, lineHeight: 1.1 }}>
          <span aria-hidden style={{ width: u(7), height: u(7), borderRadius: '50%', background: prompt.solid, flexShrink: 0 }} />
          {prompt.label}…
        </div>
        {editing ? (
          <textarea
            // The visitor just asked for this note, so focus goes straight to it.
            // oxlint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={note.text}
            maxLength={72}
            rows={3}
            placeholder='what you saw, asked, or would try'
            aria-label={`Your “${prompt.label}” note. Enter pins it, Escape cancels.`}
            onChange={(event) => onText(event.target.value.replace(/\n/g, ''))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (note.text.trim()) onPin();
              } else if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                onCancel();
              }
            }}
            onBlur={() => {
              if (!note.text.trim()) return;
              onPin();
            }}
            className='block w-full resize-none bg-transparent outline-none'
            style={{
              marginTop: u(4),
              fontSize: u(12.5),
              lineHeight: 1.28,
              fontWeight: 500,
              color: palette.ink,
              border: 0,
              padding: 0,
              height: u(48),
              fontFamily: 'inherit'
            }}
          />
        ) : (
          <p style={{ marginTop: u(4), fontSize: u(12.5), lineHeight: 1.28, fontWeight: 500, minHeight: u(48) }}>
            {note.text}
            {typing && person ? <Caret color={person.color} /> : null}
          </p>
        )}
        <div
          className='flex items-center justify-between'
          style={{ marginTop: u(5), fontSize: u(11), color: palette.inkSoft, fontWeight: 600, lineHeight: 1 }}
        >
          <span className='flex items-center' style={{ gap: u(4) }}>
            <span
              aria-hidden
              style={{
                width: u(6),
                height: u(6),
                borderRadius: '50%',
                background: person ? person.color : palette.ink
              }}
            />
            {author}
          </span>
          {editing ? <span>Enter to pin</span> : null}
        </div>
        {mine && !editing ? (
          <button
            type='button'
            aria-label='Remove your note'
            onClick={onRemove}
            className='sh-focus absolute flex items-center justify-center'
            style={{ top: u(-12), right: u(-12), width: u(30), height: u(30), borderRadius: '50%' }}
          >
            <span
              className='flex items-center justify-center'
              style={{ width: u(20), height: u(20), borderRadius: '50%', background: palette.ink, color: palette.paper }}
            >
              <svg viewBox='0 0 10 10' style={{ width: u(8), height: u(8) }} aria-hidden>
                <path d='M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
              </svg>
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Caret({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className='sh-caret'
      style={{
        display: 'inline-block',
        width: u(1.6),
        height: u(13),
        marginLeft: u(1),
        verticalAlign: 'text-bottom',
        background: color === palette.pink ? deep.pink : color
      }}
    />
  );
}

function Toolbar({
  empty,
  onPrompt,
  onClear
}: {
  empty: boolean;
  onPrompt: (prompt: Prompt) => void;
  onClear: () => void;
}) {
  const button = 'sh-focus sh-tool flex items-center';
  return (
    <div
      className='absolute flex items-center'
      style={{
        left: '50%',
        bottom: u(10),
        width: 'max-content',
        whiteSpace: 'nowrap',
        transform: 'translateX(-50%)',
        gap: u(4),
        padding: u(4),
        borderRadius: u(12),
        background: palette.paper,
        boxShadow: `0 0 0 1px rgba(27,27,58,.1), 0 ${u(6)} ${u(14)} ${u(-6)} rgba(27,27,58,.35)`,
        zIndex: 300
      }}
    >
      {(Object.keys(PROMPTS) as Prompt[]).map((key) => {
        const prompt = PROMPTS[key];
        return (
          <button
            key={key}
            type='button'
            data-target={`prompt-${key}`}
            aria-label={`Add an “${prompt.label}” note`}
            onClick={() => onPrompt(key)}
            className={button}
            style={{ height: u(30), gap: u(6), paddingInline: u(9), borderRadius: u(8), fontSize: u(13), fontWeight: 700 }}
          >
            <span
              aria-hidden
              style={{
                width: u(13),
                height: u(13),
                borderRadius: u(2),
                background: prompt.tint,
                boxShadow: `inset 0 0 0 ${u(1.5)} ${prompt.solid}`,
                transform: 'rotate(-6deg)'
              }}
            />
            {prompt.label}
          </button>
        );
      })}
      <span aria-hidden style={{ width: 1, height: u(18), background: 'rgba(27,27,58,.16)', marginInline: u(2) }} />
      <button
        type='button'
        onClick={onClear}
        aria-label={empty ? 'Reset the board to the crit notes' : 'Clear the board'}
        className={button}
        style={{ height: u(30), gap: u(5), paddingInline: u(9), borderRadius: u(8), fontSize: u(12.5), fontWeight: 650, color: palette.inkSoft }}
      >
        {empty ? 'Reset' : 'Clear'}
      </button>
    </div>
  );
}
