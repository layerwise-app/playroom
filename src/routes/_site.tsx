import { Outlet, createFileRoute } from '@tanstack/react-router';
import { SiteFooter } from '~/components/site/footer';
import { SiteHeader } from '~/components/site/header';

export const Route = createFileRoute('/_site')({
  component: SiteLayout
});

function SiteLayout() {
  return (
    <>
      <a
        href='#main'
        className='sr-only-focusable fixed top-3 left-3 z-50 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper'
      >
        Skip to content
      </a>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </>
  );
}
