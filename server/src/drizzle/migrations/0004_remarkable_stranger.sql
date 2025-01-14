ALTER TABLE "users" ALTER COLUMN "user_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_email_verified_at" timestamp;