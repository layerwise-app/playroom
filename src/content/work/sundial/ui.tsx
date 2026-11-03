import type { CSSProperties } from 'react';
import { u } from '~/components/stage';
import { palette } from './theme';

/* Small functional glyphs for Sundial, drawn by hand. Sizes in stage units. */

/** The Sundial mark: a dial with the gnomon's shadow falling across it. */
export function SundialMark({ size = 16, color = palette.cobalt }: { size?: number; color?: string }) {
  return (
    <svg viewBox='0 0 16 16' aria-hidden style={{ width: u(size), height: u(size), display: 'block' }}>
      <path d='M1.5 10.5a6.5 6.5 0 0 1 13 0Z' fill={color} />
      <path d='M8 10.5 L12.6 4.6' stroke='#fff' strokeWidth='1.6' strokeLinecap='round' />
      <rect x='1' y='12' width='14' height='2' rx='1' fill={color} />
    </svg>
  );
}

export function PinGlyph({
  pinned,
  size = 11,
  color = 'currentColor',
  style
}: {
  pinned: boolean;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox='0 0 12 12' aria-hidden style={{ width: u(size), height: u(size), display: 'block', ...style }}>
      <path
        d='M7.4 1.2 L10.8 4.6 L9.7 5.2 L7.7 7.6 L7.9 9.4 L7 10.3 L4.8 8.1 L2 10.9 L1.1 10 L3.9 7.2 L1.7 5 L2.6 4.1 L4.4 4.3 L6.8 2.3 Z'
        fill={pinned ? color : 'none'}
        stroke={color}
        strokeWidth='1.1'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export function CheckGlyph({ size = 14, color = palette.cobalt }: { size?: number; color?: string }) {
  return (
    <svg viewBox='0 0 14 14' aria-hidden style={{ width: u(size), height: u(size), display: 'block', flexShrink: 0 }}>
      <circle cx='7' cy='7' r='7' fill={color} />
      <path d='M4 7.2 L6.1 9.2 L10 5' fill='none' stroke='#fff' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

export function AlertGlyph({ size = 14, color = palette.conflict }: { size?: number; color?: string }) {
  return (
    <svg viewBox='0 0 14 14' aria-hidden style={{ width: u(size), height: u(size), display: 'block', flexShrink: 0 }}>
      <circle cx='7' cy='7' r='7' fill={color} />
      <path d='M7 3.6 V7.8' stroke='#fff' strokeWidth='1.7' strokeLinecap='round' />
      <circle cx='7' cy='10.2' r='1' fill='#fff' />
    </svg>
  );
}

export function PlusGlyph({ size = 14, color = palette.cobalt }: { size?: number; color?: string }) {
  return (
    <svg viewBox='0 0 14 14' aria-hidden style={{ width: u(size), height: u(size), display: 'block', flexShrink: 0 }}>
      <circle cx='7' cy='7' r='6.2' fill='none' stroke={color} strokeWidth='1.4' strokeDasharray='2.2 1.6' />
      <path d='M7 4.3 V9.7 M4.3 7 H9.7' stroke={color} strokeWidth='1.5' strokeLinecap='round' />
    </svg>
  );
}

export function ResetGlyph({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg viewBox='0 0 12 12' aria-hidden style={{ width: u(size), height: u(size), display: 'block', flexShrink: 0 }}>
      <path d='M2.6 4.2 A4 4 0 1 1 2.2 7.4' fill='none' stroke={color} strokeWidth='1.4' strokeLinecap='round' />
      <path d='M1.6 1.8 L2.6 4.4 L5.2 3.6' fill='none' stroke={color} strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

export function ArrowGlyph({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg viewBox='0 0 12 12' aria-hidden style={{ width: u(size), height: u(size), display: 'inline-block', flexShrink: 0 }}>
      <path d='M1.5 6 H10 M6.8 2.8 L10 6 L6.8 9.2' fill='none' stroke={color} strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

export function ChevronGlyph({ size = 10, color = 'currentColor', dir = 'down' }: { size?: number; color?: string; dir?: 'down' | 'right' | 'left' }) {
  const rotate = dir === 'down' ? 0 : dir === 'right' ? -90 : 90;
  return (
    <svg viewBox='0 0 10 10' aria-hidden style={{ width: u(size), height: u(size), display: 'block', flexShrink: 0, transform: `rotate(${rotate}deg)` }}>
      <path d='M2 3.6 L5 6.6 L8 3.6' fill='none' stroke={color} strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}
