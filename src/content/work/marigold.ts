import { defineProject } from '~/content/types';
import Demo from './marigold/demo';
import { images } from './marigold/images';
import { color, fonts, ink } from './marigold/theme';

export default defineProject({
  slug: 'marigold',
  order: 3,
  title: 'Marigold',
  summary: 'a medication reminder for older adults that asks instead of alarming',
  client: 'Northside Elder Care Network',
  year: '2024–25',
  role: 'Lead designer: research, interaction design, pilot prototype',
  team: [
    'Dr. Alma Reyes, geriatric pharmacist',
    'June Whitaker, program director',
    'Two contract engineers',
    'Mina Okafor, design'
  ],
  theme: { color, ink },
  fonts,
  cover: {
    image: images.cover,
    alt: "Three phones on a marigold background: Ada's day ring at 2 of 4 done, her morning reminder asking “Did you take them?” with two large answers, and her son Daniel's text from Marigold."
  },
  preview: {
    type: 'demo',
    Demo,
    label: "Live demo of Marigold's morning reminder. Answer for Ada, or tap a time on her day ring."
  },
  problem: {
    brief:
      "Northside's nurses visit about 2,000 older adults at home in Chicago, and they kept seeing the same thing: people on five or more medications missing doses, or taking them twice because they couldn't remember. The pill-box alarms Northside handed out, and the apps families installed, worked for a week or two and then went quiet. June Whitaker, the program director, gave me a one-line brief: a reminder people are still using after the second week.",
    constraint:
      "The people using it are 72 to 94, with a median age of 81. Many have low vision, arthritis or a tremor, and some have mild cognitive impairment, so a nurse or family member does the setup and nobody manages an account or a password. It had to run on donated phones several years old. And no alarms: in our first interviews, nearly everyone had silenced theirs for good."
  },
  decisions: [
    {
      title: 'One question per screen',
      body: "Each reminder is a single question, “Morning pills. Did you take them?”, with two answers as wide as the screen. My first version had a checkbox for every pill, and people with a tremor kept hitting the wrong one. Dr. Reyes agreed that one answer per time of day was accurate enough, and it was far easier to get right."
    },
    {
      title: 'Pills shown as they look',
      body: "People know their pills by sight, not by name. Each one is drawn from its color and shape, with a plain purpose underneath, “small yellow oval, for blood sugar,” and the drug name comes second in smaller type. We tried photos first and dropped them: taken in dim kitchens, every pill came out beige."
    },
    {
      title: 'A day you can see at a glance',
      body: "Double doses come from one question: did I already take it? A ring of four times, morning, midday, evening and bedtime, answers it from across the room. Tap any part and it shows which pills that was and when they were taken."
    },
    {
      title: 'Gentle escalation, never an alarm',
      body: "With no answer, Marigold plays a soft chime, says the reminder out loud after 15 minutes, and texts a family member after 45. There are no streaks and no red anywhere. The 45 minutes was set with Dr. Reyes: long enough for a walk to the mailbox, short enough for family to help before the next meal."
    }
  ],
  outcome: {
    summary:
      "We ran a 10-week pilot with 64 Northside participants. On-time doses went from 71% to 88%, and reported double doses went from nine to none. At week 10, 92% were still answering their reminders. With the pill-box alarms, about 40% had kept them on. Caregivers got about 1.3 texts a week, which most of them told us felt *about right*.",
    metrics: [
      {
        value: '71% → 88%',
        label: 'doses taken on time',
        detail: 'Within an hour of the scheduled time. Baseline from nurse pill counts over two weeks; pilot from the app log.'
      },
      {
        value: '9 → 0',
        label: 'reported double doses',
        detail: 'Reported at home visits in the 10 weeks before the pilot and the 10 weeks of it.'
      },
      {
        value: '92%',
        label: 'still using it at week 10',
        detail: 'Answered at least one reminder a day in week 10. About 40% had kept the old alarms on.'
      },
      {
        value: '1.3',
        label: 'caregiver texts a week',
        detail: 'Average per participant across the pilot.'
      }
    ]
  },
  blocks: [
    {
      type: 'demo',
      caption:
        "Ada's morning, live. Answer for her, or tap a time on her ring to see what she takes then. Daniel's card changes the way his phone would."
    },
    {
      type: 'text',
      heading: 'Why the alarms got switched off',
      body: [
        "I spent the first three weeks on home visits with Northside's nurses, mostly in kitchens. Twenty-two people showed me how they take their pills, where they keep them, and what they had done with the alarms.",
        "The alarms weren't failing because people forgot to set them. They failed because they felt like being *scolded* three times a day, in tiny type, by something that couldn't tell whether you had already taken your pills. So the question was never how to be louder. It was how to be worth answering."
      ]
    },
    {
      type: 'beforeAfter',
      before: {
        image: images.oldAlarm,
        alt: 'A typical pill-box alarm app on a dark phone screen: a red ALARM banner over 08:00, three drug names in small capitals with tiny checkboxes, a zero-day streak warning in red, and Snooze and Dismiss buttons.',
        label: 'Before'
      },
      after: {
        image: images.reminder,
        alt: "Marigold's morning reminder on the same phone: “Good morning, Ada,” a small day ring, a card asking “Did you take them?” with drawings of three pills, and large “I took them” and “Not yet” buttons. Notes around the phone point to each decision.",
        label: 'After'
      },
      caption:
        'The same 8:00 am, before and after. The question replaces the alarm, and “I took it” becomes the biggest thing on the screen instead of the smallest.'
    },
    {
      type: 'imagePair',
      images: [
        {
          image: images.pillId,
          alt: 'The “Which one is this?” screen: five pill drawings listed by how they look and what they are for, such as “Small yellow oval, for blood sugar,” with the drug name underneath in smaller type and a button to call the nurse.',
          label: 'Which one is this?'
        },
        {
          image: images.day,
          alt: "Ada's day at 2:15 pm: a large ring in four parts with morning and midday filled, “2 of 4 done today,” and a list below with the time she took each set.",
          label: 'Her day'
        }
      ],
      caption:
        'For a loose pill on the counter, looks and purpose come first. For “did I already take it?”, the ring answers from across the room.'
    },
    {
      type: 'quote',
      text: "It doesn't yell at me. It asks.",
      name: 'Lorraine, 84',
      role: 'Pilot participant'
    },
    {
      type: 'image',
      image: images.setup,
      alt: "The setup page in a browser: adding Atorvastatin 20 mg for Ada by choosing an oval shape and a peach color, typing “for cholesterol,” and picking Evening from four large time chips, with a preview of what Ada will see.",
      caption:
        "Setup happens at a home visit, with the nurse and usually a family member. You hold the pill and pick its shape and color, then write what it's for in the words the person uses.",
      size: 'wide'
    },
    {
      type: 'image',
      image: images.caregiverText,
      alt: "One unanswered evening reminder, step by step: a soft chime at 6:00 pm, a spoken reminder at 6:15, a text to Daniel at 6:45, and Ada's answer at 7:01, next to Daniel's phone showing the text and the follow-up.",
      caption:
        'The escalation in full. Most evenings it stops at the chime. When it does reach Daniel, the text says what it knows and suggests one thing to do.',
      size: 'wide'
    },
    {
      type: 'image',
      image: images.weekly,
      alt: "The family page for Ada's week: a grid of seven days by four times showing when each dose was answered, a few notes worth knowing, the escalation order, and the next home visit.",
      caption:
        'The first family page had a weekly percentage, and two caregivers in testing started calling their parents about it. Now it shows what happened and what is worth knowing, and no score.',
      size: 'wide'
    },
    {
      type: 'metrics',
      items: [
        { value: '22', label: 'home visits before any screens' },
        { value: '64', label: 'pilot participants' },
        { value: '10', label: 'weeks in the pilot' },
        { value: '72–94', label: 'ages, median 81' }
      ],
      caption: 'The research behind it. Every pilot participant had five or more daily medications.'
    }
  ]
});
