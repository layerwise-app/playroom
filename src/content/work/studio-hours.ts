import { defineProject } from '~/content/types';
import Demo from './studio-hours/demo';
import { images } from './studio-hours/images';
import { color, fonts, ink } from './studio-hours/theme';

export default defineProject({
  slug: 'studio-hours',
  order: 5,
  title: 'Studio Hours',
  summary: 'a two-ink identity and crit wall built to outlast its student leaders',
  client: 'Studio Hours, Ashby State University',
  year: '2024',
  role: 'Identity, crit wall, and handover kit (alumni volunteer)',
  team: [
    'Jun Park, student co-lead',
    'Amara Diallo, student co-lead',
    'Theo Brandt, computer science student',
    'Mina Okafor, identity and build'
  ],
  theme: { color, ink },
  fonts,
  cover: {
    image: images.cover,
    alt: 'Studio Hours on a pink field: the Night Market riso poster in pink and blue, the crit wall in a browser with sticky notes around a draft poster, and the This week events list on a phone.'
  },
  preview: {
    type: 'demo',
    Demo,
    label:
      'Live demo of the Studio Hours crit wall. Pick I noticed, I wonder, or What if to leave a note, press Enter to pin it, then drag it into place.'
  },
  problem: {
    brief:
      'I co-founded Studio Hours as a student in 2015. When I came back as an alumni volunteer in 2024, it was down to 12 regulars. Design-minded students across six majors had no shared room, and the club ran on one president: when leaders graduated, the logins, templates, and poster files left with them. Jun and Amara, the new co-leads, wanted Studio Hours visible across campus, and able to survive its own leaders graduating.',
    constraint:
      'We had $400 for the year. Posters print on the library’s two-drum risograph, so pink and blue are the only colors. Every tool had to be free and something you could hand over in an afternoon, because the volunteers change every year.'
  },
  decisions: [
    {
      title: 'Two inks, one rule',
      body: 'The identity is built from the riso’s two drums. Pink is for the event, blue for the information, and where they overprint is the logo: a quarter of a disc, fifteen minutes on a clock face. A first-year can make an on-brand poster by following one sentence.'
    },
    {
      title: 'The crit wall',
      body: 'A web board where you pin work in progress and people leave sticky notes. Every note starts with one of three prompts: I noticed, I wonder, What if. We tried blank notes first and got “looks good” and “font??”. With the prompts, feedback got kinder and more *specific*, and the quietest people wrote the most.'
    },
    {
      title: '15-minute crits',
      body: 'Every crit runs the same fixed format: show it for 2 minutes, questions for 3, notes for 7, and the maker picks one note in the last 3. It’s printed on the back of every poster and every member card, so anyone can run a crit night without being taught.'
    },
    {
      title: 'A kit that fits in one folder',
      body: 'Templates, the poster generator, and a one-page handover doc live in one shared folder. Every password sits in a shared vault owned by both co-leads and the faculty advisor. Nothing lives in one person’s account anymore.'
    }
  ],
  blocks: [
    {
      type: 'demo',
      caption:
        'The crit wall during notes. Pick a prompt to leave your own note, press Enter to pin it, and drag notes or move them with the arrow keys.'
    },
    {
      type: 'image',
      image: images.posterSeries,
      size: 'full',
      alt: 'Three risograph posters taped to a painted block wall: Night Market, Friday 7pm, North Quad, with blue halftone lanterns above pink type; Crit Night, Thursdays 6:30, a pink disc and blue square overprinting in violet; and Type & Tea, Wednesday 4pm, the blue title printed over a pink teacup.',
      caption:
        'Three posters from the first semester. Pink carries the event and its time; blue carries the title, the place, and the details. Each one is two passes through the library riso.'
    },
    {
      type: 'text',
      heading: 'Designing for the machine we had',
      body: [
        'The library riso has two drums, and pink and blue are what was in them. I stopped treating that as a limit once we saw how the inks behave: the blue lands a hair off register every time, and where it crosses the pink you get a deep violet for free.',
        'So the rule became the brand. Pink says *when*. Blue says where and what. The overprint is reserved for the mark, so it always means Studio Hours. Early posters broke the rule constantly, which is why the crit wall exists: Noor’s Night Market poster went through three drafts and 24 notes before the pink only marked the time.'
      ]
    },
    {
      type: 'image',
      image: images.critWall,
      size: 'wide',
      alt: 'The crit wall in a browser: tonight’s five 15-minute crits on the left, Noor’s Night Market draft pinned in the middle with seven sticky notes around it, and a tally of notes by prompt with Noor’s pick on the right.',
      caption:
        'Crit night on the wall. Theo and I built it on free hosting with a spreadsheet as the database, so the next co-leads can read the data without either of us.'
    },
    {
      type: 'quote',
      text: 'The prompts did the work we used to do by asking people to be nice. You can’t write “I noticed” and then just say it’s bad. You have to say what you saw.',
      name: 'Amara Diallo',
      role: 'Student co-lead, 2024–25'
    },
    {
      type: 'imagePair',
      images: [
        {
          image: images.memberCard,
          alt: 'Front and back of a riso-printed Studio Hours membership card on a blue field. The front shows the mark and Priya Nair’s name; the back shows Thursdays 6:30 and the 15-minute crit format as a ring.',
          label: 'Member card'
        },
        {
          image: images.eventsMobile,
          alt: 'A phone showing This week: tonight’s crit night in Hale Hall B14 with one slot left, Friday’s Night Market, and Saturday’s riso print day, each with its time in a pink disc.',
          label: 'This week'
        }
      ],
      caption:
        'The member card carries the crit format on its back. The events page follows the poster rule: the time sits in pink, the place in blue.'
    },
    {
      type: 'image',
      image: images.posterGenerator,
      size: 'wide',
      alt: 'The poster generator in a browser: a form for the event, day, time, and place, a choice of three layouts, a two-ink preview of the Type & Tea poster, and its pink and blue masters printed in black.',
      caption:
        'The poster generator. Type the event, pick a layout, and download one black master per drum. It checks the ink rule before you print, and a run of 60 costs about $9.'
    },
    {
      type: 'text',
      heading: 'Handing it over',
      body: [
        'The test for every tool was whether Jun and Amara could hand it to strangers in one afternoon. If it needed me to explain it, we cut it. A booking system, a paid design tool, and a second chat app all went that way.',
        'The kit is one folder: a one-page read-me, the crit night sheet, templates, the generator, and the vault. In April 2025 Jun and Amara handed it to Priya and Sol in about two hours. A year later Priya and Sol handed it on, and *I wasn’t in the room*.'
      ]
    },
    {
      type: 'image',
      image: images.kit,
      size: 'wide',
      alt: 'The one-page sheet “How to run a crit night”, printed in pink and blue with the 15-minute format as a ring, beside the kit page listing six items and two handovers with no files lost.',
      caption:
        'The kit: the one-page crit night sheet and the folder it lives in. The last line of the sheet tells you to fix it if it’s wrong.'
    }
  ],
  outcome: {
    summary:
      'Over two academic years Studio Hours grew from 12 regulars to 340 members and changed hands twice without me. Two other schools now run crit nights from a copy of the kit.',
    metrics: [
      { value: '340', label: 'members, up from 12 regulars', detail: 'Member list, fall 2024 to spring 2026' },
      { value: '64', label: 'crit nights', detail: 'Counted from the wall archive' },
      { value: '1,900', label: 'notes left on the wall', detail: 'Wall archive, all three prompts' },
      { value: '0', label: 'files lost in two handovers', detail: 'April 2025 and April 2026, checked against the kit folder' }
    ]
  }
});
