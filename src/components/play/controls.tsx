import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '~/lib/utils';

/** A card on the play wall: number, title, a line on why, then the toy. */
export function Experiment({
  number,
  title,
  note,
  children,
  className
}: {
  number: number;
  title: string;
  note: string;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <article
      aria-labelledby={id}
      className={cn(
        'mb-3 break-inside-avoid rounded-[1.125rem] bg-white p-4 shadow-[var(--edge)] sm:p-5',
        className
      )}
    >
      <header className='mb-4'>
        <p className='font-mono text-[0.6875rem] text-ink-muted'>{String(number).padStart(2, '0')}</p>
        <h3 id={id} className='mt-1 text-[0.9375rem] font-medium tracking-[-0.015em] text-ink'>
          {title}
        </h3>
        <p className='mt-0.5 text-[0.8125rem] leading-[1.5] text-ink-muted'>{note}</p>
      </header>
      {children}
    </article>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v) => String(v)
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}) {
  const id = useId();
  return (
    <div className='grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5'>
      <label htmlFor={id} className='text-[0.8125rem] text-ink-muted'>
        {label}
      </label>
      <output htmlFor={id} className='font-mono text-[0.75rem] font-medium text-ink'>
        {format(value)}
      </output>
      <input
        id={id}
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className='play-range col-span-2'
      />
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className='sr-only'>{label}</legend>
      <div className='inline-flex rounded-full bg-surface p-[3px] shadow-[inset_0_0_0_1px_rgba(17,17,17,0.05)]'>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'relative cursor-pointer rounded-full px-3 py-1 text-[0.8125rem] font-medium transition-[color,background-color,box-shadow] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
              option.value === value
                ? 'bg-white text-ink shadow-[0_0_0_1px_rgba(17,17,17,0.06),0_1px_2px_rgba(17,17,17,0.1)]'
                : 'text-ink-muted hover:text-ink'
            )}
          >
            <input
              type='radio'
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className='sr-only'
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
