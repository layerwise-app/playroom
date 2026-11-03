/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import type * as React from 'react';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';
import { NotFound } from '~/components/NotFound';
import { projects } from '~/content/work';
import { fontFaceCss, fontPreloads, fontStack } from '~/lib/fonts';
import { site } from '~/lib/site';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';
import '~/styles/app.css';

const { colors, fonts } = portfolio;

// Colors and fonts from `portfolio.config.ts`, plus every project's own
// typefaces. Font files only download when a page uses them.
const rootCss = [
  fontFaceCss([fonts.sans, fonts.serif, fonts.mono, ...projects.flatMap((p) => p.fonts ?? [])]),
  `:root{--paper:${colors.paper};--surface:${colors.surface};--ink:${colors.ink};--ink-soft:${colors.inkSoft};--ink-muted:${colors.inkMuted};--rule:${colors.rule};--accent:${colors.accent};--accent-ink:${colors.accentInk};--font-sans-family:${fontStack(fonts.sans)};--font-serif-family:${fontStack(fonts.serif)};--font-mono-family:${fontStack(fonts.mono)};}`
].join('\n');

const sitePreloads = fontPreloads(
  [...fonts.sans.files, ...fonts.serif.files, ...fonts.mono.files].filter((file) => file.preload)
);

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  // Site-wide defaults; each page's `seo()` overrides tags with the same name.
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: colors.paper },
      ...(site.googleSiteVerification
        ? [
            {
              name: 'google-site-verification',
              content: site.googleSiteVerification
            }
          ]
        : []),
      ...seo({ title: site.name, description: site.description }).meta
    ],
    links: [
      ...sitePreloads,
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' }
    ],
    styles: [{ children: rootCss }]
  }),
  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
  notFoundComponent: () => <NotFound />,
  component: RootComponent
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
