// Kittiwake's first route, Padstow to Bude, and the coastline its brand is
// traced from. Coordinates are real (approximate) longitudes and latitudes,
// projected to kilometres and drawn at 10 map units per kilometre.

type LonLat = readonly [number, number];
export type Pt = { x: number; y: number };

const LON0 = -4.99;
const LAT0 = 50.86;
const KM_PER_LON = 70.5;
const KM_PER_LAT = 111.2;
const UNITS_PER_KM = 10;

const project = ([lon, lat]: LonLat): Pt => ({
  x: (lon - LON0) * KM_PER_LON * UNITS_PER_KM,
  y: (LAT0 - lat) * KM_PER_LAT * UNITS_PER_KM
});

/** The map's extent in map units (roughly 32 × 38 km). */
export const MAP = { width: 322, height: 376 };

// West bank of the Camel estuary: from the open coast past Stepper Point,
// down to Padstow and on towards Little Petherick.
const westBank: LonLat[] = [
  [-4.99, 50.5655],
  [-4.976, 50.5672],
  [-4.962, 50.5728],
  [-4.949, 50.5748],
  [-4.9418, 50.5672],
  [-4.9376, 50.5585],
  [-4.9392, 50.5492],
  [-4.9372, 50.5418],
  [-4.932, 50.5352],
  [-4.922, 50.5292],
  [-4.906, 50.5232],
  [-4.892, 50.5198]
];

// East bank and open coast: Rock, Polzeath, Pentire, Port Isaac, Tintagel,
// Boscastle, Crackington Haven, Widemouth, Bude.
const eastCoast: LonLat[] = [
  [-4.889, 50.5262],
  [-4.904, 50.5322],
  [-4.9168, 50.5398],
  [-4.9212, 50.5462], // Rock
  [-4.9248, 50.5552],
  [-4.9296, 50.5626], // Daymer Bay
  [-4.9258, 50.5688],
  [-4.917, 50.5722], // Polzeath
  [-4.9226, 50.5806],
  [-4.9322, 50.5902], // Pentire Point
  [-4.921, 50.5948],
  [-4.9108, 50.5982], // The Rumps
  [-4.9026, 50.5918],
  [-4.889, 50.5922], // Lundy Bay
  [-4.8786, 50.5962],
  [-4.8702, 50.5878], // Port Quin
  [-4.8618, 50.5958], // Kellan Head
  [-4.8476, 50.5952],
  [-4.8362, 50.5982],
  [-4.8312, 50.5928], // Port Isaac
  [-4.8228, 50.5978],
  [-4.8122, 50.6068],
  [-4.7958, 50.6186],
  [-4.7762, 50.6318],
  [-4.7628, 50.6418], // Trebarwith Strand
  [-4.7702, 50.6548],
  [-4.7652, 50.6668], // Tintagel Island
  [-4.7528, 50.6688], // Tintagel
  [-4.7422, 50.6738],
  [-4.7282, 50.6766],
  [-4.7118, 50.6832],
  [-4.6988, 50.6922],
  [-4.6926, 50.6878], // Boscastle
  [-4.6858, 50.6948],
  [-4.6752, 50.7032],
  [-4.6604, 50.7142],
  [-4.6482, 50.7272],
  [-4.6458, 50.7402], // Cambeak
  [-4.6352, 50.7392], // Crackington Haven
  [-4.6282, 50.7482],
  [-4.6122, 50.7602],
  [-4.5902, 50.7722],
  [-4.5702, 50.7852],
  [-4.5632, 50.8002], // Widemouth
  [-4.5602, 50.8152],
  [-4.5522, 50.8282],
  [-4.5478, 50.8312], // Bude
  [-4.5548, 50.8402],
  [-4.5562, 50.86]
];

export const westPoints = westBank.map(project);
export const coastPoints = eastCoast.map(project);

const ROCK = 3;
const BUDE = 46;

/** Indexes into `coastPoints` for each stop after Padstow. */
const STOP_COAST_INDEX = [19, 27, 32, 38, BUDE];

const padstow = project([-4.9358, 50.5418]);

// The walking line: Padstow, the ferry to Rock, then the coast path to Bude.
const routePoints: Pt[] = [padstow, ...coastPoints.slice(ROCK, BUDE + 1)];
const routeStopIndex = [0, ...STOP_COAST_INDEX.map((i) => i - ROCK + 1)];

/* ------------------------------------------------------------------ */
/* Smooth paths                                                        */
/* ------------------------------------------------------------------ */

const f = (n: number) => Math.round(n * 100) / 100;

