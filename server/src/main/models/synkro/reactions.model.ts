import {
    pgTable,
    uuid,
    varchar,
    timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { UsersModel } from '../users_model/users.model';
import { MessagesModel } from './messages.model';

export const reactions = pgTable('reactions', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    emoji: varchar('emoji', { length: 50 }).notNull(),
    messageId: uuid('message_id').references(() => MessagesModel.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => UsersModel.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
