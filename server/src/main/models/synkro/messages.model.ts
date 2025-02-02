import {
    pgTable,
    uuid,
    text,
    timestamp,
    index,
    boolean
  } from 'drizzle-orm/pg-core';
  import { sql } from 'drizzle-orm';
  import { UsersModel } from '../users_model/users.model';
  import { ChannelsModel } from './channel.model';
  
  export const MessagesModel = pgTable('messages', {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    content: text('content').notNull(),
    channelId: uuid('channel_id')
      .references(() => ChannelsModel.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => UsersModel.id, { onDelete: 'set null' }),
    threadId: uuid('thread_id')
      .references(() => MessagesModel.id, { onDelete: 'cascade' }),
    isEdited: boolean('is_edited').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
  }, (table) => ({
    channelIdx: index('message_channel_idx').on(table.channelId),
    userIdx: index('message_user_idx').on(table.userId),
    threadIdx: index('message_thread_idx').on(table.threadId),
  }));