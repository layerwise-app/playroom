import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '~/lib/utils';

/** A length in stage units: `u(12)` is 12 units at the stage's design size. */
export const u = (n: number) => `calc(var(--u) * ${n})`;

/** A CSS translate in stage units. */
export const at = (x: number, y: number) =>
  `translate(calc(var(--u) * ${x}), calc(var(--u) * ${y}))`;

type StageProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Design width in stage units. */
  width: number;
  /** Design height in stage units. */
  height: number;
  /** Classes for the outer box, which sets the aspect ratio. */
  frameClassName?: string;
  innerRef?: Ref<HTMLDivElement>;
  children: ReactNode;
};

/**
 * A fixed design canvas that scales with its container, server-rendered at the
 * right size with no JavaScript. Inside it, Tailwind spacing, text, and radius
 * utilities are measured in stage units. See `.stage` in `app.css`.
 */
export function Stage({
  width,
  height,
  className,
  frameClassName,
  style,
  innerRef,
  children,
  ...rest
}: StageProps) {
  return (
    <div
      className={cn('stage', frameClassName)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        ref={innerRef}
        className={cn('stage-inner', className)}
        style={{ '--stage-w': width, ...style } as CSSProperties}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}
