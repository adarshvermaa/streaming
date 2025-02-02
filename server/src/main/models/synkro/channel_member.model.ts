import {
    pgTable,
    uuid,
    timestamp,
    primaryKey,
} from 'drizzle-orm/pg-core';
import { ChannelsModel } from './channel.model';
import { UsersModel } from '../users_model/users.model';


// Channel Members Table (Many-to-Many relationship between users and channels)
export const channelMembers = pgTable(
    'channel_members',
    {
        channelId: uuid('channel_id').references(() => ChannelsModel.id, { onDelete: 'cascade' }).notNull(),
        userId: uuid('user_id').references(() => UsersModel.id, { onDelete: 'cascade' }).notNull(),
        joinedAt: timestamp('joined_at').defaultNow().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.channelId, table.userId] }),
    })
);
