import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestUrl } from '@tanstack/react-start/server';
import { essays } from '~/content/writing';
import { projects } from '~/content/work';
import { portfolio } from '~/portfolio.config';

type Site = {
  name: string;
  description: string;
  /**
   * The address search engines should index, like `https://minaokafor.com`.
   * Empty uses the address each visitor opened. Set it when a custom domain is
   * connected, so the layerwise.site address isn't indexed as a copy.
   */
  url: string;
  /**
   * Share image for link previews on Instagram, iMessage, WhatsApp, and
   * search: a 1200×630 PNG or JPG in `public/`. Case studies use their cover.
   */
  image: string;
  imageAlt: string;
  /** The `content` of Google Search Console's HTML tag, if it's used. */
  googleSiteVerification: string;
};

/** What search engines and link previews read about this site. */
export const site: Site = {
  name: `${portfolio.name} — ${portfolio.role}`,
  description:
    'Mina Okafor is a product designer in Brooklyn who codes: calm software for giving, learning, and getting older, with live prototypes.',
  url: '',
  image: '/og-image.jpg',
  imageAlt: `“${portfolio.greeting}” in a dashed selection frame over faint construction lines: the home page of ${portfolio.name}, ${portfolio.role.toLowerCase()} in ${portfolio.location}.`,
  googleSiteVerification: ''
};

/** Public pages in `/sitemap.xml`. Case studies and essays are added from their folders. */
export const sitemapPaths: string[] = [
  '/',
  '/play',
  '/about',
  '/writing',
  '/contact',
  ...projects.map((project) => `/work/${project.slug}`),
  ...essays.map((essay) => `/writing/${essay.slug}`)
];

const requestOrigin = createIsomorphicFn()
  .server(() => getRequestUrl().origin)
  .client(() => window.location.origin);

/** Absolute URL for a path or a `public/` file on this site. */
export function siteUrl(path = '/'): string {
  return new URL(path, site.url || requestOrigin()).toString();
}

/** schema.org Person for the site's owner. */
export function personJsonLd() {
  const [locality, region] = portfolio.location.split(',').map((part) => part.trim());
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': siteUrl('/#person'),
    name: portfolio.name,
    jobTitle: portfolio.role,
    url: siteUrl('/'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: locality,
      ...(region ? { addressRegion: region } : {})
    },
    ...(portfolio.ownerEmail ? { email: `mailto:${portfolio.ownerEmail}` } : {}),
    sameAs: portfolio.socials.map((social) => social.href)
  };
}
