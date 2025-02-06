import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { WorkspacesModel } from "./workspaces.model";
import { UsersModel } from "../users_model/users.model";

export const ChannelsModel = pgTable(
  "channels",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    workspaceId: uuid("workspace_id")
      .references(() => WorkspacesModel.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: uuid("created_by").references(() => UsersModel.id, {
      onDelete: "set null",
    }),
    isPrivate: boolean("is_private").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    deleteAt: timestamp("delete_at"),
  },
  (table) => ({
    workspaceIdx: index("workspace_idx").on(table.workspaceId),
  })
);
