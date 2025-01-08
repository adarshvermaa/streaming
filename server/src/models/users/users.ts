import { sql } from "drizzle-orm";
import {
    pgTable,
    varchar,
    text,
    timestamp,
    boolean,
    uuid,
    pgEnum,
} from "drizzle-orm/pg-core";

export const userStatus = pgEnum("user_status", ["active", "inactive"]);
export const userType = pgEnum("user_type", ["student", "teacher", "admin", 'superadmin']);


export const UsersModel = pgTable("users", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`).unique(),
    name: varchar("name", { length: 255 }),
    publicName: varchar("public_name", { length: 255 }),
    email: varchar("email", { length: 255 }).unique(),
    username: varchar("username", { length: 255 }).unique(),
    password: text("password"),
    isActive: varchar("user_status", { length: 10 }).default("active"),
    userType: varchar("user_type", { length: 10 }).default("student"),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    coverUrl: varchar("cover_url", { length: 500 }),
    bio: text("bio"),
    phone: varchar("phone", { length: 20 }),
    externalUrl: varchar("external_url", { length: 800 }).array(),
    deleteAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
