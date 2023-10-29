import { initialize } from "./initialize/initialize.js";
import { middleware } from "./middleware/middleware.js";

import chalk from "chalk";
import { config } from "dotenv";
import express from "express";

config();

const app = express();

app.disable("x-powered-by");

async function startServer() {
  console.log(chalk.blue("\nStarting server...\n"));

  const [services, error] = await initialize();

  if (error != null) {
    console.error(chalk.bgRed(`Initialization errors in ${error.service}:`));
    console.error(
      chalk.red(
        error.service === "routes"
          ? error.errors.map(({ message, routePath }) => `${message} ${routePath}`).join("\n")
          : error.service === "env"
          ? error.errors.map(message => `${message}`).join("\n")
          : error.message
      )
    );
    return;
  }

  middleware({ app, ...services });

  const port = Number.parseInt(process.env["BACKEND_PORT"] ?? "4000");
  app.listen(port, () => console.log(`🚀 Server started http://localhost:${port}`));
}

startServer();
console.log();
