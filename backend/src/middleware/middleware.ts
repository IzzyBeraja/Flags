import type { PrismaClient } from "@prisma/client";
import type RedisStore from "connect-redis";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Application, Router } from "express";

import corsMiddleware from "./cors.middleware";
import dbMiddleware from "./db.middleware";
import prismaMiddleware from "../middleware/prisma.middleware";
import sessionMiddleware from "../middleware/session.middleware";

import express from "express";

type Props = {
  app: Application;
  router: Router;
  sessionStore: RedisStore;
  prismaClient: PrismaClient;
  db: PostgresJsDatabase;
};

export default function middleware({ app, router, sessionStore, prismaClient, db }: Props) {
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(sessionMiddleware(sessionStore));
  app.use(prismaMiddleware(prismaClient));
  app.use(dbMiddleware(db));
  app.use(router);
}
