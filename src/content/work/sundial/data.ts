import { palette } from './theme';

/*
 * Sundial's model, shared by the live demo and the screens: rooms, teachers,
 * one ground-floor week at Fernwood, and the small solver the demo runs.
 */

export type RoomKey = keyof typeof palette.rooms;

export const ROOM_ORDER: RoomKey[] = ['kiln', 'studioA', 'studioB', 'room4', 'music'];

export const roomShort: Record<RoomKey, string> = {
  kiln: 'Kiln',
  studioA: 'Studio A',
  studioB: 'Studio B',
  room4: 'Room 4',
  music: 'Music'
};

export type TeacherKey =
  | 'ortega'
  | 'hale'
  | 'kim'
  | 'adeyemi'
  | 'mensah'
  | 'brandt'
  | 'novak'
  | 'reyes'
  | 'doyle';

export const teachers: Record<TeacherKey, { short: string; name: string; days: number[] }> = {
  ortega: { short: 'R. Ortega', name: 'Rosa Ortega', days: [1, 3] },
  hale: { short: 'D. Hale', name: 'Dana Hale', days: [0, 1, 2, 3] },
  kim: { short: 'J. Kim', name: 'Jun Kim', days: [0, 1, 2, 3, 4] },
  adeyemi: { short: 'T. Adeyemi', name: 'Tola Adeyemi', days: [0, 2, 4] },
  mensah: { short: 'A. Mensah', name: 'Ama Mensah', days: [0, 1, 2, 3, 4] },
  brandt: { short: 'L. Brandt', name: 'Lena Brandt', days: [0, 4] },
  novak: { short: 'S. Novak', name: 'Sam Novak', days: [2, 3] },
  reyes: { short: 'M. Reyes', name: 'Marisol Reyes', days: [1, 3, 4] },
  doyle: { short: 'P. Doyle', name: 'Pat Doyle', days: [4] }
};

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DAYS_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
/** Fall 2024, week 1: Monday September 9. */
export const DATES = [9, 10, 11, 12, 13];
export const TIMES = ['3:30', '4:30', '5:30', '6:30'];

export type Slot = { day: number; time: number };
export type Klass = {
  id: string;
  name: string;
  teacher: TeacherKey;
  room: RoomKey;
};

export const classes: Klass[] = [
  { id: 'choirJr', name: 'Junior Choir', teacher: 'brandt', room: 'music' },
  { id: 'kidsClay', name: 'Kids Clay', teacher: 'hale', room: 'kiln' },
  { id: 'ballet1', name: 'Ballet I', teacher: 'adeyemi', room: 'studioA' },
  { id: 'figure', name: 'Figure Drawing', teacher: 'mensah', room: 'room4' },
  { id: 'hiphop1', name: 'Hip-Hop I', teacher: 'kim', room: 'studioB' },
  { id: 'wheel', name: 'Wheel Throwing', teacher: 'ortega', room: 'kiln' },
  { id: 'sculpt', name: 'Sculpture I', teacher: 'hale', room: 'room4' },
  { id: 'hiphop2', name: 'Hip-Hop II', teacher: 'kim', room: 'studioB' },
  { id: 'print', name: 'Printmaking', teacher: 'mensah', room: 'room4' },
  { id: 'watercolor', name: 'Watercolor', teacher: 'mensah', room: 'room4' },
  { id: 'ballet2', name: 'Ballet II', teacher: 'adeyemi', room: 'studioA' },
  { id: 'guitar', name: 'Guitar Lab', teacher: 'novak', room: 'music' },
  { id: 'adultWheel', name: 'Adult Wheel', teacher: 'hale', room: 'kiln' },
  { id: 'handBuild', name: 'Hand Building', teacher: 'ortega', room: 'kiln' },
  { id: 'contemporary', name: 'Contemporary', teacher: 'reyes', room: 'studioA' },
  { id: 'portfolio', name: 'Portfolio Prep', teacher: 'mensah', room: 'room4' },
  { id: 'jazz', name: 'Jazz Combo', teacher: 'novak', room: 'music' },
  { id: 'comics', name: 'Comics Lab', teacher: 'doyle', room: 'room4' },
  { id: 'tap', name: 'Tap I', teacher: 'adeyemi', room: 'studioA' },
  { id: 'choirTeen', name: 'Teen Choir', teacher: 'brandt', room: 'music' },
  { id: 'raku', name: 'Raku Firing', teacher: 'hale', room: 'kiln' }
];

export const classById = Object.fromEntries(classes.map((c) => [c.id, c])) as Record<
  string,
  Klass
>;

export type Positions = Record<string, Slot | null>;

const s = (day: number, time: number): Slot => ({ day, time });

/** The draft before Raku Firing is placed. `null` means waiting in the tray. */
export const DRAFT: Positions = {
  choirJr: s(0, 0),
  kidsClay: s(0, 1),
  ballet1: s(0, 2),
  figure: s(0, 3),
  hiphop1: s(1, 0),
  wheel: s(1, 1),
  sculpt: s(1, 1),
  hiphop2: s(1, 2),
  print: s(1, 3),
  watercolor: s(2, 0),
  ballet2: s(2, 1),
  guitar: s(2, 2),
  adultWheel: s(2, 3),
  handBuild: s(3, 0),
  contemporary: s(3, 2),
  portfolio: s(3, 2),
  jazz: s(3, 3),
  comics: s(4, 0),
  tap: s(4, 1),
  choirTeen: s(4, 2),
  raku: null
};

export const PINNED: Record<string, boolean> = {
  choirJr: true,
  hiphop2: true,
  choirTeen: true
};

