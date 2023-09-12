import type { PrismaClient } from "@prisma/client";
import type RedisStore from "connect-redis";
import type { Application, Router } from "express";

import corsMiddleware from "./cors.middleware";
import { getSessionData } from "../initialize/initializeSession";
import prismaMiddleware from "../middleware/prisma.middleware";

import express from "express";
import sessionMiddleware from "express-session";

export default function middleware(
  app: Application,
  router: Router,
  RedisStore: RedisStore,
  prismaClient: PrismaClient
) {
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(sessionMiddleware(getSessionData(RedisStore)));
  app.use(prismaMiddleware(prismaClient));
  app.use(router);
}
