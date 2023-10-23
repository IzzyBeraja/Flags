import { sql } from "drizzle-orm";
import { pgSchema, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgSchema("common").table(
  "users",
  {
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    email: varchar("email", { length: 100 }).notNull(),
    first_name: varchar("first_name", { length: 50 }),
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    last_name: varchar("last_name", { length: 50 }),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  table => ({
    email_unique: uniqueIndex("email_unique_id").on(table.email),
  })
);
