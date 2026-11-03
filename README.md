# Playroom

A light, contemporary portfolio template for a product designer who codes. It ships with a
fictional designer, Mina Okafor, and five sample case studies whose screens are
real React components: every card on the home page runs a live demo you can
pause and try.

Built with TanStack Start, React, Tailwind CSS, and Cloudflare Workers (D1 for
contact messages, Layerwise Email for notifications). Every page renders on the
server. There are no accounts, no admin, and no CMS: content is TypeScript files
in `src/content/`.

## Commands

```bash
pnpm dev                 # local preview (Layerwise runs this for you)
pnpm check-types         # TypeScript
pnpm lint                # oxlint
pnpm test                # vitest: contact rules, content checks, image script
pnpm build               # production build
pnpm add-images <folder> <images…>   # see "Images" below
pnpm icons                           # favicons and app icons from public/logo.svg
pnpm db:generate --name <change>     # after editing src/db/schema.ts
pnpm db:migrate                      # apply migrations locally
pnpm cf-typegen                      # after editing wrangler.jsonc
```

## Where things live

| Path                              | What it holds                                                        |
| --------------------------------- | -------------------------------------------------------------------- |
| `src/portfolio.config.ts`         | Name, greeting, intro, bio, socials, CV, fonts, colors, email        |
| `src/content/about.ts`            | About page: heading, services, experience, clients                   |
| `src/content/work/<slug>.ts`      | One case study                                                       |
| `src/content/work/<slug>/`        | Its images, theme, and (optionally) live demo                        |
| `src/content/writing/<slug>.ts`   | One essay                                                            |
| `src/lib/site.ts`                 | Search and sharing: description, share image, domain, sitemap paths |
| `public/mina-okafor-cv.pdf`       | The CV the About page links to (`portfolio.cv`)                      |
| `public/og-image.jpg`             | Share image for pages without their own (1200 × 630)                 |
| `public/logo.svg`                 | The logo; `pnpm icons` makes `logo.png` and every favicon from it    |
| `public/fonts/`                   | Self-hosted fonts, each with its license                             |

Pages: Home (`/`, the Work tab), Play (`/play`), About (`/about`), Writing
(`/writing` and `/writing/<slug>`), a case study per project (`/work/<slug>`),
and Contact (`/contact`). `/work` redirects to `/`.

## Make it yours

1. Edit `src/portfolio.config.ts`: `name`, `role`, `location`, the home
   intro (`greeting` in the selection frame, then the two lines `intro` and
   `previously`), `bio`, `availability`, and `socials` (replace the placeholder
   profile addresses).
2. Set `ownerEmail` to the address that should receive contact messages. While
   it's empty, messages are saved to the database but not emailed.
3. Edit `src/content/about.ts`, replace `public/mina-okafor-cv.pdf` with your
   CV, and point `portfolio.cv` at its file name.
4. In `src/lib/site.ts`, rewrite `description`, and set `url` once a custom
   domain is connected.
5. Replace `public/og-image.jpg` with a 1200 × 630 screenshot of your intro.
6. Replace `public/logo.svg` with your own square logo and run `pnpm icons`.
   It writes `logo.png` (1024 × 1024), `favicon.svg`, `favicon.ico`, the
   16 and 32 px PNGs, `apple-touch-icon.png`, and both `android-chrome` icons.
   Small icons stay sharp when lines sit on whole pixels at 16 and 32 px: on a
   1024 canvas, put edges on multiples of 64. The app manifest
   (`/site.webmanifest`) takes its name and colors from the portfolio config.
7. Replace the sample work and essays (below).

## Add a project

A project is one content file plus a folder of images. Use a short, lowercase
slug with hyphens, like `field-notes`; it becomes the URL `/work/field-notes`.

1. **Export at least five screens** as PNG (or JPG/WebP) at 2x, ideally
   2880 px wide. Name one `cover.png` at 2880 × 1512: it's the share image, the
   still on the case study, and the image under the next-project link. The
   example below uses `cover.png`, `review-panel.png`, `inbox.png`, `tag.png`,
   and `summary.png`.

2. **Add the images:**

   ```bash
   pnpm add-images src/content/work/field-notes ~/Desktop/field-notes/*.png
   ```

   This writes WebP files 800, 1600, and 2880 px wide to
   `src/content/work/field-notes/images/` (never wider than the original),
   measures each image, makes a blurred placeholder, writes a 1200 × 630
   `cover-og.jpg`, and generates `src/content/work/field-notes/images.ts`.
   `review-panel.png` becomes `images.reviewPanel`. GIFs are copied untouched;
   SVGs are rejected (export a PNG). Run it again to add or replace images.

