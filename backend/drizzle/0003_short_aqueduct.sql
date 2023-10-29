CREATE TABLE IF NOT EXISTS "common"."api_keys" (
	"api_key" varchar(250) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owned_by" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_key_idx" ON "common"."api_keys" ("api_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "owned_by_idx" ON "common"."api_keys" ("owned_by");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "common"."api_keys" ADD CONSTRAINT "api_keys_owned_by_users_id_fk" FOREIGN KEY ("owned_by") REFERENCES "common"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
