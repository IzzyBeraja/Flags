import type { RouteError } from "./initializeRoutes.js";
import type { ResultAsync } from "../types/types.js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js/driver.js";
import type { Router } from "express";
import type { Redis } from "ioredis";

import { initializeCache } from "./initializeCache.js";
import { initializeDB } from "./initializeDB.js";
import { initializeEnv } from "./initializeEnv.js";
import { allRoutes, initializeRoutes } from "./initializeRoutes.js";

import chalk from "chalk";

type Initialize = {
  router: Router;
  cache: Redis;
  db: PostgresJsDatabase;
};

type InitializeError =
  | { service: "database" | "cache"; message: string }
  | { service: "routes"; errors: RouteError[] }
  | { service: "env"; errors: string[] };

export async function initialize(): ResultAsync<Initialize, InitializeError> {
  // == Environment Variables == //
  const [envErrors] = await initializeEnv();

  if (envErrors != null) {
    return [null, { errors: envErrors, service: "env" }];
  }

  console.log(chalk.blue("Environment variables properly set!\n"));
  console.log(
    process.env["NODE_ENV"] === "production"
      ? chalk.white.bgRed("===== PRODUCTION MODE =====\n")
      : chalk.bgGreen("===== DEVELOPMENT MODE =====\n")
  );

  // == Routing == //
  const [router, routerErrors] = await initializeRoutes();

  if (routerErrors != null) {
    return [null, { errors: routerErrors, service: "routes" }];
  }

  if (process.env["NODE_ENV"] !== "production") {
    console.group(`🌐 Routes (${allRoutes.size})`);
    console.table(
      [...allRoutes.values()].sort((a, b) => a.routePath.localeCompare(b.routePath)),
      ["method", "routePath", "hasRequestSchema", "hasResponseSchema"]
    );
    console.groupEnd();
  } else {
    console.log(`🌐 Routes (${allRoutes.size})`);
  }

  // == Database == //
  const [db, dbError] = await initializeDB();

  if (dbError != null) {
    return [null, { message: dbError.message, service: "database" }];
  }

  console.log("📦 Database connected successfully");

  // == Session Cache == //
  const [cache, cacheError] = await initializeCache();

  if (cacheError != null) {
    return [null, { message: cacheError.message, service: "cache" }];
  }

  console.log("⏩ Session Cache connected succesesfully");

  return [{ cache, db, router }, null];
}
