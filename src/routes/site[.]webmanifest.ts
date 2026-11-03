import { createFileRoute } from '@tanstack/react-router';
import { portfolio } from '~/portfolio.config';

// The web app manifest, built from the portfolio config. The icons come from
// `pnpm icons`, which renders them from public/logo.svg.
export const Route = createFileRoute('/site.webmanifest')({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          {
            name: portfolio.name,
            short_name: portfolio.name,
            description: `${portfolio.role} in ${portfolio.location}`,
            start_url: '/',
            icons: [
              { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
              { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
            ],
            theme_color: portfolio.colors.paper,
            background_color: portfolio.colors.paper,
            display: 'standalone'
          },
          { headers: { 'content-type': 'application/manifest+json; charset=utf-8' } }
        )
    }
  }
});
