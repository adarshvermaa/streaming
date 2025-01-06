import {
    pgTable,
    varchar,
    text,
    timestamp,
    boolean,
    uuid,
    pgEnum
} from "drizzle-orm/pg-core";

export const userStatus = pgEnum("user_status", ["active", "inactive"]);
export const userType = pgEnum("user_type", ["student", "teacher", "admin", 'superadmin']);


export const UsersModel = pgTable("users", {
    id: uuid("id").primaryKey().notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    publicName: varchar("public_name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 255 }).unique(),
    password: text("password"),
    isActive: userStatus("user_status").default('active').notNull(),
    userType: userType("user_type").default('student').notNull(),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    coverUrl: varchar("avatar_url", { length: 500 }),
    bio: text("bio"),
    phone: varchar("phone", { length: 20 }),
    lastSeenAt: timestamp("last_seen_at"),
    isOnline: boolean("is_online").default(false),
    externalUrl: varchar("external_url", { length: 800 }).array(),
    deleteAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
