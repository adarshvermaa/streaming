import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { ChannelsModel } from "./channel.model";
import { UsersModel } from "../users_model/users.model";

export const ChannelMembersModel = pgTable(
  "channel_members",
  {
    channelId: uuid("channel_id")
      .references(() => ChannelsModel.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => UsersModel.id, { onDelete: "cascade" })
      .notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    // Explicitly named composite primary key
    compositePk: primaryKey({
      name: "channel_members_pkey",
      columns: [table.channelId, table.userId],
    }),
    // Indexes for common query patterns
    channelIdx: index("channel_idx").on(table.channelId),
    userIdx: index("user_idx").on(table.userId),
  })
);
