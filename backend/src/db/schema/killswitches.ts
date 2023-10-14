import { users } from "./users";

import { sql } from "drizzle-orm";
import { boolean, foreignKey, pgSchema, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const killswitches = pgSchema("common").table(
  "killswitches",
  {
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    description: varchar("description", { length: 250 }).notNull(),
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    owned_by: uuid("owned_by").notNull(),
    state: boolean("state").notNull().default(false),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  table => ({
    owned_by_fkey: foreignKey({ columns: [table.owned_by], foreignColumns: [users.id] }),
  })
);
