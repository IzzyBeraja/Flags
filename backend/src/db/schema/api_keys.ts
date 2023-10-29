import { users } from "./users";

import { sql } from "drizzle-orm";
import { foreignKey, index, pgSchema, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const api_keys = pgSchema("common").table(
  "api_keys",
  {
    api_key: varchar("api_key", { length: 250 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    expires_at: timestamp("expires_at", { mode: "string" }),
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    owned_by: uuid("owned_by").notNull(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  table => ({
    api_key_idx: index("api_key_idx").on(table.api_key),
    owned_by_fkey: foreignKey({ columns: [table.owned_by], foreignColumns: [users.id] }),
    owned_by_idx: index("owned_by_idx").on(table.owned_by),
  })
);
