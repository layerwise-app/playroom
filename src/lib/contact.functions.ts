import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader, getRequestIP } from '@tanstack/react-start/server';
import { env } from 'cloudflare:workers';
import { and, count, eq, gt } from 'drizzle-orm';
import { db } from '~/db';
import { contactMessages } from '~/db/schema';
import {
  RATE_LIMIT,
  contactEmail,
  isHoneypotFilled,
  isRateLimited,
  validateContact
} from '~/lib/contact-rules';
import type { ContactField } from '~/lib/contact-rules';
import { portfolio } from '~/portfolio.config';

export type ContactResult =
  | { status: 'sent' }
  | { status: 'invalid'; errors: Partial<Record<ContactField, string>> }
  | { status: 'rate_limited' }
  | { status: 'error' };

// A fixed salt keeps the stored hash from matching a plain hash of the address.
const IP_SALT = 'playroom-contact-v1';

async function hashIp(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${IP_SALT}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Saves a contact form message, then emails it to `ownerEmail` when one is set.
 * Validation, the honeypot, and the rate limit all run here on the server.
 */
export const submitContact = createServerFn({ method: 'POST' })
  .validator((input: Record<string, string>) => input)
  .handler(async ({ data }): Promise<ContactResult> => {
    // Bots that fill the hidden field get the same reply as people, and nothing is saved.
    if (isHoneypotFilled(data)) return { status: 'sent' };

    const result = validateContact(data);
    if (!result.ok) return { status: 'invalid', errors: result.errors };

    const ip =
      getRequestHeader('cf-connecting-ip') ?? getRequestIP({ xForwardedFor: true }) ?? 'unknown';
    const ipHash = await hashIp(ip);
    const since = new Date(Date.now() - RATE_LIMIT.windowMs);
    const [recent] = await db
      .select({ value: count() })
      .from(contactMessages)
      .where(and(eq(contactMessages.ipHash, ipHash), gt(contactMessages.createdAt, since)));
    if (isRateLimited(recent?.value ?? 0)) return { status: 'rate_limited' };

    let id: string;
    try {
      const [row] = await db
        .insert(contactMessages)
        .values({ ...result.data, ipHash })
        .returning({ id: contactMessages.id });
      id = row.id;
    } catch (error) {
      console.error('[contact] could not save message', error);
      return { status: 'error' };
    }

    // The message is saved; a failed email never fails the visitor's send.
    if (portfolio.ownerEmail) {
      const email = contactEmail(result.data, portfolio.name);
      const { error } = await env.EMAIL.send({
        to: portfolio.ownerEmail,
        replyTo: result.data.email,
        ...email
      });
      if (error) console.warn(`[contact] email for ${id}: ${error.code} ${error.message}`);
      await db
        .update(contactMessages)
        .set({ emailStatus: error ? error.code : 'sent' })
        .where(eq(contactMessages.id, id));
    }

    return { status: 'sent' };
  });
