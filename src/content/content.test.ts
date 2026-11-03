import { describe, expect, it } from 'vitest';
import type { Block, ImageAsset } from '~/content/types';
import { essays, readingMinutes } from '~/content/writing';
import { getNextProject, projects } from '~/content/work';

const workFiles = Object.keys(import.meta.glob(['./work/*.ts', '!./work/index.ts', '!./work/*.test.ts']));
const essayFiles = Object.keys(import.meta.glob(['./writing/*.ts', '!./writing/index.ts', '!./writing/*.test.ts']));

function imagesIn(block: Block): { image: ImageAsset; alt: string }[] {
  switch (block.type) {
    case 'image':
      return [{ image: block.image, alt: block.alt }];
    case 'imagePair':
      return block.images;
    case 'beforeAfter':
      return [block.before, block.after];
    case 'video':
      return [{ image: block.poster, alt: block.alt }];
    default:
      return [];
  }
}

describe('case studies', () => {
  it('has one project per file, named after its slug', () => {
    expect(projects.length).toBe(workFiles.length);
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const project of projects) {
      expect(workFiles).toContain(`./work/${project.slug}.ts`);
      expect(project.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it.each(projects.map((project) => [project.slug, project] as const))(
    '%s has the full story',
    (_, project) => {
      expect(project.title).toBeTruthy();
      expect(project.summary).toBeTruthy();
      expect(project.client).toBeTruthy();
      expect(project.year).toMatch(/^\d{4}/);
      expect(project.role).toBeTruthy();
      expect(project.team.length).toBeGreaterThan(0);
      expect(project.problem.brief.length).toBeGreaterThan(80);
      expect(project.problem.constraint.length).toBeGreaterThan(80);
      expect(project.decisions.length).toBeGreaterThanOrEqual(2);
      expect(project.outcome.summary).toBeTruthy();
      expect(project.cover.alt.length).toBeGreaterThan(20);
      expect(project.cover.image.og, 'cover needs a link-preview JPG').toBeTruthy();
      expect(project.theme.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  );

  it.each(projects.map((project) => [project.slug, project] as const))(
    '%s shows at least 5 distinct screens, each with alt text',
    (_, project) => {
      const figures = project.blocks.flatMap(imagesIn);
      const distinct = new Set([project.cover.image, ...figures.map((figure) => figure.image)].map((image) => image.sources[0]?.src));
      expect(distinct.size).toBeGreaterThanOrEqual(5);
      for (const figure of figures) {
        expect(figure.alt.trim().length, 'every image needs alt text').toBeGreaterThan(10);
        expect(figure.image.width).toBeGreaterThan(0);
        expect(figure.image.height).toBeGreaterThan(0);
        expect(figure.image.blur).toMatch(/^data:image\//);
      }
    }
  );

  it('only uses a demo block when the project has a live demo', () => {
    for (const project of projects) {
      if (project.blocks.some((block) => block.type === 'demo')) {
        expect(project.preview.type).toBe('demo');
      }
    }
  });

  it('never leaves lorem ipsum in the copy', () => {
    expect(JSON.stringify(projects).toLowerCase()).not.toContain('lorem');
  });

  it('links each project to the next, wrapping around', () => {
    const first = projects[0]!;
    const last = projects[projects.length - 1]!;
    expect(getNextProject(last.slug)?.slug).toBe(first.slug);
    expect(getNextProject('not-a-project')).toBeUndefined();
  });
});

describe('writing', () => {
  it('has the essays from the folder, newest first', () => {
    expect(essays.length).toBe(essayFiles.length);
    expect(essays.length).toBeGreaterThanOrEqual(3);
    const dates = essays.map((essay) => essay.date);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
    for (const essay of essays) {
      expect(essayFiles).toContain(`./writing/${essay.slug}.ts`);
      expect(essay.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(readingMinutes(essay)).toBeGreaterThan(0);
    }
  });
});
