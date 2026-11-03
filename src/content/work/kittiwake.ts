import { defineProject } from '~/content/types';
import Demo from './kittiwake/demo';
import { images } from './kittiwake/images';
import SeaTexture from './kittiwake/texture';
import { color, fonts, ink } from './kittiwake/theme';
import heroVideo from './kittiwake/video/hero.mp4';

export default defineProject({
  slug: 'kittiwake',
  order: 4,
  title: 'Kittiwake',
  summary: 'a brand and website that sell a six-day coastal walk without a phone call',
  client: 'Kittiwake, Bristol',
  year: '2023–24',
  role: 'Brand identity, website design, route explorer prototype',
  team: ['Ros Penhallow, co-founder', 'Callum Hart, co-founder', 'Ada Kwon, freelance engineer', 'Mina Okafor, design'],
  theme: { color, ink, Texture: SeaTexture },
  fonts,
  cover: {
    image: images.cover,
    alt: 'A montage on a duotone sea: the Cornwall’s North Coast trip page in a browser, the same trip on a phone with its route map, and a Kittiwake luggage tag cut along a coastline.'
  },
  preview: {
    type: 'demo',
    Demo,
    label: 'Live demo of the Kittiwake route explorer. Pick a day, or drag along the days, to see where you walk and where your bags go.'
  },
  problem: {
    brief:
      'Kittiwake is six people in Bristol selling self-guided coastal walks in the UK and Ireland, with the inns booked and the luggage carried ahead. Ros Penhallow and Callum Hart sold about 400 trips a year through word of mouth, a spreadsheet and a template site, and each sale took about 2.4 phone calls. The calls were nearly always the same two questions: how hard is it, and where are my bags? They asked for a brand and a site that could sell a six-day walk without anyone picking up the phone.',
    constraint:
      'There was no budget for a photo shoot in year one, only about 2,000 phone photos from the guides. Engineering was Ada Kwon, freelance, on a static site. The identity had to work on a luggage tag, a booking email and a 16 px favicon, and most of the people booking are 45 to 70, on their phones.'
  },
  decisions: [
    {
      title: 'The tide-line',
      body: 'The mark is a single line traced from the coast of their first route, Padstow to Bude, and turned to run level. The same line is the base of the logo, the style of every map, and the cut edge of the luggage tag. At 16 px it keeps three bumps: Pentire, Tintagel and Cambeak.'
    },
    {
      title: 'Hours, not grades',
      body: '“Moderate” meant something different to every caller, and nobody reading it on a phone could check it. So each day is described in hours of walking and climbing in flights of stairs, which people can picture from their own house. The numbers come from the guides’ GPS tracks, at a pace Ros agreed was honest.'
    },
    {
      title: 'Phone photos, one treatment',
      body: 'The guides’ photos were all we had, and no two matched. A duotone of deep sea and sand with grain makes a grey morning in Northumberland and a bright afternoon in Kerry look like the same company. On the homepage the treatment comes alive as a slow sea, drawn by a shader that weighs less than the photo it replaced.'
    },
    {
      title: 'The route explorer',
      body: '“Where are my bags?” took a paragraph to answer in words. In the explorer you scrub through the days: the walker moves along the coast path and the bags hop ahead to that night’s inn, with the time they get there. Ada built it on the same map data as the static pages, so it costs one small script.'
    }
  ],
  outcome: {
    summary:
      'We launched in March 2024, before the season. The calls didn’t stop, but they changed: people ring about dates and dogs now, not difficulty. If I did it again I’d put the hours on the trip cards from the start. We added them in June, after Ada’s logs showed people opening every trip page just to find them.',
    metrics: [
      {
        value: '61%',
        label: 'of bookings now come in direct, with no call',
        detail: 'Up from none. April to October 2024, from the booking system.'
      },
      {
        value: '2.4 → 0.6',
        label: 'phone calls per booking',
        detail: 'Ros logged every call against its booking in the spreadsheet, the season before and the season after.'
      },
      {
        value: '5.3 days',
        label: 'average trip length, up from 4.1',
        detail: 'Bookings for 2024 against 2023. Longer trips sold once people could see what each day asks of them.'
      }
    ]
  },
  blocks: [
    {
      type: 'demo',
      caption:
        'The route explorer. Pick a day or drag along the line: the walker follows the coast path, and the bags hop ahead to that night’s inn.'
    },
    {
      type: 'image',
      image: images.brandSheet,
      size: 'full',
      alt: 'Kittiwake brand sheet: the coast from Pentire Point to Bude turned 50 degrees into a level line under the Kittiwake wordmark, the wordmark in sand on a duotone sea, favicons at 64, 32 and 16 px, six palette swatches, a Fraunces type specimen, and a harbour photo in the duotone treatment.',
      caption: 'One line does most of the work: the logo, the maps, the tag edge, and three bumps at 16 px.'
    },
    {
      type: 'text',
      heading: 'A line, not a bird',
      body: [
        'The first round of marks was all kittiwakes: a gull in flight, a gull’s head, a yellow beak. Every walking company in Britain has a bird, and none of them read on a luggage tag at arm’s length.',
        'The tide-line came out of the trip map I was already drawing. I traced Pentire Point to Bude, turned it so it ran level, and set the name on it. It draws in one stroke, it is *their* coast, and Callum can point to it on an Ordnance Survey sheet.',
        'Beak yellow survived as the one accent, with one rule: it only ever marks you. The walker on the map, the dot at the start of the line, the eyelet on your tag.'
      ]
    },
    {
      type: 'video',
      src: heroVideo,
      poster: images.heroPoster,
      alt: 'The Kittiwake homepage hero in motion: a slow duotone sea moves behind the headline “Walk the coast. We’ll carry the rest.” as it settles line by line, then the Cornwall’s North Coast route card slides up and steps from Padstow to Port Isaac.',
      caption: 'The hero on the live site. The sea is the photo treatment in motion: the same duotone and grain, drawn live and paused when you scroll past it.'
    },
    {
      type: 'image',
      image: images.home,
      size: 'wide',
      alt: 'The Kittiwake homepage in a browser: a dark duotone sea behind the headline “Walk the coast. We’ll carry the rest.”, a route explorer card for Cornwall’s North Coast listing hours per day, and four trip cards with duotone photos of Cornwall, Wales, Northumberland and Ireland.',
      caption: 'The homepage. Every trip card leads with hours a day, and every photo gets the same duotone, whoever took it.'
    },
    {
      type: 'image',
      image: images.difficulty,
      size: 'wide',
      alt: 'The “How hard is it?” page for Cornwall’s North Coast: six days as rows, each with a bar for hours of walking and a bar for flights of stairs. Day 3, Port Isaac to Tintagel, is darkest at 5½ hours and 290 flights.',
      caption: 'Each day on one scale, so day 3 stands out without the word “strenuous”. Fewer than one flight a minute is the line people quote back to Ros.'
    },
    {
      type: 'imagePair',
      images: [
        {
          image: images.luggageTag,
          alt: 'A booking confirmation email listing six nights, inns and the time bags arrive, beside a sea-green luggage tag whose top edge is cut along the coastline, with the walker’s name and tonight’s inn marked.'
        },
        {
          image: images.mobile,
          alt: 'Two phones on a duotone sea: the trip page with its route map and day buttons, and day 3 in detail with hours, flights of stairs, and a timeline of where the bags are from 9 am to 3 pm.'
        }
      ],
      caption:
        'The bags, on paper and in your pocket. The tag lists every inn so the driver never has to ask; on the phone, day 3 says where your bag is at 11:30.'
    },
    {
      type: 'image',
      image: images.trip,
      size: 'wide',
      alt: 'The Cornwall’s North Coast trip page: the price, four facts in a row, a day-by-day list with day 3 open, and a map of the coast from Padstow to Bude with day 3 drawn in deep sea.',
      caption: 'The trip page opens on the hard day, with when the bags leave and when they arrive.'
    },
    {
      type: 'quote',
      text: 'People used to ring to ask how hard day three was. Now they ring to ask if we’ve still got the second week of May.',
      name: 'Ros Penhallow',
      role: 'Co-founder, Kittiwake'
    }
  ]
});
