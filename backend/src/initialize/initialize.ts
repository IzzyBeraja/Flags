import type { RouteError } from "./initializeRoutes.js";
import type { ResultAsync } from "../types/types.js";
import type { PrismaClient } from "@prisma/client";
import type RedisStore from "connect-redis";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js/driver.js";
import type { Router } from "express";

import initializeDB from "./initializeDB.js";
import initializeORM from "./initializeORM.js";
import initializeRoutes, { allRoutes } from "./initializeRoutes.js";
import initializeSessionCache from "./initializeSessionCache.js";

type Initialize = {
  router: Router;
  prismaClient: PrismaClient;
  sessionStore: RedisStore;
  db: PostgresJsDatabase;
};

type InitializeError =
  | { service: "prisma" | "database" | "sessionCache"; message: string }
  | { service: "routes"; errors: RouteError[] };

export default async function initialize(): ResultAsync<Initialize, InitializeError> {
  // == Routing == //
  const [router, routerErrors] = await initializeRoutes();

  if (routerErrors != null) {
    return [null, { errors: routerErrors, service: "routes" }];
  }

  if (process.env["NODE_ENV"] !== "production") {
    console.group(`🌐 Routes (${allRoutes.size})`);
    console.table(
      [...allRoutes.values()],
      ["method", "routePath", "hasRequestSchema", "hasResponseSchema"]
    );
    console.groupEnd();
  } else {
    console.log(`🌐 Routes (${allRoutes.size})`);
  }

  // == Prisma == //
  const [prismaClient, prismaError] = await initializeORM();

  if (prismaError != null) {
    return [null, { message: prismaError.message, service: "prisma" }];
  }

  console.log("📊 Prisma connected sucessfully");

  // == Database == //
  const [db, dbError] = initializeDB();

  if (dbError != null) {
    return [null, { message: dbError.message, service: "database" }];
  }

  console.log("📦 Database connected successfully");

  // == Session Cache == //
  const [sessionStore, sessionError] = await initializeSessionCache();

  if (sessionError != null) {
    return [null, { message: sessionError.message, service: "sessionCache" }];
  }

  console.log("⏩ Session Cache connected succesesfully");

  return [{ db, prismaClient, router, sessionStore }, null];
}
