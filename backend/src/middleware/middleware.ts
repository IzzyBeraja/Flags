import type { Express } from "express";

import corsMiddleware from "./cors.middleware.js";
import sessionMiddleware from "./session.middleware.js";
import { expressRouter } from "../initialize/initializeRoutes.js";
import prismaMiddleware from "../middleware/prisma.middleware.js";

import express from "express";

export default function applyMiddleware(app: Express) {
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(sessionMiddleware);
  app.use(prismaMiddleware);
  app.use(expressRouter);
}
