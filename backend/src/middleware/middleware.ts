import type { PrismaClient } from "@prisma/client";
import type RedisStore from "connect-redis";
import type { Application, Router } from "express";
import type { Connection } from "mysql2/promise";

import corsMiddleware from "./cors.middleware";
import dbMiddleware from "./db.middleware";
import { getSessionData } from "../initialize/initializeSession";
import prismaMiddleware from "../middleware/prisma.middleware";

import express from "express";
import sessionMiddleware from "express-session";

export default function middleware(
  app: Application,
  router: Router,
  RedisStore: RedisStore,
  prismaClient: PrismaClient,
  dbClient: Connection
) {
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(sessionMiddleware(getSessionData(RedisStore)));
  app.use(prismaMiddleware(prismaClient));
  app.use(dbMiddleware(dbClient));
  app.use(router);
}
