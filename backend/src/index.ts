import { initialize } from "./initialize/initialize.js";
import { middleware } from "./middleware/middleware.js";
import { checkEnvironment } from "./utils/checkEnvironment.js";

import chalk from "chalk";
import { config } from "dotenv";
import express from "express";

config();

const app = express();

app.disable("x-powered-by");

async function startServer() {
  console.log(chalk.blue("\nStarting server...\n"));

  const errors = checkEnvironment();

  if (errors.length > 0) {
    console.error(chalk.bgRed("Environment variable errors:"));
    errors.forEach(error => console.error(chalk.red(error)));
    return;
  }

  console.log(chalk.blue("Environment variables properly set"));
  console.log(
    process.env["NODE_ENV"] === "production"
      ? chalk.white.bgRed("===== PRODUCTION MODE =====")
      : chalk.bgGreen("===== DEVELOPMENT MODE =====")
  );

  const [services, error] = await initialize();

  if (error != null) {
    console.error(chalk.bgRed("Initialization errors:"));
    console.error(
      chalk.red(error.service, error.service === "routes" ? error.errors : error.message)
    );
    return;
  }

  middleware({ app, ...services });

  const port = Number.parseInt(process.env["BACKEND_PORT"] ?? "4000");
  app.listen(port, () => console.log(`🚀 Server started http://localhost:${port}`));
}

startServer();
console.log();
