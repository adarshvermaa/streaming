import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  index,
  pgEnum,
  bigint,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { UsersModel } from "../users_model/users.model";

// Enum for workspace status
export const workspaceStatusEnum = pgEnum("workspace_status", [
  "active",
  "archived",
  "suspended",
  "deleted",
]);

export const WorkspacesModel = pgTable(
  "workspaces",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(), // SEO-friendly URL identifier
    description: text("description").default(""),

    // Ownership and relationships
    createdBy: uuid("created_by")
      .references(() => UsersModel.id, { onDelete: "set null" })
      .notNull(),

    // Status tracking
    status: workspaceStatusEnum("status").default("active").notNull(),
    isPublic: boolean("is_public").default(false).notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),

    // Additional fields
    logoUrl: text("logo_url"),
    bannerUrl: text("banner_url"),
    websiteUrl: varchar("website_url", { length: 500 }),

    // Metadata
    storageQuota: bigint("storage_quota", { mode: "number" }).default(
      1073741824
    ), // 1GB in bytes
    memberLimit: integer("member_limit").default(100),

    // Indexes
  },
  (table) => ({
    slugIdx: index("slug_idx").on(table.slug),
    statusIdx: index("status_idx").on(table.status),
  })
);
