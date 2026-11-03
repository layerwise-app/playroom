// Everything about the site's owner lives here: who they are, how to reach
// them, and the two typefaces and handful of colors the whole site is built
// from. Case studies live in `src/content/work/`, essays in
// `src/content/writing/`, and the About page details in `src/content/about.ts`.

export type FontFile = {
  /** A `public/` path to a .woff2 file. */
  src: string;
  /** A single weight like `400`, or a range like `200 900` for variable fonts. */
  weight: string;
  style: 'normal' | 'italic';
  /** Preload on every page. Do this only for the files the first screen uses. */
  preload?: boolean;
};

export type FontFamily = {
  family: string;
  files: FontFile[];
  /** Shown while the font loads, and if it can't. */
  fallback: string;
};

export type SocialLink = { label: string; href: string };

export type Portfolio = {
  name: string;
  role: string;
  location: string;
  /** The short greeting in the selection frame at the top of the home page. */
  greeting: string;
  /** The first line under the greeting: what you do. Wrap a word or two in
   * `*asterisks*` to set them in the serif italic. */
  intro: string;
  /** The second line: the teams you've worked with. */
  previously: string;
  /** Paragraphs for the About page. `*asterisks*` work here too. */
  bio: string[];
  /** A short line shown in the header, like `Booking from January`. Empty hides it. */
  availability: string;
  /** Where contact form messages are emailed. Empty saves them to the
   * database only (see the Database tab in Layerwise). */
  ownerEmail: string;
  socials: SocialLink[];
  /** A `public/` path to a PDF. Empty hides the download on the About page. */
  cv: string;
  /** `sans` for everything, `serif` for a few accent words, `mono` for small details. */
  fonts: { sans: FontFamily; serif: FontFamily; mono: FontFamily };
  /** Body text on `paper` must keep a 4.5:1 contrast ratio. */
  colors: {
    /** The page. */
    paper: string;
    /** Raised panels: the footer, form, and play wall. */
    surface: string;
    ink: string;
    inkSoft: string;
    inkMuted: string;
    rule: string;
    /** Selection frames, focus rings, and links. */
    accent: string;
    accentInk: string;
  };
};

export const portfolio: Portfolio = {
  name: 'Mina Okafor',
  role: 'Product designer',
  location: 'Brooklyn, NY',
  greeting: 'Hi, I’m Mina',
  intro: 'A product designer who codes, making *calm software* for giving, learning, and getting older.',
  previously: 'Before going independent I led design at Fieldnote Health and built scheduling tools at Marquee.',
  bio: [
    'I’m Mina. For nine years I’ve designed software for people who would rather be doing something else: volunteers fundraising after work, school coordinators building a term in a spreadsheet, a grandmother checking whether she already took her evening pills.',
    'I work best on the *first version* of something, or on the version that has to replace a spreadsheet everyone secretly depends on. I research with the people who will use it, design in the browser as early as I can, and hand engineers prototypes that already behave the way the product should.',
    'Before going independent I led design at Fieldnote Health and worked on scheduling tools at Marquee. I studied communication design at Ashby State, where I helped start Studio Hours, a campus design community that is still running without me.'
  ],
  availability: 'Booking projects from January',
  ownerEmail: '',
  // Replace these with your own profile addresses.
  socials: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Are.na', href: 'https://www.are.na/' },
    { label: 'Bluesky', href: 'https://bsky.app/' }
  ],
  cv: '/mina-okafor-cv.pdf',
  fonts: {
    sans: {
      family: 'Geist',
      fallback: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
      files: [{ src: '/fonts/geist/geist-wght.woff2', weight: '100 900', style: 'normal', preload: true }]
    },
    serif: {
      family: 'Instrument Serif',
      fallback: 'ui-serif, Georgia, "Times New Roman", serif',
      files: [
        { src: '/fonts/instrument-serif/instrument-serif-italic.woff2', weight: '400', style: 'italic', preload: true }
      ]
    },
    mono: {
      family: 'Geist Mono',
      fallback: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
      files: [{ src: '/fonts/geist-mono/geist-mono-wght.woff2', weight: '100 900', style: 'normal', preload: true }]
    }
  },
  colors: {
    paper: '#FCFCFB',
    surface: '#F3F3F1',
    ink: '#111111',
    inkSoft: '#4A4A46',
    inkMuted: '#6B6B66',
    rule: '#E6E6E2',
    accent: '#2B57F5',
    accentInk: '#FFFFFF'
  }
};
