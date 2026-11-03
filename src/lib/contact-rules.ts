// Validation and limits for the contact form. Pure functions, shared by the
// server function and the tests.

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  messageMin: 10,
  message: 5000
};

/** At most this many messages from one address within the window. */
export const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  /** The honeypot. People never see it; bots fill it in. */
  website: string;
};

export type ContactField = 'name' | 'email' | 'message';

export type ContactValidation =
  | { ok: true; data: Omit<ContactInput, 'website'> }
  | { ok: false; errors: Partial<Record<ContactField, string>> };

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Accepts anything from the network and returns trimmed, well-formed input or field errors. */
export function validateContact(raw: unknown): ContactValidation {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const text = (key: string) => (typeof input[key] === 'string' ? (input[key] as string) : '');
  const name = text('name').trim().replace(/\s+/g, ' ');
  const email = text('email').trim();
  const message = text('message').trim().replace(/\r\n/g, '\n');
  const errors: Partial<Record<ContactField, string>> = {};

  if (!name) errors.name = 'Please add your name.';
  else if (name.length > CONTACT_LIMITS.name) errors.name = 'That name is a little long. 100 characters at most.';

  if (!email) errors.email = 'Please add an email so I can reply.';
  else if (email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(email))
    errors.email = 'That email doesn’t look quite right.';

  if (message.length < CONTACT_LIMITS.messageMin)
    errors.message = 'Tell me a little more: a sentence or two is plenty.';
  else if (message.length > CONTACT_LIMITS.message)
    errors.message = 'That’s longer than 5,000 characters. Could you trim it?';

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: { name, email, message } };
}

/** True when the hidden field was filled in, which only bots do. */
export function isHoneypotFilled(raw: unknown): boolean {
  const value = raw && typeof raw === 'object' ? (raw as Record<string, unknown>).website : undefined;
  return typeof value === 'string' && value.trim().length > 0;
}

export function isRateLimited(recentCount: number): boolean {
  return recentCount >= RATE_LIMIT.max;
}

const escapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => escapes[char] ?? char);
}

/** The email the owner receives for a new message. */
export function contactEmail(data: { name: string; email: string; message: string }, siteName: string) {
  const subject = `New message from ${data.name}`.slice(0, 200);
  const text = `${data.name} <${data.email}> wrote through ${siteName}:\n\n${data.message}\n\nReply to this email to answer them.`;
  const html = `<p><strong>${escapeHtml(data.name)}</strong> &lt;${escapeHtml(data.email)}&gt; wrote through ${escapeHtml(siteName)}:</p><blockquote style="margin:0;padding-left:12px;border-left:2px solid #d9d2c4;white-space:pre-wrap">${escapeHtml(data.message)}</blockquote><p style="color:#6b665e">Reply to this email to answer them.</p>`;
  return { subject, text, html };
}
