ALTER TABLE "common"."killswitches" RENAME TO "switches";--> statement-breakpoint
ALTER TABLE "common"."switches" DROP CONSTRAINT "killswitches_owned_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "common"."switches" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "common"."switches" ADD CONSTRAINT "switches_owned_by_users_id_fk" FOREIGN KEY ("owned_by") REFERENCES "common"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "common"."switches" ADD CONSTRAINT "name_owned_by_unique" UNIQUE("name","owned_by");