import initialize from "./initialize/initialize.js";
import middleware from "./middleware/middleware.js";

import { config } from "dotenv";
import express from "express";

config();

const app = express();

async function startServer() {
  const [services, error] = await initialize();

  if (error != null) {
    console.error(error.service, error.service === "routes" ? error.errors : error.message);
    return;
  }

  middleware({ app, ...services });

  const port = Number.parseInt(process.env["PORT"] ?? "4000");
  app.listen(port, () => console.log(`🚀 Server started http://localhost:${port}`));
}

startServer();
