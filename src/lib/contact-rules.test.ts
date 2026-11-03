import { describe, expect, it } from 'vitest';
import {
  RATE_LIMIT,
  contactEmail,
  escapeHtml,
  isHoneypotFilled,
  isRateLimited,
  validateContact
} from '~/lib/contact-rules';

const valid = {
  name: '  Dolores   Vance ',
  email: 'dolores@example.org',
  message: 'We run a tool library and need a calmer booking flow.',
  website: ''
};

describe('validateContact', () => {
  it('accepts a good message and tidies whitespace', () => {
    const result = validateContact(valid);
    expect(result).toEqual({
      ok: true,
      data: {
        name: 'Dolores Vance',
        email: 'dolores@example.org',
        message: 'We run a tool library and need a calmer booking flow.'
      }
    });
  });

  it('reports every bad field', () => {
    const result = validateContact({ name: '', email: 'not-an-email', message: 'hi' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name']);
  });

  it('rejects over-long fields', () => {
    const result = validateContact({ ...valid, name: 'x'.repeat(101), message: 'y'.repeat(5001) });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.message).toBeTruthy();
  });

  it('treats non-strings and missing input as empty', () => {
    expect(validateContact(null).ok).toBe(false);
    expect(validateContact({ name: 42, email: [], message: {} }).ok).toBe(false);
  });
});

describe('honeypot and rate limit', () => {
  it('flags a filled honeypot only', () => {
    expect(isHoneypotFilled(valid)).toBe(false);
    expect(isHoneypotFilled({ ...valid, website: 'https://spam.example' })).toBe(true);
    expect(isHoneypotFilled({ ...valid, website: '   ' })).toBe(false);
  });

  it(`allows ${RATE_LIMIT.max} messages per window, then blocks`, () => {
    expect(isRateLimited(RATE_LIMIT.max - 1)).toBe(false);
    expect(isRateLimited(RATE_LIMIT.max)).toBe(true);
  });
});

describe('contactEmail', () => {
  it('escapes everything the visitor typed in the HTML version', () => {
    const email = contactEmail(
      { name: '<b>Eve</b>', email: 'eve@example.org', message: 'Hi <script>alert(1)</script> & bye' },
      'Mina Okafor'
    );
    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;');
    expect(email.text).toContain('<script>');
    expect(email.subject).toBe('New message from <b>Eve</b>');
  });

  it('escapes quotes and ampersands', () => {
    expect(escapeHtml(`"Tom" & 'Jerry'`)).toBe('&quot;Tom&quot; &amp; &#39;Jerry&#39;');
  });
});
