import { checkEnvironment } from "../utils/checkEnvironment";

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import chalk from "chalk";
import { appendFileSync } from "fs";
import path from "path";

export async function initializeEnv(): Promise<[null | string[]]> {
  const projectId = "flags-403201";
  const secretNames = [
    "DATABASE_URL",
    "REDIS_PORT",
    "REDIS_HOST",
    "REDIS_PASSWORD",
    "SESSION_SECRET",
  ].filter(secretName => process.env[secretName] == null);

  if (secretNames.length > 0) {
    const envPath = path.join(process.cwd(), ".env");

    console.log(
      chalk.blue(`Fetching (${secretNames.length}) secret(s) from Google Cloud Secret Manager...`)
    );

    try {
      const client = new SecretManagerServiceClient();

      for (const secretName of secretNames) {
        const [version] = await client.accessSecretVersion({
          name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
        });

        const secret = version.payload?.data?.toString();

        if (secret == null) {
          throw new Error(`Secret ${secretName} not found`);
        }

        appendFileSync(envPath, `\n${secretName}=${secret}`);
        console.log(chalk.green(`Added ${secretName} to .env file`));

        process.env[secretName] = secret;
      }
    } catch (error) {
      console.log(chalk.red(error));
    }
  } else {
    console.log(chalk.green("All secrets found in environment variables"));
  }

  const errors = checkEnvironment();

  if (errors.length > 0) return [errors];

  return [null];
}
