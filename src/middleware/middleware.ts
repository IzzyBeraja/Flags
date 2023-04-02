import type { Express } from "express";

import corsMiddleware from "./cors.middleware";
import prismaMiddleware from "../middleware/prisma.middleware";
import router from "../routes/router";

import express from "express";

export default function applyMiddleware(app: Express) {
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(prismaMiddleware);
  app.use("/api", router);
}
