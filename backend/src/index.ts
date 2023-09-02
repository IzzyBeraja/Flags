import initializeServices from "./initialize/initialize.js";
import applyMiddleware from "./middleware/middleware.js";

import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

async function startServer() {
  await initializeServices();
  applyMiddleware(app);

  const port = Number.parseInt(process.env["PORT"] ?? "4000");
  app.listen(port, () => console.log(`🚀 Server started http://localhost:${port}`));
}

startServer();
