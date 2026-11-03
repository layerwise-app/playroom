import type { CSSProperties, ReactNode } from 'react';
import { u } from '~/components/stage';
import { cn } from '~/lib/utils';

/*
 * Device frames drawn in code around real screens. All sizes are stage units,
 * so use these inside a <Stage>.
 */

/** A quiet browser window: three neutral dots and an address. */
export function BrowserWindow({
  url,
  children,
  tone = 'light',
  className,
  style
}: {
  url?: string;
  children: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
  style?: CSSProperties;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn('flex flex-col overflow-hidden', className)}
      style={{
        borderRadius: u(12),
        background: dark ? '#1d1d1f' : '#ffffff',
        boxShadow: `0 0 0 1px ${dark ? 'rgba(255,255,255,.08)' : 'rgba(20,16,10,.08)'}, 0 ${u(24)} ${u(60)} ${u(-24)} rgba(20,16,10,.45), 0 ${u(2)} ${u(6)} rgba(20,16,10,.08)`,
        ...style
      }}
    >
      <div
        className='relative flex shrink-0 items-center'
        style={{
          height: u(30),
          paddingInline: u(12),
          gap: u(6),
          background: dark ? '#2a2a2d' : '#f3f2ef',
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,.06)' : 'rgba(20,16,10,.07)'}`
        }}
      >
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{
              width: u(8),
              height: u(8),
              borderRadius: '50%',
              background: dark ? '#4a4a4e' : '#d9d6cf'
            }}
          />
        ))}
        {url ? (
          <span
            className='absolute left-1/2 -translate-x-1/2 truncate'
            style={{
              maxWidth: '60%',
              fontSize: u(10.5),
              lineHeight: 1,
              padding: `${u(5)} ${u(14)}`,
              borderRadius: u(6),
              color: dark ? '#a1a1a6' : '#6b665e',
              background: dark ? '#1d1d1f' : '#ffffff',
              fontFamily: 'ui-sans-serif, system-ui, sans-serif'
            }}
          >
            {url}
          </span>
        ) : null}
      </div>
      <div className='relative min-h-0 flex-1 overflow-hidden'>{children}</div>
    </div>
  );
}

/** A generic phone with a status bar. Default size is 300 × 620 units. */
export function Phone({
  children,
  width = 300,
  height = 620,
  time = '9:41',
  statusTone = 'dark',
  screen = '#ffffff',
  className,
  style
}: {
  children: ReactNode;
  width?: number;
  height?: number;
  time?: string;
  /** Color of the status bar glyphs: `dark` on light screens. */
  statusTone?: 'dark' | 'light';
  screen?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const bezel = 9;
  const glyph = statusTone === 'dark' ? '#111' : '#fff';
  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{
        width: u(width),
        height: u(height),
        borderRadius: u(46),
        background: '#151413',
        padding: u(bezel),
        boxShadow: `inset 0 0 0 ${u(1.5)} #3a3835, 0 ${u(30)} ${u(60)} ${u(-26)} rgba(20,16,10,.55), 0 ${u(3)} ${u(8)} rgba(20,16,10,.18)`,
        ...style
      }}
    >
      <div
        className='relative flex h-full flex-col overflow-hidden'
        style={{ borderRadius: u(37), background: screen }}
      >
        <div
          className='relative z-20 flex shrink-0 items-center justify-between'
          style={{
            height: u(44),
            paddingInline: u(26),
            paddingTop: u(4),
            color: glyph,
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: u(13),
            fontWeight: 600
          }}
        >
          <span className='tabular'>{time}</span>
          <span
            aria-hidden
            className='absolute left-1/2 -translate-x-1/2'
            style={{
              top: u(10),
              width: u(84),
              height: u(24),
              borderRadius: u(14),
              background: '#000'
            }}
          />
          <span className='flex items-end' style={{ gap: u(5) }} aria-hidden>
            <span className='flex items-end' style={{ gap: u(1.5) }}>
              {[4, 6, 8, 10].map((h) => (
                <span
                  key={h}
                  style={{ width: u(3), height: u(h), borderRadius: u(1), background: glyph }}
                />
              ))}
            </span>
            <span
              className='relative'
              style={{
                width: u(22),
                height: u(11),
                borderRadius: u(3.5),
                border: `${u(1.2)} solid ${glyph}`,
                opacity: 0.9
              }}
            >
              <span
                className='absolute'
                style={{
                  inset: u(1.5),
                  right: u(5),
                  borderRadius: u(1.5),
                  background: glyph
                }}
              />
            </span>
          </span>
        </div>
        <div className='relative min-h-0 flex-1'>{children}</div>
        <span
          aria-hidden
          className='absolute left-1/2 z-20 -translate-x-1/2'
          style={{
            bottom: u(8),
            width: u(110),
            height: u(4.5),
            borderRadius: u(3),
            background: glyph,
            opacity: 0.85
          }}
        />
      </div>
    </div>
  );
}
