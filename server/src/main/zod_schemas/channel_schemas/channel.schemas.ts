// Zod schemas
import { z } from "zod";

export const CreateChannelSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  isPrivate: z.boolean().default(false),
});

export const UpdateChannelSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

export const CreateChannelMemberSchema = z.object({
  channelId: z.string().uuid("channel id must e required"),
  // userId: z.string().uuid("channel id must e required"),
});
