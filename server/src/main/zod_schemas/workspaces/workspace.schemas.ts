import { z } from "zod";

export const AddWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty.")
    .max(255, "Name must not exceed 255 characters."),

  description: z
    .string()
    .max(5000, "Description must not exceed 5000 characters.")
    .optional(),

  createdBy: z.string().uuid("Invalid user ID format."),

  status: z
    .enum(["active", "archived", "suspended", "deleted"])
    .default("active"),

  isPublic: z.boolean().default(false),

  logoUrl: z.string().url("Invalid logo URL format.").optional(),
  bannerUrl: z.string().url("Invalid banner URL format.").optional(),
  websiteUrl: z.string().url("Invalid website URL format.").optional(),
});

export const UpdateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty.")
    .max(255, "Name must not exceed 255 characters.")
    .optional(),

  description: z
    .string()
    .max(5000, "Description must not exceed 5000 characters.")
    .optional(),

  logoUrl: z.string().url("Invalid logo URL format.").optional(),

  bannerUrl: z.string().url("Invalid banner URL format.").optional(),

  websiteUrl: z.string().url("Invalid website URL format.").optional(),
});
