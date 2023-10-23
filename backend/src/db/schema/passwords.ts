import { users } from "./users";

import { sql } from "drizzle-orm";
import { foreignKey, pgSchema, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const passwords = pgSchema("common").table(
  "passwords",
  {
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    password: varchar("password", { length: 100 }).notNull(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  table => ({
    users_id_fkey: foreignKey({ columns: [table.id], foreignColumns: [users.id] }),
  })
);
