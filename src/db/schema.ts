import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// The site is public and has no accounts. Its only table holds messages sent
// through the contact form. Add tables below, then run
// `pnpm run db:generate --name <what_changed>` and `pnpm run db:migrate`.

export const contactMessages = sqliteTable(
  'contact_messages',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    // SHA-256 of the sender's IP address with a fixed salt. Used only for the
    // rate limit; the address itself is never stored.
    ipHash: text('ip_hash').notNull(),
    // `sent`, `skipped` (no ownerEmail set), or an `env.EMAIL` error code.
    emailStatus: text('email_status').notNull().default('skipped'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
  },
  (table) => [
    index('contact_messages_ip_created_idx').on(table.ipHash, table.createdAt)
  ]
);
