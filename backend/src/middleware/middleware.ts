import type RedisStore from "connect-redis";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Application, Router } from "express";

import corsMiddleware from "./cors.middleware";
import dbMiddleware from "./db.middleware";
import sessionMiddleware from "../middleware/session.middleware";

import express from "express";

type Props = {
  app: Application;
  router: Router;
  sessionStore: RedisStore;
  db: PostgresJsDatabase;
};

export default function middleware({ app, router, sessionStore, db }: Props) {
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(sessionMiddleware(sessionStore));
  app.use(dbMiddleware(db));
  app.use(router);
}
