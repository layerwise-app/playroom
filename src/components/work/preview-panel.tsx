import type { ReactNode } from 'react';
import { DemoShell, useDemoRuntime } from '~/components/demo/runtime';
import { LoopVideo } from '~/components/loop-video';
import { Picture } from '~/components/picture';
import type { Project } from '~/content/types';
import { cn } from '~/lib/utils';

/**
 * A project's preview on its color: the live demo, a still, or a looping
 * video. Used by the work wall and the case study's demo block.
 */
export function PreviewPanel({
  project,
  variant,
  sizes,
  after,
  className,
  innerClassName
}: {
  project: Project;
  variant: 'card' | 'feature';
  sizes: string;
  /** Rendered below the panel inside the demo's context (for status text). */
  after?: ReactNode;
  className?: string;
  /** Classes for a wrapper around the content, e.g. to cap a demo's width. */
  innerClassName?: string;
}) {
  const { preview, theme } = project;
  const Texture = theme.Texture;
  const panel = (content: ReactNode) => (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-[1.125rem] sm:rounded-[1.375rem]',
        className
      )}
      style={{ background: theme.color }}
    >
      {Texture ? <Texture className='absolute inset-0 -z-10 h-full w-full' /> : null}
      {innerClassName ? <div className={innerClassName}>{content}</div> : content}
    </div>
  );

  if (preview.type === 'demo') {
    const { Demo } = preview;
    return (
      <DemoShell label={preview.label} after={after}>
        {panel(<Demo variant={variant} />)}
      </DemoShell>
    );
  }
  if (preview.type === 'image') {
    return (
      <>
        {panel(<Picture image={preview.image} alt={preview.alt} sizes={sizes} />)}
        {after}
      </>
    );
  }
  return (
    <>
      {panel(<LoopVideo src={preview.src} poster={preview.poster} alt={preview.alt} sizes={sizes} />)}
      {after}
    </>
  );
}

/** "Live demo · hover to try" under a card, or "Your turn" while someone uses it. */
export function DemoStatus({ className }: { className?: string }) {
  const runtime = useDemoRuntime();
  // The idle label follows a media query, so the server-rendered page says
  // "tap" on phones before any script runs.
  const label = runtime.engaged ? (
    'Your turn'
  ) : runtime.still ? (
    'Interactive demo'
  ) : (
    <>
      Live demo ·{' '}
      <span className='[@media(hover:hover)_and_(pointer:fine)]:hidden'>tap to try</span>
      <span className='hidden [@media(hover:hover)_and_(pointer:fine)]:inline'>hover to try</span>
    </>
  );
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden
        className={cn(
          'relative inline-block size-1.5 rounded-full',
          runtime.engaged ? 'bg-accent' : 'bg-ink-muted'
        )}
      >
        {runtime.autoplay ? (
          <span className='absolute inset-0 animate-ping rounded-full bg-ink-muted opacity-60 [animation-duration:2s]' />
        ) : null}
      </span>
      <span aria-live='polite'>{label}</span>
    </span>
  );
}
