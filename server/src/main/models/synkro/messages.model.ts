import {
    pgTable,
    uuid,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { UsersModel } from '../users_model/users.model';
import { ChannelsModel } from './channel.model';

// Messages Table
export const MessagesModel = pgTable('messages', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    content: text('content').notNull(),
    channelId: uuid('channel_id').references(() => ChannelsModel.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => UsersModel.id, { onDelete: 'set null' }),
    threadId: uuid('thread_id').references(() => MessagesModel.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
});