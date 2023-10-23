import { users } from "./users";

import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const switches = pgSchema("common").table(
  "switches",
  {
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    description: varchar("description", { length: 250 }),
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    owned_by: uuid("owned_by").notNull(),
    state: boolean("state").notNull().default(false),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  table => ({
    name_owned_by_unique: uniqueIndex("name_owned_by_unique").on(table.name, table.owned_by),
    owned_by_fkey: foreignKey({ columns: [table.owned_by], foreignColumns: [users.id] }),
    owned_by_idx: index("owned_by_idx").on(table.owned_by),
  })
);
