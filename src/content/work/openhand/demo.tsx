import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { Dispatch, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { DemoCursor, useDirector } from '~/components/demo/director';
import type { CursorState, Director } from '~/components/demo/director';
import { BrowserWindow } from '~/components/frames';
import { at, Stage, u } from '~/components/stage';
import type { DemoProps } from '~/content/types';
import { Editor, type EditorActions } from './screens/editor';
import { C } from './screens/kit';
import {
  BLOCK_NAME,
  FINISHED,
  FIRST_DRAFT,
  HEADLINES,
  ORDER,
  isIncomplete,
  nextToDraft,
  reducer,
  statusOf,
  type Action,
  type BlockId,
  type DraftState
} from './screens/model';
import { fontFamily } from './theme';

type Point = { x: number; y: number };
type Target = string | Point;
type MoveOptions = { duration?: number; anchor?: [number, number]; offset?: [number, number] };

const HIDDEN: CursorState = { x: 0, y: 0, visible: false, pressed: false, duration: 0 };

const isAbort = (error: unknown) => error instanceof DOMException && error.name === 'AbortError';

/** Stage coordinates of a `data-target` element. */
function pointIn(root: HTMLElement | null, target: Target, options: Omit<MoveOptions, 'duration'> = {}): Point {
  const [ox, oy] = options.offset ?? [0, 0];
  if (typeof target !== 'string') return { x: target.x + ox, y: target.y + oy };
  const element = root?.querySelector<HTMLElement>(`[data-target="${target}"]`);
  if (!root || !element) throw new Error(`Demo target "${target}" not found`);
  const rootBox = root.getBoundingClientRect();
  const box = element.getBoundingClientRect();
  const scale = rootBox.width / parseFloat(getComputedStyle(root).getPropertyValue('--stage-w'));
  const [ax, ay] = options.anchor ?? [0.5, 0.5];
  return {
    x: (box.left + box.width * ax - rootBox.left) / scale + ox,
    y: (box.top + box.height * ay - rootBox.top) / scale + oy
  };
}

const glide = (from: Point, to: Point) =>
  Math.min(1100, Math.max(380, 320 + Math.hypot(to.x - from.x, to.y - from.y) * 1.5));

/**
 * The same verbs as the site's director, for a second cursor or for drafts a
 * visitor starts. Every await rejects once `signal` aborts.
 */
function createDirector(
  signal: AbortSignal,
  root: () => HTMLElement | null,
  read: () => CursorState,
  update: (next: Partial<CursorState>) => void
): Director {
  const wait = (ms: number) =>
    new Promise<void>((resolve, reject) => {
      if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'));
      const id = setTimeout(resolve, ms);
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(id);
          reject(new DOMException('Aborted', 'AbortError'));
        },
        { once: true }
      );
    });
  const point = (target: Target, options: Omit<MoveOptions, 'duration'> = {}) => pointIn(root(), target, options);
  return {
    signal,
    wait,
    point,
    async move(target, options: MoveOptions = {}) {
      const next = point(target, options);
      const current = read();
      if (!current.visible) {
        update({ ...next, visible: true, duration: 0 });
        await wait(220);
        return;
      }
      const duration = options.duration ?? glide(current, next);
      update({ ...next, duration });
      await wait(duration);
    },
    async appear(target, options = {}) {
      update({ ...point(target, options), visible: true, duration: 0 });
      await wait(220);
    },
    hide() {
      update({ visible: false, pressed: false });
    },
    async press() {
      update({ pressed: true });
      await wait(150);
      update({ pressed: false });
      await wait(110);
    },
    down() {
      update({ pressed: true });
    },
    up() {
      update({ pressed: false });
    },
    async type(text, onText, options = {}) {
      const cps = options.cps ?? 24;
      for (let i = 1; i <= text.length; i++) {
        onText(text.slice(0, i));
        const pause = /[,.!?]/.test(text[i - 1] ?? '') ? 3 : 1;
        await wait((1000 / cps) * pause * (0.7 + Math.random() * 0.6));
      }
    }
  };
}

