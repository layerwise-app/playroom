// The draft the Openhand agent builds: five of the twelve blocks, each one
// pending until a person keeps it. Shared by the live demo and the stills.

export type BlockId = 'hero' | 'goal' | 'story' | 'photo' | 'donate';
export const ORDER: BlockId[] = ['hero', 'goal', 'story', 'photo', 'donate'];

export const BLOCK_NAME: Record<BlockId, string> = {
  hero: 'Hero',
  goal: 'Goal',
  story: 'Story',
  photo: 'Photo',
  donate: 'Donate'
};

/** Openhand's whole block library. The agent can only place these. */
export const LIBRARY: { name: string; id?: BlockId }[] = [
  { name: 'Hero', id: 'hero' },
  { name: 'Goal', id: 'goal' },
  { name: 'Story', id: 'story' },
  { name: 'Photo', id: 'photo' },
  { name: 'Donate', id: 'donate' },
  { name: 'Updates' },
  { name: 'Team' },
  { name: 'Gallery' },
  { name: 'Video' },
  { name: 'FAQ' },
  { name: 'Map' },
  { name: 'Sponsors' }
];

export type BlockStatus = 'empty' | 'drafting' | 'pending' | 'kept';
export type BlockState = { status: BlockStatus; variant: number };

export type DraftState = {
  blocks: Record<BlockId, BlockState>;
  /** The hero headline while the agent types it. */
  typed: string | null;
  /** The block the agent is dragging from the rail. */
  carrying: BlockId | null;
  /** The agent is reading a fact from the brief. */
  reading: boolean;
  /** Plays the small "Kept" confirmation once. */
  justKept: BlockId | null;
  published: boolean;
};

export const ORG = 'Riverside Tool Library';
export const BRIEF = {
  before: 'We need ',
  amount: '$18,000',
  middle: ' by ',
  date: 'Nov 30',
  after: ' to fix our leaking roof.'
};
export const BRIEF_TEXT = `${BRIEF.before}${BRIEF.amount}${BRIEF.middle}${BRIEF.date}${BRIEF.after}`;

export const HEADLINES = [
  'Fix the roof before winter',
  'Keep the tools dry this winter',
  'A dry roof for borrowed tools'
];

export const STORIES = [
  {
    kind: 'text' as const,
    heading: 'Why the roof can’t wait',
    body: 'Rain drips onto the shelves that hold the tools you borrow. A new roof keeps us lending all winter.'
  },
  { kind: 'quote' as const, heading: '', body: BRIEF_TEXT },
  {
    kind: 'text' as const,
    heading: 'What your gift fixes',
    body: 'New roofing over the tool room, sealed before the first snow, so every shelf stays open for lending.'
  }
];

export const DONATION_AMOUNTS = ['$25', '$60', '$120'];

/** How many real alternatives "Try another" cycles through. */
export const VARIANTS: Record<BlockId, number> = {
  hero: 3,
  goal: 2,
  story: 3,
  photo: 3,
  donate: 2
};

/** What the agent drafts first. Hero starts one swap away from the kept version. */
export const FIRST_DRAFT: Record<BlockId, number> = {
  hero: 2,
  goal: 0,
  story: 0,
  photo: 0,
  donate: 0
};

const all = (status: BlockStatus, variants: Partial<Record<BlockId, number>> = {}) =>
  Object.fromEntries(
    ORDER.map((id) => [id, { status, variant: variants[id] ?? 0 }])
  ) as Record<BlockId, BlockState>;

const base: Omit<DraftState, 'blocks'> = {
  typed: null,
  carrying: null,
  reading: false,
  justKept: null,
  published: false
};

export const FINISHED: DraftState = { ...base, blocks: all('kept') };
export const EMPTY: DraftState = { ...base, blocks: all('empty') };

export function draftWith(
  statuses: Partial<Record<BlockId, BlockStatus>>,
  variants: Partial<Record<BlockId, number>> = {},
  extra: Partial<DraftState> = {}
): DraftState {
  const blocks = all('empty', variants);
  for (const id of ORDER) {
    blocks[id] = { status: statuses[id] ?? 'empty', variant: variants[id] ?? FIRST_DRAFT[id] };
  }
  return { ...base, ...extra, blocks };
}

export const isIncomplete = (state: DraftState) =>
  ORDER.some((id) => {
    const status = state.blocks[id].status;
    return status === 'empty' || status === 'drafting';
  });

export const nextToDraft = (state: DraftState) =>
  ORDER.find((id) => {
    const status = state.blocks[id].status;
    return status === 'empty' || status === 'drafting';
  }) ?? null;

export const pendingCount = (state: DraftState) =>
  ORDER.filter((id) => state.blocks[id].status === 'pending').length;

export const allKept = (state: DraftState) =>
  ORDER.every((id) => state.blocks[id].status === 'kept');

export type Status =
  | { kind: 'drafting'; block: BlockId }
  | { kind: 'paused' }
  | { kind: 'review'; count: number }
  | { kind: 'ready' }
  | { kind: 'published' };

export function statusOf(state: DraftState, agentActive: boolean): Status {
  if (state.published) return { kind: 'published' };
  const next = nextToDraft(state);
  if (next) return agentActive ? { kind: 'drafting', block: next } : { kind: 'paused' };
  const count = pendingCount(state);
  if (count > 0) return { kind: 'review', count };
  return { kind: 'ready' };
}

export type Action =
  | { type: 'reset' }
  | { type: 'pick'; id: BlockId }
  | { type: 'place'; id: BlockId }
  | { type: 'type'; text: string }
  | { type: 'read'; on: boolean }
  | { type: 'fill'; id: BlockId }
  | { type: 'try'; id: BlockId }
  | { type: 'keep'; id: BlockId }
  | { type: 'publish' }
  | { type: 'draftAll' };

export function reducer(state: DraftState, action: Action): DraftState {
  const set = (id: BlockId, next: Partial<BlockState>) => ({
    ...state.blocks,
    [id]: { ...state.blocks[id], ...next }
  });
  switch (action.type) {
    case 'reset':
      return EMPTY;
    case 'pick':
      return { ...state, carrying: action.id };
    case 'place':
      return {
        ...state,
        carrying: null,
        typed: action.id === 'hero' ? '' : state.typed,
        blocks: set(action.id, { status: 'drafting' })
      };
    case 'type':
      return { ...state, typed: action.text };
    case 'read':
      return { ...state, reading: action.on };
    case 'fill':
      return {
        ...state,
        reading: false,
        typed: action.id === 'hero' ? null : state.typed,
        blocks: set(action.id, { status: 'pending', variant: FIRST_DRAFT[action.id] })
      };
    case 'try': {
      const block = state.blocks[action.id];
      if (block.status !== 'pending') return state;
      return {
        ...state,
        blocks: set(action.id, { variant: (block.variant + 1) % VARIANTS[action.id] })
      };
    }
    case 'keep':
      if (state.blocks[action.id].status !== 'pending') return state;
      return { ...state, justKept: action.id, blocks: set(action.id, { status: 'kept' }) };
    case 'publish':
      return allKept(state) ? { ...state, published: true, justKept: null } : state;
    case 'draftAll': {
      const blocks = { ...state.blocks };
      for (const id of ORDER) {
        const status = blocks[id].status;
        if (status === 'empty' || status === 'drafting') {
          blocks[id] = { status: 'pending', variant: FIRST_DRAFT[id] };
        }
      }
      return { ...state, blocks, carrying: null, typed: null, reading: false };
    }
  }
}
