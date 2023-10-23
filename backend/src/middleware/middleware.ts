import type RedisStore from "connect-redis";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Application, Router } from "express";

import { corsMiddleware } from "./cors.middleware";
import { dbMiddleware } from "./db.middleware";
import { sessionMiddleware } from "../middleware/session.middleware";
import { logFormatter } from "../utils/logFormatter";

import express from "express";
import morgan from "morgan";

type Props = {
  app: Application;
  router: Router;
  sessionStore: RedisStore;
  db: PostgresJsDatabase;
};

export function middleware({ app, router, sessionStore, db }: Props) {
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(morgan(logFormatter));
  app.use(sessionMiddleware(sessionStore));
  app.use(dbMiddleware(db));
  app.use(router);
}