/** A cursor driven by our own scripts, outside the site's autoplay loop. */
function useCursorRunner(rootRef: RefObject<HTMLDivElement | null>) {
  const [cursor, setCursor] = useState<CursorState>(HIDDEN);
  const cursorRef = useRef<CursorState>(HIDDEN);
  const controller = useRef<AbortController | null>(null);
  const [running, setRunning] = useState(false);

  const update = useCallback((next: Partial<CursorState>) => {
    cursorRef.current = { ...cursorRef.current, ...next };
    setCursor(cursorRef.current);
  }, []);

  const stop = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
    setRunning(false);
    update({ pressed: false });
  }, [update]);

  const start = useCallback(
    (script: (x: Director) => Promise<void>) => {
      controller.current?.abort();
      const current = new AbortController();
      controller.current = current;
      setRunning(true);
      const x = createDirector(current.signal, () => rootRef.current, () => cursorRef.current, update);
      script(x)
        .catch((error) => {
          if (!isAbort(error)) console.error(error);
        })
        .finally(() => {
          if (controller.current === current) {
            controller.current = null;
            setRunning(false);
          }
        });
    },
    [rootRef, update]
  );

  useEffect(() => () => controller.current?.abort(), []);

  return {
    cursor,
    running,
    start,
    stop,
    isRunning: () => controller.current !== null,
    place: (p: Point) => update({ ...p, visible: true, pressed: false, duration: 0 }),
    hide: () => update({ visible: false, pressed: false }),
    read: () => cursorRef.current,
    update
  };
}

type Kit = { x: Director; get: () => DraftState; dispatch: Dispatch<Action> };

/** Fill one placed block. Numbers are read from the brief, never written. */
async function fill({ x, get, dispatch }: Kit, id: BlockId) {
  if (id === 'hero') {
    await x.move('slot-hero', { anchor: [0.04, 0.86] });
    dispatch({ type: 'type', text: '' });
    await x.type(HEADLINES[FIRST_DRAFT.hero], (text) => dispatch({ type: 'type', text }), { cps: 26 });
    await x.wait(220);
    dispatch({ type: 'fill', id });
    await x.wait(320);
    return;
  }
  if (id === 'goal') {
    await x.move('brief-amount', { anchor: [0.55, 0.7] });
    await x.press();
    dispatch({ type: 'read', on: true });
    await x.wait(420);
    await x.move('slot-goal', { anchor: [0.42, 0.4] });
    if (get().blocks.goal.status !== 'drafting') return;
    dispatch({ type: 'fill', id });
    await x.wait(950);
    return;
  }
  await x.move(`slot-${id}`, { anchor: id === 'story' ? [0.6, 0.66] : [0.56, 0.62] });
  dispatch({ type: 'fill', id });
  await x.wait(id === 'story' ? 1350 : 1000);
}

/** Place and fill every block that isn't on the page yet, picking up where it left off. */
async function draft(kit: Kit) {
  const { x, get, dispatch } = kit;
  for (const id of ORDER) {
    if (get().blocks[id].status === 'empty') {
      if (get().carrying !== id) {
        await x.move(`rail-${id}`, { anchor: [0.3, 0.55] });
        x.down();
        dispatch({ type: 'pick', id });
        await x.wait(170);
      }
      await x.move(`slot-${id}`, { anchor: [0.42, 0.5] });
      x.up();
      dispatch({ type: 'place', id });
      await x.wait(260);
    }
    if (get().blocks[id].status === 'drafting') await fill(kit, id);
  }
}

