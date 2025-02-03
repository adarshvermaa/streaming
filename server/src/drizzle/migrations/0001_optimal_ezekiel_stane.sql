ALTER TABLE "workspace_members" ADD COLUMN "invitation_token" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitation_token_idx" ON "workspace_members" USING btree ("invitation_token");--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_invitation_token_unique" UNIQUE("invitation_token");