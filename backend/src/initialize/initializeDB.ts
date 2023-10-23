import type { ResultAsync } from "../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export async function initializeDB(): ResultAsync<PostgresJsDatabase> {
  const dbConnection = process.env["DATABASE_URL"];

  if (!dbConnection) {
    return [null, { message: "No database connection string provided" }];
  }

  try {
    const pool = postgres(dbConnection);
    const db = drizzle(pool);

    await db.execute(sql`SELECT NOW();`);
    return [db, null];
  } catch (error) {
    return error instanceof Error ? [null, error] : [null, { message: "Unknown error" }];
  }
}
