import { Link } from '@tanstack/react-router';
import { DemoStatus, PreviewPanel } from '~/components/work/preview-panel';
import type { Project } from '~/content/types';

/** One project on the work wall: the live preview on its color, then the label. */
export function WorkCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const caption = (
    <div className='mt-3 flex flex-col gap-1.5 px-1'>
      <h3 className='text-[0.9375rem] leading-[1.45] tracking-[-0.01em] text-ink'>
        <Link
          to='/work/$slug'
          params={{ slug: project.slug }}
          className='group rounded-sm font-medium text-ink'
        >
          <span className='bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-[var(--ease-settle)] group-hover:bg-[length:100%_1px]'>
            {project.title}
          </span>
        </Link>{' '}
        <span className='text-ink-muted'>— {project.summary}</span>
      </h3>
      <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[0.75rem] text-ink-muted'>
        <span>
          {project.year} · {project.client}
        </span>
        {project.preview.type === 'demo' ? <DemoStatus /> : null}
      </div>
    </div>
  );

  return (
    <article aria-labelledby={`work-${project.slug}`} data-priority={priority || undefined}>
      <span id={`work-${project.slug}`} className='sr-only'>
        {project.title}
      </span>
      <PreviewPanel
        project={project}
        variant='card'
        sizes='(min-width: 48rem) 50vw, 100vw'
        after={caption}
      />
    </article>
  );
}
