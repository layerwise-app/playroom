import { defineProject } from '~/content/types';
import Demo from './sundial/demo';
import { images } from './sundial/images';
import { color, fonts, ink } from './sundial/theme';

export default defineProject({
  slug: 'sundial',
  order: 2,
  title: 'Sundial',
  summary: 'a term scheduler for an arts school that shows its work',
  client: 'Fernwood Community School of the Arts',
  year: '2024',
  role: 'Product designer and front-end prototyper',
  team: ['Ines Alvarez, program coordinator', 'Dev Patel, engineer', 'Mina Okafor, design and front end'],
  theme: { color, ink },
  fonts,
  cover: {
    image: images.cover,
    alt: 'Sundial’s week view with two classes moved by the solver, a conflict card for the Kiln room on Tuesday at 4:30, and a family’s phone asking whether Guitar Lab can move to 6:00.'
  },
  preview: {
    type: 'demo',
    Demo,
    label:
      'Live demo of Sundial’s week view. Drag a class to another slot, or focus one and use the arrow keys. Press P to pin it, and the solver routes around it.'
  },
  problem: {
    brief:
      'Fernwood runs 320 after-school and weekend classes a week in 14 rooms, taught by 60 part-time teachers. Building each term took Ines Alvarez, the program coordinator, about three weeks in a shared spreadsheet. Every change cascaded, teacher availability lived in her inbox, and double-bookings turned up on the first day of term: 11 of them in spring 2023.',
    constraint:
      'Ines had to be able to override anything, so the solver could suggest but never decide. A class with enrolled families could never move without those families knowing. Fernwood has one engineer, Dev Patel, so it had to run on their existing Postgres with a solver small enough for him to own. And the spreadsheet had to keep working until people trusted the new thing.'
  },
  decisions: [
    {
      title: 'Show the solver’s work',
      body: 'In the first prototype the solver recomputed the week and redrew it. Ines couldn’t see what had changed, so she rechecked everything, which was the job we were trying to remove. Now a moved class glides from its old slot to its new one, the status line names every move, and the class panel says *why* it moved.'
    },
    {
      title: 'Pins, not settings',
      body: 'I started with a constraints form: room rules, teacher rules, priorities. Nobody filled it in, because nobody thinks about a term that way. Instead you pin a class to lock it where it is, and the solver routes around pins. Teacher availability is painted on a grid, not typed into fields.'
    },
    {
      title: 'Conflicts in plain words',
      body: 'The spreadsheet said CLASH in red, when its formula caught the clash at all. Sundial says “Kiln room is booked twice on Tuesday at 4:30,” names both classes, and offers fixes ranked by how many people they touch. Keeping both is always one of the options, because sometimes Ines knows something the solver doesn’t.'
    },
    {
      title: 'Enrolled classes ask first',
      body: 'Once a term is live, a move that touches enrolled families is held as a proposal that shows how many families it affects. Sundial asks them in one short email and waits for answers. Only then does the change reach the publish summary, which also writes it back to the spreadsheet the front desk still reads.'
    }
  ],
  blocks: [
    {
      type: 'demo',
      caption:
        'The week view, live. Raku Firing goes into Tuesday at 4:30, the Kiln room is already taken, and the solver moves two classes where you can watch. Drag anything, pin with P, and try to break it.'
    },
    {
      type: 'beforeAfter',
      before: {
        image: images.spreadsheet,
        label: 'The spreadsheet',
        alt: 'A term spreadsheet titled Fall 2024 MASTER schedule v7, with one fill color per weekday, a Clash column that only flags Teen Choir and Drum Circle, and a comment thread where Dev explains that “Kiln Rm” and “Kiln room” don’t match.'
      },
      after: {
        image: images.week,
        label: 'Sundial',
        alt: 'Sundial’s week view for September 9 to 13, with classes tinted by room, Raku Firing placed on Tuesday at 4:30, dashed arrows showing Wheel Throwing moved to Thursday and Sculpture I to Wednesday, and a side panel explaining why.'
      },
      caption:
        'The same week of fall 2024. The clash column missed Raku Firing because one row said “Kiln Rm.” In Sundial the move is drawn on the week and explained beside it.'
    },
    {
      type: 'text',
      heading: 'Two weeks at the front desk',
      body: [
        'I sat with Ines while she built the summer session. The spreadsheet wasn’t really the problem. It was the only place the whole term existed, and seven versions of it lived in the same file because nobody dared delete one.',
        'Most of her time went to checking what a change had broken. Moving one ceramics class meant re-reading the kiln, the teacher’s emails, and every class that shared either. The tool had to do that checking, and then show her that it had.',
        'I also tried the obvious thing first: a solver that generated the whole term at once. Ines looked at the result and said she’d have to check all 320 classes anyway. We dropped it that afternoon and built something that makes one small move at a time.'
      ]
    },
    {
      type: 'image',
      image: images.conflict,
      size: 'wide',
      alt: 'A conflict card over the week of October 14 reading “Kiln room is booked twice on Tuesday at 4:30,” listing Raku Firing with 8 enrolled families and a new Teen Ceramics section, followed by three ranked fixes.',
      caption:
        'Mid-term, a waitlist section lands on a taken slot. Raku Firing has eight enrolled families, so nothing moves on its own. The card explains the clash and ranks fixes by who they affect.'
    },
    {
      type: 'image',
      image: images.availability,
      alt: 'Rosa Ortega’s availability painted on a half-hour grid: Tuesday and Thursday afternoons in cobalt, Thursday 4:30 to 6:30 marked as preferred, Fridays hatched out from October 1, and her original email quoted on the right.',
      caption:
        'Availability used to live in email threads. Now it’s painted on a half-hour grid, with the email it came from kept beside it. This is why the solver sent Wheel Throwing to Thursday and not Wednesday.'
    },
    {
      type: 'quote',
      text: 'The spreadsheet never told me what I’d broken. Sundial shows me, and it asks before it touches anybody’s Tuesday.',
      name: 'Ines Alvarez',
      role: 'Program coordinator, Fernwood'
    },
    {
      type: 'image',
      image: images.rooms,
      alt: 'Tuesday, September 10 by room: nine rooms across two floors, classes drawn at their real lengths, the Kiln room closed for a bisque firing in the evening, and two free two-hour blocks outlined.',
      caption:
        'The by-room view is where Ines goes looking for space. Free blocks over an hour are outlined, and firing nights close the Kiln room.'
    },
    {
      type: 'imagePair',
      images: [
        {
          image: images.publish,
          label: 'Coordinator',
          alt: 'A publish summary reading “6 changes · 42 families will get an email,” listing each change with its families and whether they were asked first, plus options to write back to the spreadsheet and to email now.'
        },
        {
          image: images.familyMobile,
          label: 'Family',
          alt: 'A family’s phone showing Fernwood asking whether Guitar Lab can move to 6:00, with yes and no buttons and the week’s three classes, next to the email that links to it.'
        }
      ],
      caption:
        'Families in a class are asked in one short email before a live change goes out. The publish summary shows who answered and writes the changes back to the spreadsheet.'
    },
    {
      type: 'text',
      heading: 'Built to be owned by one engineer',
      body: [
        'I prototyped the week view in React against a copy of Fernwood’s Postgres, so Dev could see real queries from the first week. The solver is a few hundred lines with four rules: a room can’t double-book, a teacher can’t be in two places, painted availability is a hard edge, and pins never move.',
        'When something has to move, it looks for the nearest slot, same time on another day first, so families keep their afternoon. We tried a scoring model for family-friendly times and dropped it, because nobody, including me, could explain its choices to Ines.'
      ]
    }
  ],
  outcome: {
    summary:
      'Ines built the fall 2024 term in four days instead of three weeks, and the first day of term had no double-bookings. Mid-term change requests mostly close the same day. By week two the coordinators had stopped opening the spreadsheet, though it still updates every time they publish.',
    metrics: [
      {
        value: '4 days',
        label: 'to build the fall term, down from about three weeks',
        detail: 'Ines’s own log, first draft to published schedule, spring 2024 against fall 2024.'
      },
      {
        value: '0',
        label: 'double-bookings on the first day, down from 11',
        detail: 'Counted by the front desk on day one of spring 2023 and fall 2024.'
      },
      {
        value: '89%',
        label: 'of mid-term change requests resolved the same day',
        detail: '142 requests in fall 2024, measured from request to published change.'
      },
      {
        value: 'Week 2',
        label: 'when coordinators stopped opening the spreadsheet',
        detail: 'From the sheet’s edit history. Sundial still writes back to it on publish.'
      }
    ]
  }
});
