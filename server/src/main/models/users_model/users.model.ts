import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

// Enum Definitions
export const userStatus = pgEnum("user_status", ["active", "inactive"]);
export const userType = pgEnum("user_type", [
  "student",
  "teacher",
  "admin",
  "superadmin",
]);
export const authProvider = pgEnum("auth_provider", [
  "google",
  "facebook",
  "github",
  "twitter",
  "local",
]);

export const UsersModel = pgTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    publicName: varchar("public_name", { length: 255 }).default(""),
    email: varchar("email", { length: 255 }).unique().notNull(),
    username: varchar("username", { length: 255 }).unique().notNull(),
    password: text("password").notNull(), // Made optional for OAuth users
    isActive: userStatus("user_status").default("active").notNull(),
    userType: userType("user_type").default("student").notNull(),
    avatarUrl: text("avatar_url"), // Changed to text for longer URLs
    coverUrl: text("cover_url"), // Changed to text for longer URLs
    bio: text("bio"),
    phone: varchar("phone", { length: 20 }),
    externalUrls: text("external_urls").array(), // Changed to text array
    deletedAt: timestamp("deleted_at"), // Corrected field name
    emailVerifiedAt: timestamp("email_verified_at"), // Improved naming
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    authProvider: authProvider("auth_provider").default("local").notNull(),
    isEmailVerifiedAt: timestamp("is_email_verified_at"),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    usernameIdx: index("username_idx").on(table.username),
    authProviderIdx: index("auth_provider_idx").on(table.authProvider),
  })
);
