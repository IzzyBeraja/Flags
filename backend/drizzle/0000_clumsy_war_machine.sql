CREATE TABLE IF NOT EXISTS "common"."accounts" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(254) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password" varchar(100) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "common"."diagram_nodes" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"diagram_id" uuid NOT NULL,
	"flag_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "common"."diagrams" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" varchar(250),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"owned_by" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "common"."flags" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" varchar(250),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"owned_by" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "common"."killswitches" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" varchar(250) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"owned_by" uuid NOT NULL,
	"state" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "common"."users" (
	"account_id" uuid NOT NULL,
	"first_name" varchar(50),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"last_name" varchar(50),
	CONSTRAINT "account_id_key" UNIQUE("account_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "common"."diagram_nodes" ADD CONSTRAINT "diagram_nodes_diagram_id_diagrams_id_fk" FOREIGN KEY ("diagram_id") REFERENCES "common"."diagrams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "common"."diagram_nodes" ADD CONSTRAINT "diagram_nodes_flag_id_flags_id_fk" FOREIGN KEY ("flag_id") REFERENCES "common"."flags"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "common"."diagram_nodes" ADD CONSTRAINT "diagram_nodes_parent_id_diagram_nodes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "common"."diagram_nodes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "common"."diagrams" ADD CONSTRAINT "diagrams_owned_by_users_id_fk" FOREIGN KEY ("owned_by") REFERENCES "common"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "common"."flags" ADD CONSTRAINT "flags_owned_by_users_id_fk" FOREIGN KEY ("owned_by") REFERENCES "common"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "common"."killswitches" ADD CONSTRAINT "killswitches_owned_by_users_id_fk" FOREIGN KEY ("owned_by") REFERENCES "common"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "common"."users" ADD CONSTRAINT "users_id_accounts_id_fk" FOREIGN KEY ("id") REFERENCES "common"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
