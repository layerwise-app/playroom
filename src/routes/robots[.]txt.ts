import { createFileRoute } from '@tanstack/react-router';
import { siteUrl } from '~/lib/site';

// Every page on this site is public.
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(
          ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl('/sitemap.xml')}`, ''].join('\n'),
          { headers: { 'content-type': 'text/plain; charset=utf-8' } }
        )
    }
  }
});
