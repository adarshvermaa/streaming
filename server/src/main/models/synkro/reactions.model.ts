import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    primaryKey,
    index
  } from 'drizzle-orm/pg-core';
  import { sql } from 'drizzle-orm';
  import { UsersModel } from '../users_model/users.model';
  import { MessagesModel } from './messages.model';
  
  export const reactions = pgTable('reactions', {
    id: uuid('id').default(sql`gen_random_uuid()`),
    emoji: varchar('emoji', { length: 100 }).notNull(), // Increased length for custom emojis
    messageId: uuid('message_id')
      .references(() => MessagesModel.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => UsersModel.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    // Optional: Add if you need to track reaction updates
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
  }, (table) => ({
    // Composite primary key to prevent duplicate reactions
    compositePk: primaryKey({
      columns: [table.messageId, table.userId, table.emoji],
      name: 'reactions_pkey'
    }),
    // Indexes for common query patterns
    messageIdx: index('reaction_message_idx').on(table.messageId),
    userIdx: index('reaction_user_idx').on(table.userId),
    emojiIdx: index('reaction_emoji_idx').on(table.emoji)
  }));