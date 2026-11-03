import type { CSSProperties, ReactNode } from 'react';
import { u } from '~/components/stage';
import { palette } from '../theme';

/** Lengths for a screen drawn at `k` times its design size. */
export const scale = (k: number) => (n: number) => u(n * k);

export const C = {
  ...palette,
  /** The editor canvas behind the page sheet. */
  canvas: '#F9EEE6',
  /** Background of a block the agent is still offering. */
  tint: '#FEF5F1',
  keptTint: '#E7F2EB',
  hairline: 'rgba(43, 26, 20, 0.12)'
};

export const tabular: CSSProperties = { fontVariantNumeric: 'tabular-nums' };

/** Openhand's mark: an open hand cupping a coin. */
export function Mark({ size }: { size: string }) {
  return (
    <svg viewBox='0 0 24 24' style={{ width: size, height: size, display: 'block', flexShrink: 0 }} aria-hidden>
      <rect width='24' height='24' rx='6.5' fill={C.ember} />
      <path
        d='M5.6 11.6c.4 3.6 3.1 6.2 6.4 6.2s6-2.6 6.4-6.2'
        fill='none'
        stroke={C.white}
        strokeWidth='2.4'
        strokeLinecap='round'
      />
      <circle cx='12' cy='7.6' r='2.3' fill={C.white} />
    </svg>
  );
}

export function Wordmark({ k = 1, size = 13.5 }: { k?: number; size?: number }) {
  const s = scale(k);
  return (
    <span className='inline-flex items-center' style={{ gap: s(size * 0.45) }}>
      <Mark size={s(size * 1.35)} />
      <span style={{ fontSize: s(size), fontWeight: 760, letterSpacing: '-0.015em', color: C.ink }}>
        Openhand
      </span>
    </span>
  );
}

export function QuoteGlyph({ size }: { size: string }) {
  return (
    <svg viewBox='0 0 11 8' style={{ width: size, height: `calc(${size} * 0.73)`, display: 'block', flexShrink: 0 }} aria-hidden>
      <path
        d='M0 8V4.8C0 2.2 1.3.6 3.9 0l.5 1.1C3 1.6 2.4 2.5 2.3 3.6h1.9V8H0Zm6.3 0V4.8C6.3 2.2 7.6.6 10.2 0l.5 1.1C9.3 1.6 8.7 2.5 8.6 3.6h1.9V8H6.3Z'
        fill={C.ember}
      />
    </svg>
  );
}

export function Check({ size, color = 'currentColor', weight = 2 }: { size: string; color?: string; weight?: number }) {
  return (
    <svg viewBox='0 0 12 12' style={{ width: size, height: size, display: 'block', flexShrink: 0 }} aria-hidden>
      <path d='M2.2 6.4 4.9 9 9.9 3.2' fill='none' stroke={color} strokeWidth={weight} strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

/** Where a number on the page came from. The agent never writes one without this. */
export function SourceTag({ k = 1, children, size = 11 }: { k?: number; children: ReactNode; size?: number }) {
  const s = scale(k);
  return (
    <span
      className='inline-flex items-center'
      style={{
        gap: s(4),
        height: s(size + 6),
        padding: `0 ${s(6.5)} 0 ${s(5.5)}`,
        borderRadius: s(9),
        background: C.peach,
        color: C.ink,
        fontSize: s(size),
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap'
      }}
    >
      <QuoteGlyph size={s(size * 0.78)} />
      {children}
    </span>
  );
}

/** A small round status light. */
export function Dot({ size, color, ring = false }: { size: string; color: string; ring?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        background: ring ? 'transparent' : color,
        boxShadow: ring ? `inset 0 0 0 calc(${size} * 0.24) ${color}` : undefined
      }}
    />
  );
}

/** The agent's arrow, for compositions that aren't live. */
export function StillCursor({
  k = 1,
  x,
  y,
  label,
  color = C.ember,
  ink = C.white
}: {
  k?: number;
  x: number;
  y: number;
  label?: string;
  color?: string;
  ink?: string;
}) {
  const s = scale(k);
  return (
    <div aria-hidden className='absolute' style={{ left: s(x), top: s(y), zIndex: 30 }}>
      <svg viewBox='0 0 14 20' style={{ width: s(15), height: s(21), display: 'block', overflow: 'visible' }}>
        <path
          d='M1 1 L1 16.2 L4.9 12.6 L7.6 18.6 L10.3 17.4 L7.7 11.6 L13 11.3 Z'
          fill={color}
          stroke={ink}
          strokeWidth='1.3'
          strokeLinejoin='round'
        />
      </svg>
      {label ? (
        <span
          className='absolute'
          style={{
            left: s(13),
            top: s(17),
            background: color,
            color: ink,
            fontSize: s(11),
            fontWeight: 600,
            lineHeight: 1,
            padding: `${s(4)} ${s(7)}`,
            borderRadius: s(6),
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em'
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

/*
 * Keyframes for drafted content arriving. They only run on blocks that are
 * pending, so the finished page (server render, stills) never animates.
 */
const css = `
@keyframes oh-in { from { opacity: 0; transform: translateY(calc(var(--u) * 5)); } to { opacity: 1; transform: none; } }
@keyframes oh-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes oh-pop { from { opacity: 0; transform: scale(.55); } to { opacity: 1; transform: none; } }
@keyframes oh-kept { 0% { opacity: 0; transform: scale(.8); } 14% { opacity: 1; transform: none; } 78% { opacity: 1; } 100% { opacity: 0; } }
@keyframes oh-caret { 50% { opacity: 0; } }
@keyframes oh-breathe { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes oh-glow { 0% { background-color: rgba(232, 85, 47, 0); } 30% { background-color: rgba(232, 85, 47, .28); } 100% { background-color: rgba(232, 85, 47, .12); } }
.oh-in { animation: oh-in 460ms cubic-bezier(.2, .8, .2, 1) both; }
.oh-fade { animation: oh-fade 360ms ease both; }
.oh-pop { animation: oh-pop 420ms cubic-bezier(.3, 1.5, .5, 1) both; transform-box: fill-box; transform-origin: 50% 100%; }
.oh-kept { animation: oh-kept 1500ms ease both; }
.oh-caret { animation: oh-caret 900ms steps(1) infinite; }
.oh-breathe { animation: oh-breathe 1400ms ease-in-out infinite; }
.oh-glow { animation: oh-glow 700ms ease both; }
.oh-btn { position: relative; }
.oh-btn::before { content: ''; position: absolute; left: 0; right: 0; top: calc(var(--u) * -6); bottom: calc(var(--u) * -6); }
.oh-btn:focus-visible { outline: 2px solid #C23F1D; outline-offset: 2px; }
`;

export function OpenhandStyles() {
  return (
    <style href='openhand-keyframes' precedence='medium'>
      {css}
    </style>
  );
}
