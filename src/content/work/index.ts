import type { Project } from '~/content/types';

// Every `src/content/work/<slug>.ts` file is a case study. Adding a file adds
// the project to the work wall, its page, and the sitemap.
const modules = import.meta.glob<{ default: Project }>(
  ['./*.ts', '!./index.ts', '!./*.test.ts'],
  { eager: true }
);

export const projects: Project[] = Object.values(modules)
  .map((module) => module.default)
  .filter(Boolean)
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** The project after this one on the wall, wrapping to the first. */
export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1 || projects.length < 2) return undefined;
  return projects[(index + 1) % projects.length];
}
