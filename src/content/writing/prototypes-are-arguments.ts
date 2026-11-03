import { defineEssay } from '~/content/types';

export default defineEssay({
  slug: 'prototypes-are-arguments',
  title: 'Prototypes are arguments',
  dek: 'Why I build working prototypes for internal tools, and why the point is never the code. On fidelity, persuasion, and a scheduling grid that settled a three-week debate in an afternoon.',
  date: '2025-05-06',
  body: [
    {
      type: 'p',
      text: 'People sometimes ask why a designer bothers writing code. The honest answer is that I’m not very interested in the code. I’m interested in winning arguments that a static mockup can’t win, and in losing the ones I should lose, quickly.'
    },
    {
      type: 'p',
      text: 'A mockup is a claim: this is what it will look like. A working prototype is a different kind of claim: this is how it will behave when you do the thing you actually do. Those settle different disagreements, and most of the disagreements worth having are about behavior.'
    },
    { type: 'h2', text: 'The three-week argument' },
    {
      type: 'p',
      text: 'At Fernwood, the arts school whose scheduling tool became Sundial, the team argued for weeks about automatic rescheduling. The coordinators were sure a solver would shuffle classes behind their backs. The engineer was sure that without one, the tool would just be a nicer spreadsheet. Both were right about the mockups, because a mockup of a solver is a before and an after with a magic arrow in between.'
    },
    {
      type: 'p',
      text: 'So I built the arrow. A week grid in React, real classes from the spring term, and a small solver that moved conflicting classes to the nearest free slot. The one design decision that mattered was that moved classes glide from their old place to the new one instead of simply appearing there. You can see what moved, and you can drag it back.'
    },
    {
      type: 'p',
      text: 'Ines, the program coordinator, tried it for about four minutes. Then she pinned the two classes she would never let anyone move, dragged a third into a conflict on purpose, and watched the solver route around her pins. *The argument was over before the meeting started.* We shipped pins instead of a constraints settings page, and nobody has asked for the settings page since.'
    },
    { type: 'h2', text: 'Fidelity is a rhetorical choice' },
    {
      type: 'p',
      text: 'The trap is thinking more fidelity is always better. It isn’t. A polished prototype invites comments about polish. If I want feedback on whether a flow makes sense, I keep the visual design deliberately plain and make the behavior deliberately real: real data, real edge cases, a real slow network if that’s the risk.'
    },
    {
      type: 'quote',
      text: 'Make the part you’re arguing about real. Leave everything else obviously unfinished.'
    },
    {
      type: 'p',
      text: 'The inverse is true too. When the argument is about whether something feels calm, or trustworthy, or worth paying for, the visual details are the argument, and a rough prototype will lose it unfairly.'
    },
    { type: 'h2', text: 'Throw it away on purpose' },
    {
      type: 'p',
      text: 'I tell every team on day one that the prototype will be thrown away. Saying it out loud matters. It lets the engineers ignore my component structure, and it stops me defending decisions because I already typed them. The prototype’s job is to make one decision obvious. Once it has done that, it has earned its retirement.'
    },
    {
      type: 'p',
      text: 'Sundial’s production grid shares almost no code with my prototype. It does share the glide, the pins, and the sentence the status bar shows when it moves something. Those were the arguments. The code was just how I made them.'
    }
  ]
});