export default function OpenhandDemo(_props: DemoProps) {
  const [state, dispatch] = useReducer(reducer, FINISHED);
  const stateRef = useRef(state);
  stateRef.current = state;
  const lastAgent = useRef<Point | null>(null);
  const yielded = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const playingRef = useRef(false);

  // Dolores, the volunteer coordinator, reviews the draft in the loop.
  const [person, setPerson] = useState<CursorState>(HIDDEN);
  const personRef = useRef<CursorState>(HIDDEN);
  const updatePerson = (next: Partial<CursorState>) => {
    personRef.current = { ...personRef.current, ...next };
    setPerson(personRef.current);
  };
  const personMove = async (x: Director, target: Target, options: MoveOptions = {}) => {
    const next = x.point(target, options);
    const current = personRef.current;
    if (!current.visible) {
      updatePerson({ ...next, visible: true, duration: 0 });
      await x.wait(220);
      return;
    }
    const duration = glide(current, next);
    updatePerson({ ...next, duration });
    await x.wait(duration);
  };
  const personPress = async (x: Director) => {
    updatePerson({ pressed: true });
    await x.wait(150);
    updatePerson({ pressed: false });
    await x.wait(110);
  };

  const kit = (x: Director): Kit => ({ x, get: () => stateRef.current, dispatch });

  const d = useDirector(async (x) => {
    updatePerson({ visible: false, pressed: false });
    await x.wait(1800);
    dispatch({ type: 'reset' });
    lastAgent.current = null;
    await x.wait(650);
    await draft(kit(x));
    await x.move('status', { anchor: [0.3, 0.6] });
    await x.wait(200);
    x.hide();
    lastAgent.current = null;
    await x.wait(450);

    // Nothing publishes until a person keeps it.
    await personMove(x, 'slot-donate', { anchor: [0.85, 1.12] });
    await x.wait(250);
    await personMove(x, 'try-hero');
    await personPress(x);
    dispatch({ type: 'try', id: 'hero' });
    await x.wait(1100);
    await personMove(x, 'keep-hero');
    await personPress(x);
    dispatch({ type: 'keep', id: 'hero' });
    await x.wait(420);
    for (const id of ['goal', 'photo', 'story', 'donate'] as const) {
      await personMove(x, `keep-${id}`);
      await personPress(x);
      dispatch({ type: 'keep', id });
      await x.wait(360);
    }
    await personMove(x, 'publish', { anchor: [0.45, 0.65] });
    await x.wait(1300);
    updatePerson({ visible: false });
    await x.wait(1400);
  });
  playingRef.current = d.playing;

  const local = useCursorRunner(d.rootRef);

  // Remember where the agent was, so it can pause right there.
  useEffect(() => {
    if (d.playing && d.cursor.visible) lastAgent.current = { x: d.cursor.x, y: d.cursor.y };
  }, [d.cursor, d.playing]);

  // A visitor took over: the agent yields mid-step and waits.
  useEffect(() => {
    if (!d.engaged) return;
    const current = stateRef.current;
    const next = nextToDraft(current);
    if (!next) {
      local.hide();
      return;
    }
    let spot = lastAgent.current;
    if (!spot) {
      try {
        spot = pointIn(d.rootRef.current, `rail-${next}`, { anchor: [0.3, 0.55] });
      } catch {
        spot = null;
      }
    }
    if (spot) local.place(spot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.engaged]);

  // The loop is back: drop anything a visitor started.
  useEffect(() => {
    if (!d.playing) return;
    clearTimeout(resumeTimer.current);
    yielded.current = false;
    local.stop();
    local.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.playing]);

  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  const runLocal = (delay = 0) => {
    if (d.still) {
      dispatch({ type: 'draftAll' });
      return;
    }
    local.start(async (x) => {
      await x.wait(delay);
      await draft(kit(x));
      await x.move('status', { anchor: [0.3, 0.6] });
      await x.wait(200);
      x.hide();
    });
  };

  // Keep and Publish remove the focused button; hand focus to the next useful one
  // so keyboard visitors stay inside the demo.
  const focusFirst = (targets: string[]) => {
    const root = d.rootRef.current;
    if (!root || !root.contains(document.activeElement)) return;
    setTimeout(() => {
      for (const target of targets) {
        const element = root.querySelector<HTMLButtonElement>(`[data-target="${target}"]`);
        if (element && !element.disabled) {
          element.focus();
          return;
        }
      }
    }, 0);
  };

  const actions: EditorActions = {
    onKeep: (id) => {
      const index = ORDER.indexOf(id);
      const rest = [...ORDER.slice(index + 1), ...ORDER.slice(0, index)];
      focusFirst([...rest.map((next) => `keep-${next}`), 'publish', 'start-over']);
      dispatch({ type: 'keep', id });
    },
    onTry: (id) => dispatch({ type: 'try', id }),
    onPublish: () => {
      focusFirst(['start-over']);
      dispatch({ type: 'publish' });
    },
    onPause: () => {
      clearTimeout(resumeTimer.current);
      yielded.current = false;
      local.stop();
    },
    onStartOver: () => {
      clearTimeout(resumeTimer.current);
      yielded.current = false;
      local.stop();
      dispatch({ type: 'reset' });
      lastAgent.current = null;
      if (d.still) {
        dispatch({ type: 'draftAll' });
        return;
      }
      runLocal(450);
    },
    onLetFinish: () => {
      clearTimeout(resumeTimer.current);
      yielded.current = false;
      runLocal(120);
    }
  };

  // Move your mouse onto the page and the agent stops; move away and it goes on.
  const canvasProps = {
    onPointerEnter: (event: ReactPointerEvent) => {
      if (event.pointerType === 'touch') return;
      clearTimeout(resumeTimer.current);
      if (local.isRunning()) {
        local.stop();
        yielded.current = true;
      }
    },
    onPointerLeave: (event: ReactPointerEvent) => {
      if (event.pointerType === 'touch' || !yielded.current) return;
      clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        yielded.current = false;
        if (!playingRef.current && isIncomplete(stateRef.current)) runLocal();
      }, 500);
    },
    onPointerDown: (event: ReactPointerEvent) => {
      if (event.pointerType === 'touch' && local.isRunning()) local.stop();
    },
    onFocus: () => {
      if (local.isRunning()) local.stop();
    }
  };

  const agentActive = d.playing || local.running;
  const status = statusOf(state, agentActive);
  const agent = d.playing ? d.cursor : local.cursor;
  const paused = !agentActive && isIncomplete(state);
  const carrying = state.carrying;

  return (
    <Stage width={520} height={416} innerRef={d.rootRef} style={{ fontFamily }}>
      <BrowserWindow
        url='openhand.org/pages/riverside-roof/edit'
        className='absolute'
        style={{ left: u(20), top: u(20), width: u(480), height: u(376) }}
      >
        <Editor
          state={state}
          status={status}
          actions={actions}
          targets
          animate={!d.still}
          canvasProps={canvasProps}
        />
      </BrowserWindow>
      {carrying ? (
        <div
          aria-hidden
          className='absolute'
          style={{
            left: 0,
            top: 0,
            zIndex: 40,
            transform: `${at(agent.x - 22, agent.y - 9)} rotate(-3deg)`,
            transition: `transform ${agent.duration}ms var(--ease-glide)`
          }}
        >
          <span
            className='block'
            style={{
              padding: `${u(4)} ${u(10)}`,
              borderRadius: u(5),
              background: C.white,
              color: C.ember,
              fontSize: u(11.5),
              fontWeight: 650,
              lineHeight: 1.1,
              outline: `${u(1.5)} dashed ${C.vermilion}`,
              boxShadow: `0 ${u(6)} ${u(14)} ${u(-6)} rgba(43,26,20,.35)`
            }}
          >
            {BLOCK_NAME[carrying]}
          </span>
        </div>
      ) : null}
      <DemoCursor
        cursor={{ ...person, visible: person.visible && d.playing }}
        label='Dolores'
        color={C.ink}
      />
      <DemoCursor
        cursor={agent}
        label={paused ? 'Paused, your turn' : 'Openhand agent'}
        color={C.ember}
      />
    </Stage>
  );
}
