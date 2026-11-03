import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { RichText, plainText } from '~/components/rich-text';
import { TabBar } from '~/components/site/tab-bar';
import { essays, getEssay, readingMinutes } from '~/content/writing';
import { formatDate } from '~/lib/dates';
import { personJsonLd, site, siteUrl } from '~/lib/site';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/_site/writing/$slug')({
  loader: ({ params }) => {
    const essay = getEssay(params.slug);
    if (!essay) throw notFound();
    return { slug: essay.slug };
  },
  head: ({ loaderData, params }) => {
    const essay = loaderData ? getEssay(loaderData.slug) : undefined;
    if (!essay) return { meta: [{ title: `Not found — ${site.name}` }] };
    return seo({
      title: `${plainText(essay.title)} — ${portfolio.name}`,
      description: essay.dek,
      path: `/writing/${params.slug}`,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: plainText(essay.title),
        description: essay.dek,
        datePublished: essay.date,
        url: siteUrl(`/writing/${essay.slug}`),
        image: siteUrl(site.image),
        author: personJsonLd()
      }
    });
  },
  component: EssayPage
});

function EssayPage() {
  const { slug } = Route.useLoaderData();
  const essay = getEssay(slug)!;
  const index = essays.findIndex((item) => item.slug === slug);
  const next = essays.length > 1 ? essays[(index + 1) % essays.length] : undefined;

  return (
    <>
      <TabBar mode='nav' />
      <main id='main' className='page pt-14 sm:pt-20'>
        <article className='mx-auto max-w-[40rem]'>
          <header>
            <p className='font-mono text-[0.75rem] text-ink-muted'>
              <time dateTime={essay.date}>{formatDate(essay.date)}</time> · {readingMinutes(essay)} min
              read
            </p>
            <h1 className='mt-4 text-[clamp(1.875rem,3.6vw,2.625rem)] leading-[1.12] font-medium tracking-[-0.035em] text-ink'>
              {essay.title}
            </h1>
            <p className='mt-4 text-[1.125rem] leading-[1.5] tracking-[-0.01em] text-ink-muted'>{essay.dek}</p>
          </header>
          <div className='mt-10 border-t border-rule pt-9 text-[1.0625rem] leading-[1.7] text-ink-soft'>
            {essay.body.map((block, i) =>
              block.type === 'h2' ? (
                <h2 key={i} className='mt-11 mb-3 text-[1.125rem] font-medium tracking-[-0.015em] text-ink'>
                  <RichText text={block.text} />
                </h2>
              ) : block.type === 'quote' ? (
                <blockquote
                  key={i}
                  className='my-9 border-l-2 border-accent pl-5 text-[clamp(1.25rem,2vw,1.4375rem)] leading-[1.4] font-medium tracking-[-0.02em] text-ink'
                >
                  <RichText text={block.text} />
                </blockquote>
              ) : (
                <p key={i} className='mt-5 first:mt-0'>
                  <RichText text={block.text} />
                </p>
              )
            )}
          </div>
          <footer className='mt-14 flex items-center gap-3 border-t border-rule pt-5 text-[0.875rem] text-ink-muted'>
            <span>Written by {portfolio.name}</span>
            <span aria-hidden>·</span>
            <Link to='/writing' className='link'>
              All essays
            </Link>
          </footer>
        </article>
        {next && next.slug !== essay.slug ? (
          <Link
            to='/writing/$slug'
            params={{ slug: next.slug }}
            className='group mx-auto mt-14 block max-w-[40rem] rounded-[1.125rem] bg-surface p-6 sm:p-7'
          >
            <span className='font-mono text-[0.75rem] text-ink-muted'>Next essay</span>
            <span className='mt-2 block text-[1.25rem] leading-[1.3] font-medium tracking-[-0.025em] text-ink'>
              {next.title}
              <span aria-hidden className='ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1'>
                →
              </span>
            </span>
          </Link>
        ) : null}
      </main>
    </>
  );
}
