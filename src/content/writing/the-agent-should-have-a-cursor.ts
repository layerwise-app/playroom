import { defineEssay } from '~/content/types';

export default defineEssay({
  slug: 'the-agent-should-have-a-cursor',
  title: 'The agent should have a cursor',
  dek: 'When software starts acting on your behalf, the most useful thing it can do is let you watch. Notes from designing a drafting agent for small nonprofits.',
  date: '2026-02-10',
  body: [
    {
      type: 'p',
      text: 'The first prototype of the Openhand agent was a chat panel. You typed a sentence about your campaign, the panel replied with a cheerful summary, and the page beside it changed. In testing, people would read the reply, look at the page, look back at the reply, and ask: what did it do?'
    },
    {
      type: 'p',
      text: 'The page had changed in six places at once. The chat told them so, in a paragraph. Nobody could hold the paragraph and the page in their head at the same time, so they did the reasonable thing and stopped trusting both.'
    },
    { type: 'h2', text: 'Work where the work is' },
    {
      type: 'p',
      text: 'We moved the agent onto the canvas. It got a cursor with a name tag, the same kind a colleague has in a shared document. It picks a block from the rail, drags it into place, and fills it while you watch. It is slower. A full draft takes about forty seconds instead of four. People preferred it by a margin that made the decision for us.'
    },
    {
      type: 'p',
      text: 'Watching is not a gimmick. It is how we already supervise each other. When a new volunteer helps you set up a table, you don’t ask for a written report afterwards; you glance over while they do it, and you step in when the banner is upside down. A cursor gives software that same glanceable shape. *You can see the work before you have to read about it.*'
    },
    { type: 'h2', text: 'Interruptible, not just undoable' },
    {
      type: 'p',
      text: 'Undo is the usual answer to “what if the AI gets it wrong.” Undo is fine, but it puts the person after the mistake. We wanted them before it. So the agent yields the moment your pointer enters the canvas. Its cursor stops, its tag says “Paused, your turn,” and whatever it was about to do waits until you move away or ask it to finish.'
    },
    {
      type: 'p',
      text: 'That one rule changed how people talked about it. In the chat version, testers described the agent as something that happened to their page. With the cursor, they described it as someone who was helping, and occasionally as someone who needed supervising, which is exactly right.'
    },
    {
      type: 'quote',
      text: 'The best thing an agent can do for trust is be boring to watch.'
    },
    { type: 'h2', text: 'What a cursor can’t fix' },
    {
      type: 'p',
      text: 'A visible agent still needs rules about what it may touch. Ours never invents a number. If the brief says the goal is $18,000, the goal block says so and carries a small tag: from your brief. If the brief has no number, the field stays empty and says it won’t guess. Watching the agent type a made-up figure would not have made it acceptable.'
    },
    {
      type: 'p',
      text: 'And it only uses the blocks a person could use. No generated layouts, no clever markup. Everything the agent makes, you could have made yourself in the same editor, which means everything it makes, you can change.'
    },
    {
      type: 'p',
      text: 'I don’t think every agent needs a literal arrow. But I think every agent needs a place where its work is visible while it happens, and a way to be stopped without ceremony. Start there, and the rest of the interface gets much easier to design.'
    }
  ]
});
