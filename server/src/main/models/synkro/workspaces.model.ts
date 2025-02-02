import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { UsersModel } from '../users_model/users.model';

export const WorkspacesModel = pgTable('workspaces', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    name: varchar('name', { length: 255 }),
    description: text('description'),
    createdBy: uuid('created_by').references(() =>
        UsersModel.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
});