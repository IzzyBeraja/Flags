import { sql } from "drizzle-orm";
import { pgSchema, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const accounts = pgSchema("common").table(
  "accounts",
  {
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    email: varchar("email", { length: 254 }).notNull(),
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    password: varchar("password", { length: 100 }).notNull(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  table => ({
    email_unique: unique("email_unique").on(table.email),
  })
);