/** A Catmull-Rom spline through the points, as cubic Bézier segments. */
function segments(points: Pt[]) {
  const out: [Pt, Pt, Pt, Pt][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    out.push([
      p1,
      { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      p2
    ]);
  }
  return out;
}

export function smoothPath(points: Pt[]) {
  const segs = segments(points);
  if (!segs.length) return '';
  let d = `M${f(points[0].x)} ${f(points[0].y)}`;
  for (const [, c1, c2, p] of segs) {
    d += `C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(p.x)} ${f(p.y)}`;
  }
  return d;
}

const bez = (s: [Pt, Pt, Pt, Pt], t: number): Pt => {
  const m = 1 - t;
  const a = m * m * m;
  const b = 3 * m * m * t;
  const c = 3 * m * t * t;
  const d = t * t * t;
  return {
    x: a * s[0].x + b * s[1].x + c * s[2].x + d * s[3].x,
    y: a * s[0].y + b * s[1].y + c * s[2].y + d * s[3].y
  };
};

/* ------------------------------------------------------------------ */
/* The route, sampled for the walker                                   */
/* ------------------------------------------------------------------ */

const STEPS = 24;
const routeSegs = segments(routePoints);
const samples: Pt[] = [];
const lengths: number[] = [];
{
  let total = 0;
  let prev: Pt | null = null;
  routeSegs.forEach((seg, i) => {
    for (let s = i === 0 ? 0 : 1; s <= STEPS; s++) {
      const p = bez(seg, s / STEPS);
      if (prev) total += Math.hypot(p.x - prev.x, p.y - prev.y);
      samples.push(p);
      lengths.push(total);
      prev = p;
    }
  });
}

export const ROUTE_LENGTH = lengths[lengths.length - 1];
export const routePath = smoothPath(routePoints);
/** Arc length along the route at each of the six stops. */
export const stopLengths = routeStopIndex.map((i) => lengths[i * STEPS]);
export const stopPoints = routeStopIndex.map((i) => samples[i * STEPS]);

/** A point on the route `length` units from Padstow, with its heading. */
export function pointAt(length: number): Pt & { angle: number } {
  const L = Math.max(0, Math.min(ROUTE_LENGTH, length));
  let lo = 0;
  let hi = lengths.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (lengths[mid] < L) lo = mid;
    else hi = mid;
  }
  const span = lengths[hi] - lengths[lo] || 1;
  const t = (L - lengths[lo]) / span;
  const a = samples[lo];
  const b = samples[hi];
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    angle: Math.atan2(b.y - a.y, b.x - a.x)
  };
}

/** Route position 0–5 (stop index, fractional while walking) to arc length. */
export function lengthAt(pos: number) {
  const p = Math.max(0, Math.min(5, pos));
  const i = Math.min(4, Math.floor(p));
  const frac = p - i;
  return stopLengths[i] + (stopLengths[i + 1] - stopLengths[i]) * frac;
}

/** Day 1 is arrival in Padstow; day n ends at stop n − 1. */
export const dayAt = (pos: number) => (pos <= 0.001 ? 1 : Math.min(6, Math.ceil(pos - 0.001) + 1));

/* ------------------------------------------------------------------ */
/* Land and sea                                                        */
/* ------------------------------------------------------------------ */

const westD = smoothPath(westPoints);
const eastD = smoothPath(coastPoints);
export const westCoastPath = westD;
export const eastCoastPath = eastD;

/** Land west of the estuary, closed along the map's left and bottom edges. */
export const westLandPath = `${westD}L${f(westPoints[westPoints.length - 1].x)} ${MAP.height + 20}L-20 ${MAP.height + 20}L-20 ${f(westPoints[0].y)}Z`;
/** Land east of the estuary and the coast, closed along the right edge. */
export const eastLandPath = `${eastD}L${f(coastPoints[coastPoints.length - 1].x)} -20L${MAP.width + 20} -20L${MAP.width + 20} ${MAP.height + 20}L${f(coastPoints[0].x)} ${MAP.height + 20}Z`;

/* ------------------------------------------------------------------ */
/* The tide-line: the same coast, turned to run left to right           */
/* ------------------------------------------------------------------ */

/**
 * The brand line: the coast from Pentire Point to Bude, rotated so it runs
 * level, with the sea above. Returns a path that fits `width` × `height`,
 * its baseline at `height` × 0.62.
 */
export function tideLine(width: number, height: number, from = 9, to = BUDE) {
  return smoothPath(tidePoints(width, height, from, to));
}

