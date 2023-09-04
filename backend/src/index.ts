import initialize from "./initialize/initialize.js";
import middleware from "./middleware/middleware.js";

import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

async function startServer() {
  const [router, prismaClient, redisStore] = await initialize();
  middleware(app, router, redisStore, prismaClient);

  const port = Number.parseInt(process.env["PORT"] ?? "4000");
  app.listen(port, () => console.log(`🚀 Server started http://localhost:${port}`));
}

startServer();
