import { useId, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { LoopVideo } from '~/components/loop-video';
import { Picture } from '~/components/picture';
import { RichText } from '~/components/rich-text';
import { DemoStatus, PreviewPanel } from '~/components/work/preview-panel';
import type { Block, Figure, Metric, Project } from '~/content/types';
import { cn } from '~/lib/utils';

/** Renders one case study block. */
export function CaseBlock({ block, project }: { block: Block; project: Project }) {
  switch (block.type) {
    case 'demo':
      return (
        <figure className='page'>
          <PreviewPanel
            project={project}
            variant='feature'
            sizes='(min-width: 82rem) 76rem, 100vw'
            innerClassName='mx-auto max-w-[47.5rem] px-0 sm:px-6 sm:py-6'
            after={
              <figcaption className='mt-3 flex flex-col gap-1.5 text-[0.875rem] text-ink-muted sm:flex-row sm:justify-between sm:gap-6'>
                {block.caption ? (
                  <span className='max-w-[44rem]'>
                    <RichText text={block.caption} />
                  </span>
                ) : (
                  <span />
                )}
                {project.preview.type === 'demo' ? <DemoStatus className='shrink-0 font-mono text-[0.75rem]' /> : null}
              </figcaption>
            }
          />
        </figure>
      );
    case 'image':
      return (
        <figure
          className={cn(
            'page',
            block.size === 'full' ? '' : block.size === 'wide' ? 'max-w-[72rem]' : 'max-w-[52rem]'
          )}
        >
          <Frame>
            <Picture
              image={block.image}
              alt={block.alt}
              sizes={block.size === 'full' ? '(min-width: 82rem) 76rem, 100vw' : '(min-width: 72rem) 66rem, 100vw'}
            />
          </Frame>
          <Caption text={block.caption} />
        </figure>
      );
    case 'imagePair':
      return (
        <figure className='page'>
          <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
            {block.images.map((figure) => (
              <Frame key={figure.image.sources[0]?.src + figure.alt}>
                <Picture image={figure.image} alt={figure.alt} sizes='(min-width: 48rem) 50vw, 100vw' />
              </Frame>
            ))}
          </div>
          <Caption text={block.caption} />
        </figure>
      );
    case 'video':
      return (
        <figure className='page max-w-[72rem]'>
          <Frame>
            <LoopVideo src={block.src} poster={block.poster} alt={block.alt} />
          </Frame>
          <Caption text={block.caption} />
        </figure>
      );
    case 'text':
      return (
        <section className='page'>
          <div className='grid gap-4 md:grid-cols-12 md:gap-10'>
            {block.heading ? (
              <h3 className='text-[1.0625rem] font-medium tracking-[-0.015em] text-ink md:col-span-4 md:col-start-2'>
                <RichText text={block.heading} />
              </h3>
            ) : null}
            <div
              className={cn(
                'space-y-4 text-[1rem] leading-[1.65] text-ink-soft md:col-span-6',
                block.heading ? 'md:col-start-6' : 'md:col-start-4'
              )}
            >
              {block.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
          </div>
        </section>
      );
    case 'quote':
      return (
        <figure className='page'>
          <blockquote className='mx-auto max-w-[44rem] text-center'>
            <p className='text-[clamp(1.25rem,2.3vw,1.75rem)] leading-[1.35] font-medium tracking-[-0.03em] text-ink'>
              “<RichText text={block.text} />”
            </p>
          </blockquote>
          <figcaption className='mt-5 text-center text-[0.875rem] text-ink-muted'>
            <span className='font-medium text-ink'>{block.name}</span> · {block.role}
          </figcaption>
        </figure>
      );
    case 'beforeAfter':
      return (
        <figure className='page max-w-[72rem]'>
          <BeforeAfter before={block.before} after={block.after} />
          <Caption text={block.caption} />
        </figure>
      );
    case 'metrics':
      return (
        <section className='page'>
          <Metrics items={block.items} />
          <Caption text={block.caption} />
        </section>
      );
  }
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className='overflow-hidden rounded-[1rem] shadow-[var(--edge)] sm:rounded-[1.25rem]'>
      {children}
    </div>
  );
}

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <figcaption className='mt-3 max-w-[44rem] text-[0.875rem] leading-[1.55] text-ink-muted'>
      <RichText text={text} />
    </figcaption>
  );
}

/** Big numbers with what they measure. */
export function Metrics({ items }: { items: Metric[] }) {
  return (
    <dl className='grid gap-x-10 gap-y-9 border-t border-rule pt-7 sm:grid-cols-2 lg:grid-cols-4'>
      {items.map((metric) => (
        <div key={metric.label}>
          <dt className='sr-only'>{metric.label}</dt>
          <dd>
            <span className='tabular block text-[clamp(2rem,3.4vw,2.75rem)] leading-none font-medium tracking-[-0.045em] text-ink'>
              {metric.value}
            </span>
            <span className='mt-3 block leading-[1.45] text-ink'>{metric.label}</span>
            {metric.detail ? (
              <span className='mt-1.5 block text-[0.8125rem] leading-[1.5] text-ink-muted'>{metric.detail}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Two images of the same size, one over the other, with a divider you can drag,
 * click anywhere to move, or move with the arrow keys (it's a range input).
 */
function BeforeAfter({ before, after }: { before: Figure; after: Figure }) {
  const [position, setPosition] = useState(50);
  const id = useId();
  return (
    <div>
      <div
        className='before-after relative overflow-hidden rounded-[1rem] shadow-[var(--edge)] select-none sm:rounded-[1.25rem]'
        style={{ '--split': `${position}%` } as CSSProperties}
      >
        <Picture image={after.image} alt={after.alt} sizes='(min-width: 72rem) 72rem, 100vw' />
        <div className='absolute inset-0' style={{ clipPath: 'inset(0 calc(100% - var(--split)) 0 0)' }}>
          <Picture image={before.image} alt={before.alt} sizes='(min-width: 72rem) 72rem, 100vw' />
        </div>
        <span
          aria-hidden
          className='pointer-events-none absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.2)]'
          style={{ left: 'var(--split)' }}
        >
          <span className='before-after-handle absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[0.8125rem] text-ink shadow-[0_0_0_1px_rgba(17,17,17,0.08),0_4px_14px_rgba(17,17,17,0.2)]'>
            ↔
          </span>
        </span>
        <span className='pointer-events-none absolute top-3 left-3 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[0.6875rem] font-medium text-paper backdrop-blur'>
          {before.label ?? 'Before'}
        </span>
        <span className='pointer-events-none absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[0.6875rem] font-medium text-ink backdrop-blur'>
          {after.label ?? 'After'}
        </span>
        <label htmlFor={id} className='sr-only'>
          Compare {before.label ?? 'before'} and {after.label ?? 'after'}: how much of the {before.label ?? 'before'} image to show
        </label>
        <input
          id={id}
          type='range'
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className='before-after-range absolute inset-0 h-full w-full cursor-ew-resize opacity-0'
        />
      </div>
    </div>
  );
}
