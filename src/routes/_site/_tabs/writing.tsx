import { Link, createFileRoute } from '@tanstack/react-router';
import { essays, readingMinutes } from '~/content/writing';
import { formatDate } from '~/lib/dates';
import { site } from '~/lib/site';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/_site/_tabs/writing')({
  head: () =>
    seo({
      title: `Writing — ${site.name}`,
      description:
        'Short essays on designing calm software: agents you can interrupt, products for the second week, and prototypes as arguments.',
      path: '/writing'
    }),
  component: WritingPage
});

function WritingPage() {
  return (
    <section aria-labelledby='writing-heading' className='page pt-14 sm:pt-20'>
      <div className='grid gap-6 md:grid-cols-12 md:gap-10'>
        <h2 id='writing-heading' className='font-mono text-[0.75rem] text-ink-muted md:col-span-3 md:pt-6'>
          Essays
        </h2>
        <ol className='border-t border-rule md:col-span-9'>
          {essays.map((essay) => (
            <li key={essay.slug} className='border-b border-rule'>
              <Link
                to='/writing/$slug'
                params={{ slug: essay.slug }}
                className='group grid gap-2 py-6 sm:grid-cols-[1fr_9rem] sm:gap-10 sm:py-7'
              >
                <div>
                  <h3 className='text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-[1.3] font-medium tracking-[-0.02em] text-ink'>
                    <span className='bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]'>
                      {essay.title}
                    </span>
                  </h3>
                  <p className='mt-1.5 max-w-[36rem] text-ink-muted'>{essay.dek}</p>
                </div>
                <p className='font-mono text-[0.75rem] text-ink-muted sm:pt-1.5 sm:text-right'>
                  <time dateTime={essay.date}>{formatDate(essay.date)}</time>
                  <span className='sm:block'>
                    <span className='sm:hidden'> · </span>
                    {readingMinutes(essay)} min read
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
