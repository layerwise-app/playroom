import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Picture } from '~/components/picture';
import { RichText, plainText } from '~/components/rich-text';
import { TabBar } from '~/components/site/tab-bar';
import { CaseBlock, Metrics } from '~/components/work/blocks';
import { getNextProject, getProject } from '~/content/work';
import { fontPreloads } from '~/lib/fonts';
import { personJsonLd, site, siteUrl } from '~/lib/site';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/_site/work/$slug')({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { slug: project.slug };
  },
  head: ({ loaderData, params }) => {
    const project = loaderData ? getProject(loaderData.slug) : undefined;
    if (!project) return { meta: [{ title: `Not found — ${site.name}` }] };
    const title = `${project.title} — ${portfolio.name}`;
    const description = `${capitalize(plainText(project.summary))}. ${project.role}, ${project.year}.`;
    const head = seo({
      title,
      description,
      path: `/work/${params.slug}`,
      image: project.cover.image.og ?? project.cover.image.sources.at(-1)?.src,
      imageAlt: project.cover.alt,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        headline: `${project.title}: ${plainText(project.summary)}`,
        description: plainText(project.problem.brief),
        url: siteUrl(`/work/${project.slug}`),
        image: siteUrl(project.cover.image.og ?? project.cover.image.sources.at(-1)?.src ?? site.image),
        dateCreated: project.year.slice(0, 4),
        creator: personJsonLd(),
        sourceOrganization: { '@type': 'Organization', name: project.client }
      }
    });
    const fontFiles = (project.fonts ?? []).flatMap((font) => font.files);
    return { ...head, links: [...head.links, ...fontPreloads(fontFiles)] };
  },
  component: CaseStudy
});

function CaseStudy() {
  const { slug } = Route.useLoaderData();
  const project = getProject(slug)!;
  const next = getNextProject(slug);

  return (
    <>
      <TabBar mode='nav' />
      <main id='main'>
        <header className='page pt-12 sm:pt-16'>
          <div className='max-w-[60rem]'>
          <Link to='/' className='link text-[0.875rem] text-ink-muted'>
            ← All work
          </Link>
          <h1 className='mt-6 text-[clamp(2.125rem,4.4vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.04em] text-ink'>
            {project.title}
          </h1>
          <p className='mt-3 max-w-[40rem] text-[clamp(1.125rem,1.8vw,1.375rem)] leading-[1.4] tracking-[-0.02em] text-ink-muted'>
            {capitalize(project.summary)}.
          </p>
          </div>
          <dl className='mt-10 grid grid-cols-[1fr_auto] gap-x-8 gap-y-6 border-t border-rule pt-5 text-[0.875rem] sm:grid-cols-2 lg:grid-cols-[1fr_0.6fr_1.4fr_1.4fr]'>
            <Meta label='Client'>{project.client}</Meta>
            <Meta label='Year'>
              <span className='tabular'>{project.year}</span>
            </Meta>
            <Meta label='Role' className='col-span-2 sm:col-span-1'>
              {project.role}
            </Meta>
            <Meta label='Team' className='col-span-2 sm:col-span-1'>
              <ul>
                {project.team.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </Meta>
          </dl>
        </header>

        <div className='page mt-10 sm:mt-14'>
          <div
            className='overflow-hidden rounded-[1.125rem] sm:rounded-[1.375rem]'
            style={{ background: project.theme.color }}
          >
            <Picture
              image={project.cover.image}
              alt={project.cover.alt}
              sizes='(min-width: 82rem) 76rem, 100vw'
              priority
            />
          </div>
        </div>

        <CaseSection title='The brief'>
          <p className='text-[1.1875rem] leading-[1.55] tracking-[-0.015em] text-ink'>
            <RichText text={project.problem.brief} />
          </p>
        </CaseSection>
        <CaseSection title='The constraint' tight>
          <p className='text-[1rem] leading-[1.65] text-ink-soft'>
            <RichText text={project.problem.constraint} />
          </p>
        </CaseSection>

        <CaseSection title='Decisions'>
          <ol className='border-t border-rule'>
            {project.decisions.map((decision, index) => (
              <li
                key={decision.title}
                className='grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-rule py-5 sm:grid-cols-[3rem_1fr]'
              >
                <span className='flex items-center gap-2 self-start pt-[0.3rem] font-mono text-[0.75rem] text-ink-muted'>
                  <span aria-hidden className='size-2 rounded-full' style={{ background: project.theme.color }} />
                  {index + 1}
                </span>
                <div>
                  <h3 className='text-[1.0625rem] font-medium tracking-[-0.015em] text-ink'>
                    <RichText text={decision.title} />
                  </h3>
                  <p className='mt-1.5 leading-[1.6] text-ink-soft'>
                    <RichText text={decision.body} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </CaseSection>

        <div className='mt-20 flex flex-col gap-20 sm:mt-28 sm:gap-28'>
          {project.blocks.map((block, index) => (
            <CaseBlock key={index} block={block} project={project} />
          ))}
        </div>

        <CaseSection title='Outcome'>
          <p className='text-[1.1875rem] leading-[1.55] tracking-[-0.015em] text-ink'>
            <RichText text={project.outcome.summary} />
          </p>
        </CaseSection>
        {project.outcome.metrics?.length ? (
          <div className='page mt-10'>
            <Metrics items={project.outcome.metrics} />
          </div>
        ) : null}

        {next ? (
          <nav aria-label='Next project' className='page mt-24 sm:mt-32'>
            <Link to='/work/$slug' params={{ slug: next.slug }} className='group block'>
              <span className='font-mono text-[0.75rem] text-ink-muted'>Next project</span>
              <span className='mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1'>
                <span className='text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-medium tracking-[-0.035em] text-ink'>
                  {next.title}
                </span>
                <span className='text-[clamp(1rem,1.6vw,1.1875rem)] tracking-[-0.015em] text-ink-muted'>
                  {next.summary}
                </span>
              </span>
              <span
                className='mt-5 block overflow-hidden rounded-[1.125rem] transition-transform duration-500 ease-[var(--ease-settle)] group-hover:-translate-y-1 sm:rounded-[1.375rem]'
                style={{ background: next.theme.color }}
              >
                <Picture image={next.cover.image} alt='' sizes='(min-width: 82rem) 76rem, 100vw' />
              </span>
            </Link>
          </nav>
        ) : null}
      </main>
    </>
  );
}

function Meta({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <dt className='font-mono text-[0.75rem] text-ink-muted'>{label}</dt>
      <dd className='mt-1.5 text-ink'>{children}</dd>
    </div>
  );
}

function CaseSection({ title, tight, children }: { title: string; tight?: boolean; children: ReactNode }) {
  return (
    <section className={tight ? 'page mt-10 sm:mt-12' : 'page mt-20 sm:mt-28'}>
      <div className='grid gap-4 md:grid-cols-12 md:gap-10'>
        <h2 className='font-mono text-[0.75rem] text-ink-muted md:col-span-3 md:col-start-1 md:pt-1.5'>{title}</h2>
        <div className='md:col-span-8 md:col-start-4 lg:col-span-7 lg:col-start-4'>{children}</div>
      </div>
    </section>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
