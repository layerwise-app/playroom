import { Link, createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { ExperienceList } from '~/components/about/experience-list';
import { RichText } from '~/components/rich-text';
import { about } from '~/content/about';
import { personJsonLd, site, siteUrl } from '~/lib/site';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/_site/_tabs/about')({
  head: () =>
    seo({
      title: `About — ${site.name}`,
      description: `${portfolio.name} is a ${portfolio.role.toLowerCase()} in ${portfolio.location}: services, experience, selected clients, and a CV to download.`,
      path: '/about',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: siteUrl('/about'),
        mainEntity: personJsonLd()
      }
    }),
  component: AboutPage
});

function AboutPage() {
  return (
    <div className='page pt-14 sm:pt-20'>
      <section aria-labelledby='about-heading' className='grid gap-8 md:grid-cols-12 md:gap-10'>
        <h2
          id='about-heading'
          className='max-w-[30rem] text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.22] font-medium tracking-[-0.03em] text-ink md:col-span-6'
        >
          <RichText text={about.heading} />
        </h2>
        <div className='space-y-4 text-[1rem] leading-[1.65] text-ink-soft md:col-span-5 md:col-start-8 md:pt-1'>
          {portfolio.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>
              <RichText text={paragraph} />
            </p>
          ))}
          <div className='flex flex-wrap items-center gap-x-5 gap-y-3 pt-3'>
            {portfolio.cv ? (
              <a
                href={portfolio.cv}
                download
                className='group inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[0.875rem] font-medium text-paper'
              >
                Download CV
                <span className='font-mono text-[0.75rem] text-paper/70'>PDF</span>
                <span aria-hidden className='transition-transform duration-300 group-hover:translate-y-0.5'>
                  ↓
                </span>
              </a>
            ) : null}
            <Link to='/contact' className='link text-[0.875rem] font-medium text-ink'>
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <AboutSection id='services' title='What I do'>
        <ul className='grid gap-x-10 border-t border-rule sm:grid-cols-2'>
          {about.services.map((service, index) => (
            <li key={service.title} className='grid grid-cols-[2rem_1fr] gap-x-3 border-b border-rule py-5'>
              <span className='pt-0.5 font-mono text-[0.75rem] text-ink-muted'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h4 className='font-medium text-ink'>{service.title}</h4>
                <p className='mt-1 text-ink-muted'>{service.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </AboutSection>

      <AboutSection id='experience' title='Experience'>
        <ExperienceList roles={about.experience} />
      </AboutSection>

      <AboutSection id='clients' title='Selected clients'>
        <ul className='columns-1 gap-10 border-t border-rule pt-4 text-ink sm:columns-2'>
          {about.clients.map((client) => (
            <li key={client} className='break-inside-avoid py-1.5'>
              {client}
            </li>
          ))}
        </ul>
      </AboutSection>
    </div>
  );
}

function AboutSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-heading`} className='mt-20 grid gap-5 md:mt-24 md:grid-cols-12 md:gap-10'>
      <h3
        id={`${id}-heading`}
        className='font-mono text-[0.75rem] text-ink-muted md:col-span-3 md:pt-4'
      >
        {title}
      </h3>
      <div className='md:col-span-9'>{children}</div>
    </section>
  );
}
