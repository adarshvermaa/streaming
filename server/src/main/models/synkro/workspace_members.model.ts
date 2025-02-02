import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    primaryKey,
} from 'drizzle-orm/pg-core';
import { UsersModel } from '../users_model/users.model';
import { WorkspacesModel } from './workspaces.model';

export const WorkspaceMembersModel = pgTable(
    'workspace_members',
    {
        workspaceId: uuid('workspace_id').references(() => WorkspacesModel.id, { onDelete: 'cascade' }).notNull(),
        userId: uuid('user_id').references(() => UsersModel.id, { onDelete: 'cascade' }).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow(),
        deletedAt: timestamp('deleted_at'),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.workspaceId, table.userId] }),
    })
);