3. **Write `src/content/work/field-notes.ts`:**

   ```ts
   import { defineProject } from '~/content/types';
   import { images } from './field-notes/images';

   export default defineProject({
     slug: 'field-notes',
     order: 6, // position on the work wall, lowest first
     title: 'Field Notes',
     summary: 'a research log that turns interviews into decisions', // finishes "Field Notes —"
     client: 'Pocket Orchard',
     year: '2026',
     role: 'Product design and prototype',
     team: ['Ines Moreau, research', 'Mina Okafor, design'],
     theme: { color: '#2F7D5B', ink: '#FFFFFF' }, // the project's one saturated color
     cover: { image: images.cover, alt: 'Describe what the cover shows.' },
     preview: { type: 'image', image: images.cover, alt: 'Describe what the cover shows.' },
     problem: {
       brief: 'What the client asked for, and why it mattered.',
       constraint: 'What made it hard.'
     },
     decisions: [
       { title: 'A decision', body: 'What you chose, what you tried first, and why.' },
       { title: 'Another decision', body: '…' }
     ],
     outcome: { summary: 'What changed, with numbers if you have them.' },
     blocks: [
       { type: 'image', image: images.reviewPanel, alt: '…', caption: '…', size: 'wide' },
       { type: 'imagePair', images: [{ image: images.inbox, alt: '…' }, { image: images.tag, alt: '…' }] },
       { type: 'quote', text: '…', name: 'Ines Moreau', role: 'Research lead, Pocket Orchard' },
       { type: 'image', image: images.summary, alt: '…', caption: '…' }
     ]
   });
   ```

4. **Check it.** The project appears on the home page, at `/work/field-notes`,
   in `/sitemap.xml`, and in the previous project's next link, with no other
   changes. `pnpm test` checks every project has the required fields, a brief
   and constraint of a few sentences each, at least two decisions, at least
   five distinct screens (the cover counts), real alt text on each image, and
   a share image.

Text fields accept `*asterisks*` for the serif italic.

### Case study blocks

| Block         | Fields                                                              |
| ------------- | ------------------------------------------------------------------- |
| `demo`        | `caption?`. Mounts the project's live demo (needs a demo preview)   |
| `image`       | `image`, `alt`, `caption?`, `size?`: `column`, `wide`, or `full`    |
| `imagePair`   | `images: [{ image, alt, label? }, { image, alt, label? }]`, `caption?` |
| `video`       | `src`, `poster`, `alt` (what happens in it), `caption?`             |
| `text`        | `heading?`, `body: string[]`                                        |
| `quote`       | `text`, `name`, `role`                                              |
| `beforeAfter` | `before: { image, alt, label? }`, `after: { … }`, `caption?`        |
| `metrics`     | `items: [{ value, label, detail? }]`, `caption?`                    |

`outcome.metrics` takes the same items as the `metrics` block.

### The card preview: live demo, image, or video

`preview` decides what runs in the project's card and in its `demo` block.

- **Image:** `{ type: 'image', image: images.cover, alt: '…' }`
- **Video:** put a short, silent MP4 (H.264, under about 2 MB) in the project
  folder and import it, so the build fingerprints it:

  ```ts
  import clip from './field-notes/video/clip.mp4';
  // …
  preview: { type: 'video', src: clip, poster: images.cover, alt: 'What happens in the clip.' }
  ```

  Videos loop muted, play only while on screen, have a pause button, and show
  the poster to people who prefer reduced motion.
- **Live demo:** `{ type: 'demo', Demo, label: 'What the demo shows and how to use it.' }`
  with `Demo` imported from `./<slug>/demo`.

To swap one of the sample demos for an image or video, change its `preview`
as above and remove any `{ type: 'demo' }` block from its `blocks`. The demo
files can then be deleted.

### Build a live demo

A demo is a React component that mounts real UI on a fixed-size stage, plus a
script that plays it on a loop. `src/content/work/marigold/demo.tsx` is the
shortest example.

- `<Stage width={520} height={416}>` scales its contents to the card. Inside,
  Tailwind sizes and `u(n)` are in stage units, so the demo looks the same at
  every width.
- `useDirector(async (d) => { … })` runs the loop: `d.move('target')` glides
  the cursor to an element with `data-target="target"`, `d.press()` clicks,
  `d.type(text, set)` types, `d.wait(ms)` pauses. Render `<DemoCursor>` inside
  the stage and pass `rootRef` as its `innerRef`.
- The component's initial state must be its **finished** state. That's what
  the server renders, what people with reduced motion see, and what the loop
  starts from: a pass holds it, resets, and builds back up.
