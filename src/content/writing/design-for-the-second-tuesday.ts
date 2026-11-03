import { defineEssay } from '~/content/types';

export default defineEssay({
  slug: 'design-for-the-second-tuesday',
  title: 'Design for the second Tuesday',
  dek: 'Most products are tested on the first day and abandoned on the tenth. What a medication reminder for people in their eighties taught me about the days in between.',
  date: '2025-09-22',
  body: [
    {
      type: 'p',
      text: 'Every usability test I have ever run happened on somebody’s first day with the product. That makes sense. It’s the day you can schedule. But nobody stops using a product on the first day. They stop on a Tuesday two weeks later, when the novelty has gone and the product asks for something at the wrong moment.'
    },
    {
      type: 'p',
      text: 'On Marigold, a medication reminder for older adults, the second Tuesday was the whole brief. Northside Elder Care had handed out pill-box alarms for years. People loved them for about ten days. Then the alarm went off during a phone call with a grandchild, or at the bus stop, and it got switched off for good.'
    },
    { type: 'h2', text: 'The alarm is the problem' },
    {
      type: 'p',
      text: 'Alarms are designed for the first day, when everyone agrees that taking your pills on time matters more than anything. By the second Tuesday, the alarm is a loud stranger who doesn’t know you’re busy. People don’t silence it because they stopped caring about their health. They silence it because it stopped caring about them.'
    },
    {
      type: 'p',
      text: 'So Marigold doesn’t ring. It chimes once, softly, and shows one question: did you take your morning pills? If there’s no answer after fifteen minutes it asks again, out loud, in a calm recorded voice. After forty-five minutes it texts a family member, who can decide whether it’s worth a call. *Nothing escalates past a person.*'
    },
    { type: 'h2', text: 'Remove the scoreboard' },
    {
      type: 'p',
      text: 'Our first prototype had a streak. It tested well on day one, the way streaks do. In week two of the pilot, a participant told her nurse she’d skipped a dose on purpose because she’d already broken her streak that morning and the day felt ruined. We took it out the same afternoon.'
    },
    {
      type: 'p',
      text: 'What replaced it is a ring with four segments, morning to bedtime, that fills as the day goes. It answers the question people actually had, which was never “how am I doing this month” but “did I already take it?” That question is how double doses happen. The ring made them stop: nine reported in the baseline period, none during the pilot.'
    },
    {
      type: 'quote',
      text: 'It doesn’t yell at me. It asks.'
    },
    { type: 'h2', text: 'How to test for Tuesday' },
    {
      type: 'p',
      text: 'You can’t usability-test the second Tuesday in an hour. What you can do is design for it on purpose. I now ask three questions of anything that interrupts someone. What happens when they’re busy? What happens when they’ve already done it? What happens when they ignore it on purpose?'
    },
    {
      type: 'p',
      text: 'If the honest answer to any of them is “it gets louder,” the product will be switched off, no matter how well it tested on day one. The pilot’s number I’m proudest of isn’t the jump in on-time doses. It’s that 92% of people were still using Marigold in week ten.'
    }
  ]
});
