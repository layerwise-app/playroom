import type { Essay } from '~/content/types';

// Every `src/content/writing/<slug>.ts` file is an essay, newest first.
const modules = import.meta.glob<{ default: Essay }>(
  ['./*.ts', '!./index.ts', '!./*.test.ts'],
  { eager: true }
);

export const essays: Essay[] = Object.values(modules)
  .map((module) => module.default)
  .filter(Boolean)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getEssay(slug: string): Essay | undefined {
  return essays.find((essay) => essay.slug === slug);
}

/** Rough reading time at 230 words a minute. */
export function readingMinutes(essay: Essay): number {
  const words = essay.body
    .map((block) => block.text)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
