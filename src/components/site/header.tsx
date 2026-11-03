import { Link } from '@tanstack/react-router';
import { portfolio } from '~/portfolio.config';

export function SiteHeader() {
  return (
    <header className='page flex h-14 items-center justify-between gap-4 text-[0.875rem] sm:h-16'>
      <Link to='/' className='-mx-2 rounded-md px-2 py-1 font-medium tracking-[-0.01em] text-ink'>
        {portfolio.name}
      </Link>
      <div className='flex items-center gap-4'>
        {portfolio.availability ? (
          <span className='hidden items-center gap-2 text-ink-muted sm:inline-flex'>
            <span aria-hidden className='size-1.5 rounded-full bg-[#1F9D55]' />
            {portfolio.availability}
          </span>
        ) : null}
        <Link
          to='/contact'
          className='rounded-full bg-ink px-3.5 py-1.5 font-medium text-paper transition-opacity duration-200 hover:opacity-85'
          activeProps={{ 'aria-current': 'page' }}
        >
          Contact
        </Link>
      </div>
    </header>
  );
}
