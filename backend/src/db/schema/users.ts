import { accounts } from "./accounts";

import { sql } from "drizzle-orm";
import { foreignKey, pgSchema, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgSchema("common").table(
  "users",
  {
    account_id: uuid("account_id").notNull(),
    first_name: varchar("first_name", { length: 50 }),
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    last_name: varchar("last_name", { length: 50 }),
  },
  table => ({
    account_id_key: unique("account_id_key").on(table.account_id),
    users_account_id_fkey: foreignKey({ columns: [table.id], foreignColumns: [accounts.id] }),
  })
);