function tidePoints(width: number, height: number, from = 9, to = BUDE) {
  const pts = coastPoints.slice(from, to + 1);
  const a = pts[0];
  const b = pts[pts.length - 1];
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);
  const rotated = pts.map((p) => {
    const dx = p.x - a.x;
    const dy = p.y - a.y;
    return { x: dx * cos - dy * sin, y: dx * sin + dy * cos };
  });
  const len = rotated[rotated.length - 1].x;
  const minY = Math.min(...rotated.map((p) => p.y));
  const maxY = Math.max(...rotated.map((p) => p.y));
  const sx = width / len;
  const sy = (height * 0.9) / (maxY - minY || 1);
  return rotated.map((p) => ({ x: p.x * sx, y: height * 0.05 + (p.y - minY) * sy }));
}

/** Where named coast points land on the tide-line (Pentire Point is index 9). */
export function tideMarks(width: number, height: number, indices: number[]) {
  const pts = tidePoints(width, height);
  return indices.map((i) => pts[i - 9]);
}

/** The coast from Pentire Point to Bude as it sits on the map. */
export const pentireToBude = coastPoints.slice(9, BUDE + 1);

/** The tide-line as a dense polyline, for cutting shapes along it. */
export function tideLinePoints(width: number, height: number, from = 9, to = BUDE) {
  const out: Pt[] = [];
  segments(tidePoints(width, height, from, to)).forEach((seg, i) => {
    for (let s = i === 0 ? 0 : 1; s <= 8; s++) out.push(bez(seg, s / 8));
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* The trip                                                            */
/* ------------------------------------------------------------------ */

export type Stop = {
  name: string;
  short: string;
  inn: string;
  bagsBy: string;
};

export const stops: Stop[] = [
  { name: 'Padstow', short: 'Padstow', inn: 'the Quay House', bagsBy: '2 pm' },
  { name: 'Port Isaac', short: 'Port Isaac', inn: 'the Harbour Inn', bagsBy: '3 pm' },
  { name: 'Tintagel', short: 'Tintagel', inn: 'Trevena House', bagsBy: '3 pm' },
  { name: 'Boscastle', short: 'Boscastle', inn: 'the Valency Rooms', bagsBy: '1 pm' },
  { name: 'Crackington Haven', short: 'Crackington', inn: 'Cleave Farm', bagsBy: '3 pm' },
  { name: 'Bude', short: 'Bude', inn: 'the Breakwater', bagsBy: '4 pm' }
];

export type Day = {
  day: number;
  title: string;
  km: number;
  /** Hours of walking, not counting stops. */
  hours: number;
  /** Total climb in flights of stairs (one flight is about 3 metres). */
  flights: number;
  metres: number;
  note: string;
  /** Where the luggage goes that morning. */
  bags: string;
};

export const days: Day[] = [
  {
    day: 1,
    title: 'Arrive in Padstow',
    km: 7,
    hours: 2,
    flights: 40,
    metres: 120,
    note: 'An optional loop out to Stepper Point and back.',
    bags: 'Your bags are waiting at the Quay House, Padstow'
  },
  {
    day: 2,
    title: 'Padstow to Port Isaac',
    km: 19,
    hours: 6,
    flights: 230,
    metres: 690,
    note: 'Ferry to Rock, then round Pentire Point and the Rumps.',
    bags: 'Your bags reach the Harbour Inn, Port Isaac by 3 pm'
  },
  {
    day: 3,
    title: 'Port Isaac to Tintagel',
    km: 14,
    hours: 5.5,
    flights: 290,
    metres: 870,
    note: 'The hardest day: seven steep valleys in 14 km.',
    bags: 'Your bags reach Trevena House, Tintagel by 3 pm'
  },
  {
    day: 4,
    title: 'Tintagel to Boscastle',
    km: 7.5,
    hours: 2.5,
    flights: 110,
    metres: 330,
    note: 'A short day. Rocky Valley, then Boscastle by lunch.',
    bags: 'Your bags reach the Valency Rooms, Boscastle by 1 pm'
  },
  {
    day: 5,
    title: 'Boscastle to Crackington Haven',
    km: 11,
    hours: 4,
    flights: 185,
    metres: 560,
    note: 'Over High Cliff, the tallest in Cornwall.',
    bags: 'Your bags reach Cleave Farm, Crackington by 3 pm'
  },
  {
    day: 6,
    title: 'Crackington Haven to Bude',
    km: 16,
    hours: 5.5,
    flights: 215,
    metres: 640,
    note: 'Millook’s zigzag cliffs, then Widemouth’s sands.',
    bags: 'Your bags reach the Breakwater, Bude by 4 pm'
  }
];

/** 5.5 → "5½". */
export const hoursLabel = (h: number) => {
  const whole = Math.floor(h);
  const rest = h - whole;
  const frac = rest >= 0.74 ? '¾' : rest >= 0.49 ? '½' : rest >= 0.24 ? '¼' : '';
  return `${whole || (frac ? '' : '0')}${frac}`;
};
