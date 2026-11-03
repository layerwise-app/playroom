import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { SiteFooter } from '~/components/site/footer';
import { SiteHeader } from '~/components/site/header';

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id='main' className='page flex flex-col items-center pt-24 pb-8 text-center sm:pt-32'>
        <div className='relative inline-block px-[0.55em] py-[0.3em] text-[clamp(1.3125rem,2.1vw,1.625rem)] leading-none font-medium tracking-[-0.025em] text-ink'>
          <span aria-hidden className='absolute inset-0 border border-dashed border-accent' />
          {(['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0'] as const).map(
            (corner) => (
              <span
                key={corner}
                aria-hidden
                className={`absolute ${corner} -m-[3px] size-[7px] border border-accent bg-paper`}
              />
            )
          )}
          <p className='absolute bottom-[calc(100%+0.5rem)] left-0 font-mono text-[0.6875rem] leading-none font-medium tracking-normal text-accent'>
            404
          </p>
          <h1>This frame is empty.</h1>
        </div>
        <div className='mt-10 max-w-[28rem] text-ink-muted'>
          {children ?? <p>The page you’re looking for has moved or never existed.</p>}
        </div>
        <Link
          to='/'
          className='mt-7 rounded-full bg-ink px-4 py-2 text-[0.875rem] font-medium text-paper'
        >
          Back to the work
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
