import type { Result } from "../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export default function initializeDB(): Result<PostgresJsDatabase> {
  const dbConnection = process.env["DATABASE_URL"];

  if (!dbConnection) {
    return [null, { message: "No database connection string provided" }];
  }

  try {
    const pool = postgres(dbConnection);
    const db = drizzle(pool);
    return [db, null];
  } catch (error) {
    return error instanceof Error ? [null, error] : [null, { message: "Unknown error" }];
  }
}
