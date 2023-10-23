import { users } from "./users";

import { sql } from "drizzle-orm";
import { foreignKey, index, pgSchema, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const diagrams = pgSchema("common").table(
  "diagrams",
  {
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    description: varchar("description", { length: 250 }),
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    owned_by: uuid("owned_by").notNull(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  table => ({
    owned_by_fkey: foreignKey({ columns: [table.owned_by], foreignColumns: [users.id] }),
    owned_by_idx: index("owned_by_idx").on(table.owned_by),
  })
);
