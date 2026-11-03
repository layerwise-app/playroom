import { defineProject } from '~/content/types';
import Demo from './openhand/demo';
import { images } from './openhand/images';
import { color, ink, fonts } from './openhand/theme';

export default defineProject({
  slug: 'openhand',
  order: 1,
  title: 'Openhand',
  summary: 'a drafting agent for nonprofit campaign pages that you can interrupt',
  client: 'Openhand',
  year: '2025',
  role: 'Lead product designer, agent interaction and prototype',
  team: [
    'Priya Raman, product manager',
    'Tomás Ferreira, ML engineer',
    'Hana Lee, content designer',
    'Three product engineers'
  ],
  theme: { color, ink },
  fonts,
  cover: {
    image: images.cover,
    alt: 'The Openhand editor mid-draft. The agent’s cursor drags a Photo block onto a campaign page for Riverside Tool Library while three dashed blocks wait for Keep or Try another. Beside it, the published page on a phone shows $7,340 raised of $18,000.'
  },
  preview: {
    type: 'demo',
    Demo,
    label:
      'Live demo of the Openhand editor drafting a campaign page block by block. Hover to pause the agent, then keep or swap each block and publish.'
  },
  problem: {
    brief:
      'About 4,200 small nonprofits, from food pantries to youth leagues, build their campaign pages in Openhand’s block editor. The median page took 3 hours 10 minutes to publish, and 42% went live without a story block, even though pages with a story raised about twice as much. Openhand wanted AI to write the first draft, and Priya’s framing became the brief: *make the first draft cost one sentence*, without the org losing authorship.',
    constraint:
      'The agent could only place and fill Openhand’s existing 12 blocks, never generate HTML, so every page stayed editable and accessible. It could never invent a number. A made-up “$50 feeds a family for a week” is a trust problem, and for a registered charity it’s a legal one. Every agent action had to be visible and undoable, and each draft had a fixed cost budget.'
  },
  decisions: [
    {
      title: 'A cursor, not a chat',
      body: 'Our first prototype was a chat panel beside the editor. You typed, the page changed, and in testing nobody could say what had moved. So the agent got a cursor instead. It picks blocks from the rail and fills them on the canvas one at a time, where you can watch it and step in.'
    },
    {
      title: 'Pending until you keep it',
      body: 'Agent blocks arrive with a dashed outline and two buttons, Keep and Try another. Try another swaps in a real alternative, like a different headline or a story built around a pull quote, not the same sentence reworded. Nothing publishes until a person has kept every block.'
    },
    {
      title: 'Numbers come only from you',
      body: 'Every figure in a draft carries its source: “From your brief,” or “From your settings” for gift amounts. When the brief has no number, the goal stays an empty field that says “Add your goal. We won’t guess.” Hana wrote that line, and it built more trust than any disclaimer we tested.'
    },
    {
      title: 'Move your mouse and it stops',
      body: 'When your pointer enters the canvas, the agent yields mid-step and its cursor reads “Paused, your turn.” Move away or press Let it finish and it picks up where it stopped. The Openhand card on my work wall behaves the same way: hover it and the loop hands you the page.'
    }
  ],
  outcome: {
    summary:
      'The agent shipped to every org in September 2025. Speed was the headline, but the change I care about is quieter: almost every page now launches with a story, and every number on it is one the org gave us.',
    metrics: [
      {
        value: '38 min',
        label: 'median time to first publish, down from 3 h 10 min',
        detail: 'New campaign pages in the eight weeks after launch, against the eight weeks before.'
      },
      {
        value: '91%',
        label: 'of pages launch with a story block, up from 58%',
        detail: 'All published campaign pages over the same two windows.'
      },
      {
        value: '0',
        label: 'fabricated figures in 4,800 audited agent drafts',
        detail: 'Hana’s team checked every figure against the org’s brief and settings.'
      },
      {
        value: '71%',
        label: 'of agent blocks kept on the first pass',
        detail: 'Kept without Try another or an edit, across all drafts since launch.'
      }
    ]
  },
  blocks: [
    {
      type: 'demo',
      caption:
        'The real editor interaction, running live. Hover and the agent pauses mid-step. Keep or swap each block, then publish. Press Start over and keep your pointer on the rail to watch it draft from empty.'
    },
    {
      type: 'image',
      image: images.brief,
      alt: 'Openhand’s new page screen. The org’s sentence, “We need $18,000 by Nov 30 to fix our leaking roof,” sits in a text field. A panel beside it lists what was found: goal $18,000 and deadline Nov 30, both tagged From your brief, cause building repair, and gift amounts $25, $60 and $120 tagged From your settings.',
      caption:
        'Step one is a sentence. The panel shows each fact as it’s found, and where it came from, before the agent touches the page.',
      size: 'wide'
    },
    {
      type: 'text',
      heading: 'What we tried first',
      body: [
        'The chat prototype wrote a whole page in about 40 seconds. In sessions with eight orgs, six couldn’t say what had changed when it finished, and two published blocks they hadn’t read. Fast, and nobody’s page.',
        'Working block by block on the canvas looked slower on paper, but people read as it went. It also kept us inside Tomás’s cost budget: Try another regenerates one block, never the whole draft.'
      ]
    },
    {
      type: 'image',
      image: images.canvas,
      alt: 'The editor mid-draft. Dolores’s cursor rests on the hero’s Try another button while the agent’s cursor sits in a half-drafted Story block, tagged Paused, your turn. The top bar reads Agent paused, with a Let it finish button.',
      caption:
        'Dolores moves onto the page and the agent stops mid-block. Its cursor says so, and the top bar offers a way to let it finish.',
      size: 'wide'
    },
    {
      type: 'image',
      image: images.review,
      alt: 'The editor with the review panel open. A pinned card lists the only numbers in the draft and their sources: $18,000 and Nov 30 from the brief, $25, $60 and $120 from settings. Below, five suggestions: Hero and Photo kept, Goal, Story and Donate pending with Keep and Try another, and counters like 2 of 3.',
      caption:
        'The review panel lists every suggestion, how many real alternatives each one has, and the numbers rule pinned on top.'
    },
    {
      type: 'image',
      image: images.numbers,
      alt: 'A close-up of a draft for Eastside Youth Soccer, whose brief named no amount. The Goal field is empty with the placeholder “Add your goal. We won’t guess.” and a note that the brief didn’t include an amount. The agent’s cursor beside it is labeled Left empty for you.',
      caption:
        'When a brief has no number, the agent drafts everything else and leaves the goal empty, with the reason in plain words.'
    },
    {
      type: 'image',
      image: images.history,
      alt: 'The editor with the activity panel open: a timeline of agent and volunteer actions with times, such as Agent added Story at 10:42 with an Undo link, Agent paused because Dolores moved onto the page, and Dolores kept Photo at 10:46.',
      caption:
        'Every agent action lands in the activity log with an Undo, including the moments it stopped for someone.'
    },
    {
      type: 'quote',
      text: 'I typed one sentence on my lunch break and watched it lay the page out. I swapped the headline because it didn’t sound like us, kept the rest, and we were live before I went back to the counter.',
      name: 'Dolores Vance',
      role: 'Volunteer coordinator, Riverside Tool Library'
    },
    {
      type: 'imagePair',
      images: [
        {
          image: images.donorMobile,
          alt: 'The published Riverside Tool Library page on a phone: the roofline illustration, the headline Fix the roof before winter, $7,340 raised of $18,000 from 112 donors, the story, and gift buttons for $25, $60 and $120 above a Donate button.',
          label: 'Phone'
        },
        {
          image: images.donorDesktop,
          alt: 'The same published page on a laptop, with the illustration and story on the left and a giving card on the right showing $7,340 raised of $18,000, the gift amounts, a Donate button and recent gifts.',
          label: 'Laptop'
        }
      ],
      caption:
        'What donors see. Because the agent can only use Openhand’s own blocks, the page reflows to a phone with nothing extra to check.'
    }
  ]
});