- The loop pauses off screen and in background tabs. Hovering the card (or
  tapping it on a phone, or focusing it with the keyboard) stops the loop and
  hands the controls to the visitor; `d.engaged` is then true.
- Everything must work with a tap and a keyboard. Never put content behind
  hover alone.

Give the project fonts of its own in `<slug>/theme.ts` (`fonts`), and pass
them as `fonts` in the content file. They load only on pages that show the
project.

## Replace the sample work

Delete each sample's content file and folder, for example
`src/content/work/openhand.ts` and `src/content/work/openhand/`. Then delete any
fonts under `public/fonts/` that no project uses any more: Figtree (Openhand),
IBM Plex Sans Condensed (Sundial), Atkinson Hyperlegible Next (Marigold),
Fraunces (Kittiwake), Bricolage Grotesque (Studio Hours).

The sample screens were drawn as React components in each project's
`stills.tsx` (using the same parts as its demo), rendered at 2x, and added with
`pnpm add-images`. They stay as the source of those images; your projects
don't need a `stills.tsx`.

Essays are files in `src/content/writing/`. Add one with `defineEssay` (`slug`
matching the file name, `title`, `dek`, an ISO `date`, and `body` blocks of
`p`, `h2`, or `quote`). Essays are listed newest first on the Writing tab,
and each gets its own page.

## Fonts and colors

**Colors** are in `portfolio.colors`. `paper` is the page, `surface` the raised
panels (footer, form, segmented controls), `ink` the text, `inkSoft` and
`inkMuted` the secondary text, `rule` the hairlines, and `accent` the selection
frame, construction marks, and focus rings. Keep `ink`, `inkSoft`, `inkMuted`,
and `accent` at 4.5:1 or better against `paper` (the defaults are 18.4, 8.7,
5.2, and 5.4). The page stays quiet on purpose: color comes from each project's
`theme.color`.

**Fonts** are in `portfolio.fonts`: `sans` for everything, `serif` for a word
or two of emphasis (`*asterisks*` in any text field), and `mono` for small
details like dates, labels, and the frame's size tag. To change one:

1. Put the WOFF2 files and their license in `public/fonts/<family>/`.
2. Set `family`, `fallback`, and `files` (`src`, `weight`, `style`). Mark the
   files the first screen needs with `preload: true`.

Fonts use `font-display: optional` and the first-screen files are preloaded,
so text is readable immediately and never shifts when a font arrives late.
The fonts are subset to Latin and Latin Extended-A; check your own files cover
the characters you need.

### Bundled fonts

All are under the SIL Open Font License 1.1; each folder in `public/fonts/`
holds its license.

| Font                         | Used for                 | Copyright                                              |
| ---------------------------- | ------------------------ | ------------------------------------------------------ |
| Geist                        | Site sans                | Vercel, in collaboration with basement.studio          |
| Geist Mono                   | Site mono details        | Vercel, in collaboration with basement.studio          |
| Instrument Serif (italic)    | Site accent words        | The Instrument Serif Project Authors                   |
| Figtree                      | Openhand screens         | The Figtree Project Authors (Erik Kennedy)             |
| IBM Plex Sans Condensed      | Sundial screens          | IBM Corp.                                              |
| Atkinson Hyperlegible Next   | Marigold screens         | The Atkinson Hyperlegible Next Project Authors (Braille Institute) |
| Fraunces (soft)              | Kittiwake brand and site | The Fraunces Project Authors (Undercase Type)          |
| Bricolage Grotesque          | Studio Hours identity    | The Bricolage Grotesque Project Authors (Atelier Triay) |

## Contact form

`/contact` validates on the server and saves each message to the
`contact_messages` table (see the Database panel in Layerwise). Each visitor
can send 3 messages per 10 minutes, counted by IP address (stored only as a
salted hash), and a hidden `website` field quietly drops bots. When `ownerEmail` is
set, each message is also emailed there with Layerwise Email, with Reply-To set
to the sender. In the local preview, that email lands in Email → Local instead
of a real inbox.

## Search and sharing

Every public page sets its title, description, canonical URL, and share image;
case studies use their cover's `cover-og.jpg`. The home and About pages publish
schema.org `Person` data, case studies `CreativeWork`, and essays
`BlogPosting`. `/sitemap.xml` lists every page, case study, and essay.

## Motion and accessibility

- Text is readable on the first frame; there's no preloader.
- Demos, videos, the typing experience list, and the Kittiwake sea shader run
  only while on screen. The sea falls back to a still when WebGL isn't
  available.
- With reduced motion, everything shows its finished state.
- Phones scroll normally, with no custom cursor and nothing behind hover.
- Everything is reachable by keyboard, with a visible focus ring.
