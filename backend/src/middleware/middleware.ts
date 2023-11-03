import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Application, Router } from "express";
import type { Redis } from "ioredis";

import { authenticationMiddleware } from "./authentication.middleware";
import { corsMiddleware } from "./cors.middleware";
import { dbMiddleware } from "./db.middleware";
import { helmetMiddleware } from "./helmet.middleware";
import { sessionMiddleware } from "../middleware/session.middleware";
import { logFormatter } from "../utils/logFormatter";

import express from "express";
import morgan from "morgan";

type Props = {
  app: Application;
  router: Router;
  cache: Redis;
  db: PostgresJsDatabase;
};

export function middleware({ app, router, cache, db }: Props) {
  app.use(morgan(logFormatter));
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(helmetMiddleware);
  app.use(dbMiddleware(db));
  app.use(sessionMiddleware(cache));
  app.use(authenticationMiddleware(cache));
  app.use(router);
}
