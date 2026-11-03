import type { CSSProperties, ReactNode } from 'react';
import { u } from '~/components/stage';
import { cn } from '~/lib/utils';
import { fontFamily, palette } from '../theme';
import { ChevronGlyph, SundialMark } from '../ui';

/* Shared pieces of Sundial's desktop app. Sizes are stage units at 1:1. */

export const neutralRoom = { fill: '#E9ECF4', ink: '#323B57' };

export type Tint = { fill: string; ink: string };

export const tint = (room: string): Tint =>
  room in palette.rooms ? palette.rooms[room as keyof typeof palette.rooms] : neutralRoom;

export function Screen({
  children,
  className,
  style
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', className)}
      style={{ fontFamily, color: palette.ink, background: palette.paper, ...style }}
    >
      {children}
    </div>
  );
}

const TABS = ['Week', 'By room', 'Teachers', 'Changes'] as const;
export type Tab = (typeof TABS)[number];

export function AppBar({ tab, changes = 6, term = 'Fall 2024' }: { tab: Tab; changes?: number; term?: string }) {
  return (
    <div
      className='flex shrink-0 items-center'
      style={{ height: u(54), paddingInline: u(20), gap: u(18), borderBottom: `1px solid ${palette.rule}` }}
    >
      <div className='flex items-center' style={{ gap: u(8) }}>
        <SundialMark size={20} />
        <span style={{ fontSize: u(18), fontWeight: 600, letterSpacing: '-0.01em' }}>Sundial</span>
      </div>
      <span style={{ width: 1, height: u(22), background: palette.rule }} />
      <div className='flex items-center' style={{ gap: u(8) }}>
        <span style={{ fontSize: u(15), fontWeight: 600 }}>{term}</span>
        <span
          style={{
            fontSize: u(12),
            fontWeight: 600,
            color: palette.cobaltDeep,
            background: palette.ice,
            padding: `${u(3)} ${u(7)}`,
            borderRadius: u(5)
          }}
        >
          Draft 3
        </span>
        <ChevronGlyph size={11} color={palette.inkSoft} />
      </div>
      <nav className='flex h-full items-stretch' style={{ gap: u(4), marginLeft: u(14) }}>
        {TABS.map((name) => {
          const active = name === tab;
          return (
            <span
              key={name}
              className='flex items-center'
              style={{
                paddingInline: u(12),
                gap: u(6),
                fontSize: u(14),
                fontWeight: active ? 600 : 500,
                color: active ? palette.ink : palette.inkSoft,
                boxShadow: active ? `inset 0 ${u(-2.5)} 0 ${palette.cobalt}` : undefined
              }}
            >
              {name}
              {name === 'Changes' && changes ? (
                <span
                  className='tabular'
                  style={{
                    fontSize: u(11),
                    fontWeight: 600,
                    color: '#fff',
                    background: palette.cobalt,
                    minWidth: u(18),
                    textAlign: 'center',
                    padding: `${u(1.5)} ${u(5)}`,
                    borderRadius: u(9)
                  }}
                >
                  {changes}
                </span>
              ) : null}
            </span>
          );
        })}
      </nav>
      <div className='ml-auto flex items-center' style={{ gap: u(10) }}>
        <Button>Export to sheet</Button>
        <Button primary>Review and publish</Button>
        <Avatar initials='IA' color='#2F5321' fill='#DFEBD8' size={32} />
      </div>
    </div>
  );
}

export function Button({
  children,
  primary,
  danger,
  small,
  style
}: {
  children: ReactNode;
  primary?: boolean;
  danger?: boolean;
  small?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      className='inline-flex shrink-0 items-center justify-center whitespace-nowrap'
      style={{
        height: u(small ? 30 : 34),
        paddingInline: u(small ? 11 : 14),
        gap: u(6),
        borderRadius: u(8),
        fontSize: u(small ? 13 : 14),
        fontWeight: 600,
        color: primary ? '#fff' : danger ? '#B42A1B' : palette.ink,
        background: primary ? palette.cobalt : palette.paper,
        border: primary ? `1px solid ${palette.cobalt}` : `1px solid ${palette.rule}`,
        boxShadow: primary ? `0 1px 0 ${palette.cobaltDeep}` : '0 1px 0 rgba(18,26,51,.04)',
        ...style
      }}
    >
      {children}
    </span>
  );
}

export function Avatar({
  initials,
  color,
  fill,
  size = 28
}: {
  initials: string;
  color: string;
  fill: string;
  size?: number;
}) {
  return (
    <span
      className='inline-flex shrink-0 items-center justify-center'
      style={{
        width: u(size),
        height: u(size),
        borderRadius: '50%',
        background: fill,
        color,
        fontSize: u(size * 0.4),
        fontWeight: 600,
        letterSpacing: '0.02em'
      }}
    >
      {initials}
    </span>
  );
}

export function Swatch({ room, size = 10 }: { room: string; size?: number }) {
  const t = tint(room);
  return (
    <span
      className='inline-block shrink-0'
      style={{
        width: u(size),
        height: u(size),
        borderRadius: u(3),
        background: t.fill,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${t.ink} 30%, transparent)`
      }}
    />
  );
}

export function Eyebrow({ children, color = palette.inkSoft, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <p
      style={{
        fontSize: u(12),
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color,
        ...style
      }}
    >
      {children}
    </p>
  );
}

export function Check({ checked, size = 15 }: { checked: boolean; size?: number }) {
  return (
    <span
      className='inline-flex shrink-0 items-center justify-center'
      style={{
        width: u(size),
        height: u(size),
        borderRadius: u(4),
        background: checked ? palette.cobalt : palette.paper,
        border: checked ? 'none' : `1.5px solid #B9C1D6`
      }}
    >
      {checked ? (
        <svg viewBox='0 0 12 12' style={{ width: u(size * 0.7), height: u(size * 0.7) }} aria-hidden>
          <path d='M2.5 6.2 L5 8.6 L9.6 3.6' fill='none' stroke='#fff' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      ) : null}
    </span>
  );
}
