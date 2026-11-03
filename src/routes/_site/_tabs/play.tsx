import { createFileRoute } from '@tanstack/react-router';
import {
  BalancedHeadline,
  ContrastFinder,
  EasingFeel,
  HoldToConfirm,
  NestedRadii,
  OpticalCenter,
  SmartGuides
} from '~/components/play/experiments';
import { site } from '~/lib/site';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/_site/_tabs/play')({
  head: () =>
    seo({
      title: `Play — ${site.name}`,
      description:
        'Small interaction experiments you can use in place: nested corners, hold to confirm, smart guides, contrast, optical centering, easing, and balanced headlines.',
      path: '/play'
    }),
  component: PlayPage
});

function PlayPage() {
  return (
    <section aria-labelledby='play-heading' className='page pt-14 sm:pt-20'>
      <div className='mb-8 grid gap-3 md:grid-cols-12 md:gap-10'>
        <h2 id='play-heading' className='font-mono text-[0.75rem] text-ink-muted md:col-span-3 md:pt-1'>
          Experiments
        </h2>
        <p className='max-w-[34rem] text-[1rem] leading-[1.55] text-ink-soft md:col-span-7'>
          Small things I build to check a hunch. Each one is the real thing, so go ahead and use it.
        </p>
      </div>
      <div className='columns-1 gap-3 md:columns-2 lg:columns-3'>
        <NestedRadii />
        <SmartGuides />
        <HoldToConfirm />
        <ContrastFinder />
        <EasingFeel />
        <OpticalCenter />
        <BalancedHeadline />
      </div>
    </section>
  );
}
