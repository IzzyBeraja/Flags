CREATE TABLE IF NOT EXISTS "common"."passwords" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password" varchar(100) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "common"."accounts";--> statement-breakpoint
ALTER TABLE "common"."switches" DROP CONSTRAINT "name_owned_by_unique";--> statement-breakpoint
ALTER TABLE "common"."users" DROP CONSTRAINT "account_id_key";--> statement-breakpoint
ALTER TABLE "common"."users" DROP CONSTRAINT "users_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "common"."users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "common"."users" ADD COLUMN "email" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "common"."users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "diagram_id_idx" ON "common"."diagram_nodes" ("diagram_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flag_id_idx" ON "common"."diagram_nodes" ("flag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parent_id_idx" ON "common"."diagram_nodes" ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "owned_by_idx" ON "common"."diagrams" ("owned_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "owned_by_idx" ON "common"."flags" ("owned_by");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_owned_by_unique" ON "common"."switches" ("name","owned_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "owned_by_idx" ON "common"."switches" ("owned_by");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_unique_id" ON "common"."users" ("email");--> statement-breakpoint
ALTER TABLE "common"."users" DROP COLUMN IF EXISTS "account_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "common"."passwords" ADD CONSTRAINT "passwords_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "common"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
