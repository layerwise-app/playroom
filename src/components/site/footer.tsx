import { Link, useLocation } from '@tanstack/react-router';
import { portfolio } from '~/portfolio.config';

export function SiteFooter() {
  // The contact page already shows the form and the social links, so its
  // footer is just the meta line.
  const onContact = useLocation({ select: (location) => location.pathname === '/contact' });
  const meta = (
    <div className='flex flex-wrap items-center justify-between gap-x-6 gap-y-4'>
      <p className='flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.75rem] text-ink-muted'>
        <span>
          {portfolio.name} · {portfolio.location}
        </span>
        <span>{portfolio.role}</span>
      </p>
      <a href='https://layerwise.app' target='_blank' rel='noopener' className='inline-flex shrink-0 rounded-md'>
        <img
          src='https://layerwise.app/powered-by.png'
          alt='Powered by Layerwise'
          width={174}
          height={28}
          loading='lazy'
          className='block h-7 w-[174px]'
        />
      </a>
    </div>
  );

  if (onContact) {
    return (
      <footer className='page mt-24 pb-8 sm:mt-32'>
        <div className='border-t border-rule pt-6'>{meta}</div>
      </footer>
    );
  }

  return (
    <footer className='page mt-24 pb-6 sm:mt-32'>
      <div className='rounded-[1.25rem] bg-surface p-6 sm:p-10'>
        <div className='grid gap-10 md:grid-cols-[1fr_auto] md:items-end'>
          <div>
            <p className='max-w-[28rem] text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.3] font-medium tracking-[-0.025em] text-ink'>
              Have a gentle, hard problem? <span className='text-ink-muted'>I’d like to hear it.</span>
            </p>
            <Link
              to='/contact'
              className='group mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[0.875rem] font-medium text-paper'
            >
              Write to me
              <span aria-hidden className='transition-transform duration-300 group-hover:translate-x-0.5'>
                →
              </span>
            </Link>
          </div>
          <nav aria-label='Elsewhere'>
            <ul className='flex flex-wrap gap-x-5 gap-y-2 text-[0.875rem] text-ink-soft'>
              {portfolio.socials.map((social) => (
                <li key={social.label}>
                  <a className='link' href={social.href} rel='me noopener' target='_blank'>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className='mt-10 border-t border-ink/10 pt-5 sm:mt-14'>{meta}</div>
      </div>
    </footer>
  );
}
