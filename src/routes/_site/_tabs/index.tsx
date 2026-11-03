import { Link, createFileRoute } from '@tanstack/react-router';
import { WorkCard } from '~/components/work/work-card';
import { projects } from '~/content/work';
import { personJsonLd, site, siteUrl } from '~/lib/site';
import { fontPreloads } from '~/lib/fonts';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/_site/_tabs/')({
  head: () => {
    const head = seo({
      title: site.name,
      description: site.description,
      path: '/',
      jsonLd: [
        personJsonLd(),
        { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: siteUrl('/') }
      ]
    });
    // Every card on the wall runs its product's own typeface.
    const links = [...head.links, ...fontPreloads(projects.flatMap((p) => p.fonts ?? []).flatMap((f) => f.files))];
    return { ...head, links };
  },
  component: WorkWall
});

function WorkWall() {
  const items = [
    ...projects.map((project, index) => ({ key: project.slug, node: <WorkCard project={project} priority={index === 0} /> })),
    { key: 'contact', node: <ContactCard /> }
  ];
  return (
    <section aria-labelledby='work-heading' className='page pt-6 sm:pt-8'>
      <h2 id='work-heading' className='sr-only'>
        Selected work
      </h2>
      <ul className='grid gap-x-3 gap-y-10 sm:gap-y-12 md:grid-cols-2'>
        {items.map((item) => (
          <li key={item.key} className='flex flex-col'>
            {item.node}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContactCard() {
  return (
    <aside className='flex min-h-[22rem] flex-1 flex-col justify-between gap-10 rounded-[1.125rem] bg-surface p-6 sm:rounded-[1.375rem] sm:p-9'>
      <p className='font-mono text-[0.75rem] text-ink-muted'>Next on the wall</p>
      <div>
        <p className='max-w-[24rem] text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.25] font-medium tracking-[-0.03em] text-ink'>
          Your project, if it’s the kind that has to be <span className='serif'>calm</span>.
        </p>
        <p className='mt-3 max-w-[26rem] text-ink-muted'>
          {portfolio.availability ? `${portfolio.availability}. ` : ''}I take one or two
          projects at a time, usually for small teams replacing something people rely on.
        </p>
        <Link
          to='/contact'
          className='group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[0.875rem] font-medium text-paper'
        >
          Start a conversation
          <span aria-hidden className='transition-transform duration-300 group-hover:translate-x-0.5'>
            →
          </span>
        </Link>
      </div>
    </aside>
  );
}
