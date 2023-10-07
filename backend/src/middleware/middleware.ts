import type { PrismaClient } from "@prisma/client";
import type RedisStore from "connect-redis";
import type { Application, Router } from "express";
import type { DatabasePool } from "slonik";

import corsMiddleware from "./cors.middleware";
import dbMiddleware from "./db.middleware";
import { getSessionData } from "../initialize/initializeSession";
import prismaMiddleware from "../middleware/prisma.middleware";

import express from "express";
import sessionMiddleware from "express-session";

type Props = {
  app: Application;
  router: Router;
  sessionStore: RedisStore;
  prismaClient: PrismaClient;
  dbPool: DatabasePool;
};

export default function middleware({ app, router, sessionStore, prismaClient, dbPool }: Props) {
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(sessionMiddleware(getSessionData(sessionStore)));
  app.use(prismaMiddleware(prismaClient));
  app.use(dbMiddleware(dbPool));
  app.use(router);
}