export const slotLabel = (slot: Slot) => `${DAYS[slot.day]} ${TIMES[slot.time]}`;
export const slotLong = (slot: Slot) => `${DAYS_LONG[slot.day]} at ${TIMES[slot.time]}`;
const same = (a: Slot | null, b: Slot | null) =>
  !!a && !!b && a.day === b.day && a.time === b.time;

export type Move = { id: string; from: Slot; to: Slot };

export type Message = {
  tone: 'ok' | 'conflict' | 'blocked' | 'draft' | 'info' | 'move';
  title: string;
  detail?: string;
};

export type Resolution =
  | {
      ok: true;
      pos: Positions;
      moves: Move[];
      /** Ids in conflict the moment the class lands, before the solver runs. */
      clash: string[];
      conflict?: Message;
      result: Message;
    }
  | { ok: false; blockers: string[]; message: Message };

/** Candidate slots for a bumped class, nearest first. Same time on another day beats another time. */
function candidates(from: Slot): Slot[] {
  const all: { slot: Slot; cost: number; back: number }[] = [];
  for (let day = 0; day < DAYS.length; day++) {
    for (let time = 0; time < TIMES.length; time++) {
      if (day === from.day && time === from.time) continue;
      const dd = day - from.day;
      const dt = time - from.time;
      all.push({ slot: { day, time }, cost: Math.abs(dt) * 3 + Math.abs(dd), back: dd < 0 || dt < 0 ? 1 : 0 });
    }
  }
  all.sort((a, b) => a.cost - b.cost || a.back - b.back);
  return all.map((c) => c.slot);
}

function fits(pos: Positions, klass: Klass, slot: Slot) {
  if (!teachers[klass.teacher].days.includes(slot.day)) return false;
  return !classes.some((other) => {
    if (other.id === klass.id || !same(pos[other.id], slot)) return false;
    return other.room === klass.room || other.teacher === klass.teacher;
  });
}

/**
 * Place `id` at `slot` the way the coordinator asked, then move whatever it
 * collides with (same room, or same teacher, at the same time) to the nearest
 * slot that's free for that room and teacher. Pinned classes never move; if
 * one is in the way, the move is refused with a plain explanation.
 */
export function resolve(
  pos: Positions,
  pinned: Record<string, boolean>,
  id: string,
  slot: Slot
): Resolution {
  const klass = classById[id];
  const next: Positions = { ...pos, [id]: slot };
  const here = classes.filter((c) => c.id !== id && same(next[c.id], slot));
  const roomClash = here.filter((c) => c.room === klass.room);
  const teacherClash = here.filter((c) => c.room !== klass.room && c.teacher === klass.teacher);
  const bumped = [...roomClash, ...teacherClash];

  const pinnedInWay = bumped.find((c) => pinned[c.id]);
  if (pinnedInWay) {
    return {
      ok: false,
      blockers: [pinnedInWay.id],
      message: {
        tone: 'blocked',
        title: `${pinnedInWay.name} is pinned to ${slotLong(slot)}`,
        detail: `Unpin it, or pick another slot for ${klass.name}.`
      }
    };
  }

  // A slot the moved class just left comes first, so dropping onto a class reads as a swap.
  const vacated = pos[id];
  const order = vacated ? [vacated, ...candidates(slot).filter((c) => !same(c, vacated))] : candidates(slot);
  const moves: Move[] = [];
  for (const other of bumped) {
    const target = order.find((c) => fits(next, other, c));
    if (!target) {
      const t = teachers[other.teacher];
      return {
        ok: false,
        blockers: [other.id],
        message: {
          tone: 'blocked',
          title: `No free slot for ${other.name} on ${t.short}’s days`,
          detail: `${klass.name} stays where it was. Unpin something or free a slot first.`
        }
      };
    }
    next[other.id] = target;
    moves.push({ id: other.id, from: slot, to: target });
  }

  const unavailable = !teachers[klass.teacher].days.includes(slot.day);
  const heads = unavailable
    ? `Heads up: ${teachers[klass.teacher].short} isn’t usually free on ${DAYS_LONG[slot.day]}s.`
    : undefined;

  let conflict: Message | undefined;
  if (bumped.length) {
    const room = palette.rooms[klass.room].name;
    if (roomClash.length) {
      conflict = {
        tone: 'conflict',
        title: `${room} is booked twice on ${slotLong(slot)}`,
        detail: teacherClash.length
          ? `${teachers[klass.teacher].short} is also teaching ${teacherClash[0].name} then`
          : `${roomClash[0].name} and ${klass.name} both need it`
      };
    } else {
      conflict = {
        tone: 'conflict',
        title: `${teachers[klass.teacher].short} is teaching twice on ${slotLong(slot)}`,
        detail: `${klass.name} and ${teacherClash[0].name}`
      };
    }
  }

  const result: Message = moves.length
    ? {
        tone: 'ok',
        title: `${moves.length} ${moves.length === 1 ? 'class' : 'classes'} moved · no enrolled families affected`,
        detail: heads ?? moves.map((m) => `${classById[m.id].name} → ${slotLabel(m.to)}`).join(' · ')
      }
    : {
        tone: unavailable ? 'info' : 'ok',
        title: `${klass.name} is on ${slotLong(slot)}`,
        detail: heads ?? 'No conflicts. Nothing else had to move.'
      };

  return {
    ok: true,
    pos: next,
    moves,
    clash: bumped.length ? [id, ...bumped.map((c) => c.id)] : [],
    conflict,
    result
  };
}

/** The finished week: the draft with Raku Firing placed on Tuesday at 4:30 and the solver's two moves. */
const finished = resolve(DRAFT, PINNED, 'raku', { day: 1, time: 1 });
export const FINISHED: Extract<Resolution, { ok: true }> = finished.ok
  ? finished
  : { ok: true, pos: DRAFT, moves: [], clash: [], result: { tone: 'draft', title: '' } };
