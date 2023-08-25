import type { Express } from "express";

import corsMiddleware from "./cors.middleware";
import sessionMiddleware from "./session.middleware";
import prismaMiddleware from "../middleware/prisma.middleware";
import expressRouter from "../routes/router";

import express from "express";

export default function applyMiddleware(app: Express) {
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(sessionMiddleware);
  app.use(prismaMiddleware);
  app.use(expressRouter);
}
