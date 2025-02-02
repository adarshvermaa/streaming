import {
    pgTable,
    uuid,
    timestamp,
    primaryKey,
    pgEnum,
    text,
    index
  } from 'drizzle-orm/pg-core';
  import { UsersModel } from '../users_model/users.model';
  import { WorkspacesModel } from './workspaces.model';
  import { sql } from 'drizzle-orm';
  
  // Enum for member roles
  export const workspaceMemberRoleEnum = pgEnum('workspace_member_role', [
    'admin',
    'member',
    'guest'
  ]);
  
  // Enum for invitation status
  export const invitationStatusEnum = pgEnum('invitation_status', [
    'pending',
    'accepted',
    'rejected'
  ]);
  
  export const WorkspaceMembersModel = pgTable(
    'workspace_members',
    {
      workspaceId: uuid('workspace_id')
        .references(() => WorkspacesModel.id, { onDelete: 'cascade' })
        .notNull(),
        
      userId: uuid('user_id')
        .references(() => UsersModel.id, { onDelete: 'cascade' })
        .notNull(),
      
      // Role-based access control
      role: workspaceMemberRoleEnum('role').default('member').notNull(),
      
      // Invitation tracking
      invitationStatus: invitationStatusEnum('invitation_status').default('pending').notNull(),
      invitedBy: uuid('invited_by')
        .references(() => UsersModel.id, { onDelete: 'set null' }),
      invitedAt: timestamp('invited_at').defaultNow().notNull(),
      
      // Membership timestamps
      joinedAt: timestamp('joined_at'),
      lastActiveAt: timestamp('last_active_at'),
      
      // Standard timestamps
      createdAt: timestamp('created_at').defaultNow().notNull(),
      updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
      deletedAt: timestamp('deleted_at'),
      
      // Additional metadata
      permissions: text('permissions').array(), // Optional: Store specific permissions
      notes: text('notes')
    },
    (table) => ({
      pk: primaryKey({ columns: [table.workspaceId, table.userId] }),
      userIdIdx: index('workspace_member_user_id_idx').on(table.userId),
      workspaceIdIdx: index('workspace_member_workspace_id_idx').on(table.workspaceId),
      invitationStatusIdx: index('invitation_status_idx').on(table.invitationStatus)
    })
  );