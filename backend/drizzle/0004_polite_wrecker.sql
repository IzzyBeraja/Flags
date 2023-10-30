DROP INDEX IF EXISTS "email_unique_id";--> statement-breakpoint
DROP INDEX IF EXISTS "api_key_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "common"."users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "api_key_idx" ON "common"."api_keys" ("api_key");