import type { ResultAsync } from "../types/types";
import type { DatabasePool } from "slonik";

import { createPool } from "slonik";

export default async function initializeDBPool(): ResultAsync<DatabasePool> {
  const dbConnection = process.env["DATABASE_URL2"];
  const isProduction = (process.env["NODE_ENV"] ?? "development") === "production";

  if (!dbConnection) {
    return [null, { message: "No database connection string provided" }];
  }

  try {
    const pool = await createPool(dbConnection, { ssl: { rejectUnauthorized: isProduction } });
    return [pool, null];
  } catch (error) {
    return error instanceof Error ? [null, error] : [null, { message: "Unknown error" }];
  }
}
