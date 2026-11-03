import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import { Intro } from '~/components/site/intro';
import { TabBar } from '~/components/site/tab-bar';

// Home, Play, About, and Writing share the intro and the tab bar, so the pill
// slides between tabs while the rest of the page stays put.
export const Route = createFileRoute('/_site/_tabs')({
  component: TabsLayout
});

function TabsLayout() {
  const pathname = useLocation({ select: (location) => location.pathname });
  // Animate tab content only after the first tab change, never on page load.
  const [initialPath] = useState(pathname);
  const [changed, setChanged] = useState(false);
  if (!changed && pathname !== initialPath) setChanged(true);
  return (
    <>
      <Intro />
      <TabBar mode='tabs' />
      <main id='main' key={pathname} className={changed ? 'tab-in' : undefined}>
        <Outlet />
      </main>
    </>
  );
}
