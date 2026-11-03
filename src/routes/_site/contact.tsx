import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { TabBar } from '~/components/site/tab-bar';
import { CONTACT_LIMITS, validateContact } from '~/lib/contact-rules';
import type { ContactField } from '~/lib/contact-rules';
import { submitContact } from '~/lib/contact.functions';
import { site } from '~/lib/site';
import { cn } from '~/lib/utils';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/_site/contact')({
  head: () =>
    seo({
      title: `Contact — ${site.name}`,
      description: `Write to ${portfolio.name} about a project. ${portfolio.availability ? `${portfolio.availability}.` : ''}`.trim(),
      path: '/contact'
    }),
  component: ContactPage
});

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'sent'; name: string }
  | { state: 'error'; message: string };

function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const check = validateContact(values);
    if (!check.ok) {
      setErrors(check.errors);
      focusFirstError(form, check.errors);
      return;
    }
    setErrors({});
    setStatus({ state: 'sending' });
    try {
      const result = await submitContact({ data: values });
      if (result.status === 'sent') {
        setStatus({ state: 'sent', name: check.data.name });
        form.reset();
      } else if (result.status === 'invalid') {
        setErrors(result.errors);
        setStatus({ state: 'idle' });
        focusFirstError(form, result.errors);
      } else if (result.status === 'rate_limited') {
        setStatus({
          state: 'error',
          message: 'That’s a few messages in a short time. Please wait ten minutes and try again.'
        });
      } else {
        setStatus({ state: 'error', message: 'Something went wrong on my side. Please try again in a minute.' });
      }
    } catch {
      setStatus({ state: 'error', message: 'Your message didn’t go through. Check your connection and try again.' });
    }
  };

  const form = (
    <div className='rounded-[1.125rem] bg-surface p-5 sm:rounded-[1.375rem] sm:p-8'>
      {status.state === 'sent' ? (
        <div role='status' className='py-10 text-center sm:py-16'>
          <p className='text-[clamp(1.375rem,2.4vw,1.75rem)] leading-[1.2] font-medium tracking-[-0.03em] text-ink'>
            Thank you, {status.name}.
          </p>
          <p className='mx-auto mt-3 max-w-[26rem] text-ink-muted'>
            Your message is in. I’ll reply to the address you gave within two working days.
          </p>
          <button
            type='button'
            onClick={() => setStatus({ state: 'idle' })}
            className='link mt-7 text-[0.875rem] font-medium text-ink'
          >
            Send another message
          </button>
        </div>
      ) : (
        <form ref={formRef} noValidate onSubmit={onSubmit} className='grid gap-6'>
          <Field id='name' label='Name' error={errors.name}>
            <input
              id='name'
              name='name'
              type='text'
              autoComplete='name'
              maxLength={CONTACT_LIMITS.name}
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={inputClass(errors.name)}
            />
          </Field>
          <Field id='email' label='Email' error={errors.email}>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              maxLength={CONTACT_LIMITS.email}
              required
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={inputClass(errors.email)}
            />
          </Field>
          <Field id='message' label='Message' hint='What are you making, and what makes it hard?' error={errors.message}>
            <textarea
              id='message'
              name='message'
              rows={7}
              maxLength={CONTACT_LIMITS.message}
              required
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? 'message-hint message-error' : 'message-hint'}
              className={cn(inputClass(errors.message), 'min-h-[10rem] resize-y leading-[1.55]')}
            />
          </Field>
          {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
          <div aria-hidden className='absolute -left-[9999px] h-px w-px overflow-hidden'>
            <label htmlFor='website'>Leave this field empty</label>
            <input id='website' name='website' type='text' tabIndex={-1} autoComplete='off' defaultValue='' />
          </div>
          <div className='flex flex-wrap items-center gap-x-5 gap-y-3'>
            <button
              type='submit'
              disabled={status.state === 'sending'}
              className='inline-flex min-w-[9rem] items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.875rem] font-medium text-paper transition-opacity disabled:opacity-60'
            >
              {status.state === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            <p className='text-[0.8125rem] text-ink-muted'>Saved privately. Never shared.</p>
          </div>
          <p role='alert' className={cn('text-[0.875rem] text-[#B42318]', status.state !== 'error' && 'sr-only')}>
            {status.state === 'error' ? status.message : ''}
          </p>
        </form>
      )}
    </div>
  );

  return (
    <>
      <TabBar mode='nav' />
      <main id='main' className='page pt-14 sm:pt-20'>
        {/* Phones read intro, form, then links; wider screens put the links beside the form. */}
        <div className='grid gap-10 md:grid-cols-12 md:gap-x-10 md:gap-y-0'>
          <div className='md:col-span-5'>
            <h1 className='text-[clamp(1.875rem,3.6vw,2.625rem)] leading-[1.1] font-medium tracking-[-0.035em] text-ink'>Say hello.</h1>
            <p className='mt-4 max-w-[26rem] text-[1rem] leading-[1.6] text-ink-muted'>
              Tell me what you’re making and what makes it hard. I reply to every message within two working
              days.{portfolio.availability ? ` ${portfolio.availability}.` : ''}
            </p>
          </div>

          <div className='md:col-span-6 md:col-start-7 md:row-span-2 md:row-start-1'>
            {form}
          </div>

          <div className='md:col-span-5 md:col-start-1'>
            <h2 className='font-mono text-[0.75rem] text-ink-muted md:mt-12'>Elsewhere</h2>
            <ul className='mt-3 border-t border-rule'>
              {portfolio.socials.map((social) => (
                <li key={social.label} className='border-b border-rule'>
                  <a
                    href={social.href}
                    target='_blank'
                    rel='me noopener'
                    className='group flex items-center justify-between py-3 text-ink'
                  >
                    {social.label}
                    <span aria-hidden className='text-ink-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'>
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>
    </>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className='grid gap-2'>
      <label htmlFor={id} className='text-[0.875rem] font-medium text-ink'>
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className='-mt-1 text-[0.8125rem] text-ink-muted'>
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className='text-[0.8125rem] font-medium text-[#B42318]'>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(error?: string) {
  return cn(
    'w-full rounded-[0.625rem] border bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink shadow-[0_1px_2px_rgba(17,17,17,0.04)] transition-colors placeholder:text-ink-muted',
    'focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent/30',
    error ? 'border-[#B42318]' : 'border-ink/12 hover:border-ink/25'
  );
}

function focusFirstError(form: HTMLFormElement, errors: Partial<Record<ContactField, string>>) {
  const first = (['name', 'email', 'message'] as const).find((field) => errors[field]);
  if (first) form.querySelector<HTMLElement>(`#${first}`)?.focus();
}
