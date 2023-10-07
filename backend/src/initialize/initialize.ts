import type { RouteError } from "./initializeRoutes.js";
import type { ResultAsync } from "../types/types.js";
import type { PrismaClient } from "@prisma/client";
import type RedisStore from "connect-redis";
import type { Router } from "express";
import type { DatabasePool } from "slonik";

import initializeDBPool from "./initializeDBPool.js";
import initializeORM from "./initializeORM.js";
import initializeRoutes, { allRoutes } from "./initializeRoutes.js";
import initializeSessionCache from "./initializeSessionCache.js";

type Initialize = {
  router: Router;
  prismaClient: PrismaClient;
  sessionStore: RedisStore;
  dbPool: DatabasePool;
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

  console.group(`🌐 Routes (${allRoutes.size})`);
  console.table(
    [...allRoutes.values()],
    ["method", "routePath", "hasRequestSchema", "hasResponseSchema"]
  );
  console.groupEnd();

  // == Prisma == //
  const [prismaClient, prismaError] = await initializeORM();

  if (prismaError != null) {
    return [null, { message: prismaError.message, service: "prisma" }];
  }

  console.log("📊 Prisma connected sucessfully");

  // == Database == //
  const [dbPool, dbPoolError] = await initializeDBPool();

  if (dbPoolError != null) {
    return [null, { message: dbPoolError.message, service: "database" }];
  }

  console.log("📦 Database connected successfully");

  // == Session Cache == //
  const [sessionStore, sessionError] = await initializeSessionCache();

  if (sessionError != null) {
    return [null, { message: sessionError.message, service: "sessionCache" }];
  }

  console.log("⏩ Session Cache connected succesesfully");

  return [{ dbPool, prismaClient, router, sessionStore }, null];
}
