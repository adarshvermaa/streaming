import { sql } from "drizzle-orm";
import {
    pgTable,
    varchar,
    text,
    timestamp,
    uuid,
    pgEnum,
} from "drizzle-orm/pg-core";

export const userStatus = pgEnum("user_status", ["active", "inactive"]);
export const userType = pgEnum("user_type", ["student", "teacher", "admin", 'superadmin']);


export const UsersModel = pgTable("users", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`).unique().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    publicName: varchar("public_name", { length: 255 }),
    email: varchar("email", { length: 255 }).unique().notNull(),
    username: varchar("username", { length: 255 }).unique().notNull(),
    password: text("password").notNull(),
    isActive: varchar("user_status", { length: 10 }).default("active").notNull(),
    userType: varchar("user_type", { length: 10 }).default("student").notNull(),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    coverUrl: varchar("cover_url", { length: 500 }),
    bio: text("bio"),
    phone: varchar("phone", { length: 20 }),
    externalUrl: varchar("external_url", { length: 800 }).array(),
    deleteAt: timestamp("deleted_at"),
    isEmailVerifiedAt: timestamp("is_email_verified_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
