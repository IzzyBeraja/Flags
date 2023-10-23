import { diagrams } from "./diagrams";
import { flags } from "./flags";

import { sql } from "drizzle-orm";
import { foreignKey, index, pgSchema, timestamp, uuid } from "drizzle-orm/pg-core";

export const diagram_nodes = pgSchema("common").table(
  "diagram_nodes",
  {
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    diagram_id: uuid("diagram_id").notNull(),
    flag_id: uuid("flag_id").notNull(),
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    parent_id: uuid("parent_id").notNull(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  table => ({
    diagram_id_fkey: foreignKey({ columns: [table.diagram_id], foreignColumns: [diagrams.id] }),
    diagram_id_idx: index("diagram_id_idx").on(table.diagram_id),
    flag_id_fkey: foreignKey({ columns: [table.flag_id], foreignColumns: [flags.id] }),
    flag_id_idx: index("flag_id_idx").on(table.flag_id),
    parent_id_fkey: foreignKey({ columns: [table.parent_id], foreignColumns: [table.id] }),
    parent_id_idx: index("parent_id_idx").on(table.parent_id),
  })
);
