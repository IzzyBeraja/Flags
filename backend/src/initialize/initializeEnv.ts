import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import chalk from "chalk";
import { appendFileSync } from "fs";
import path from "path";

const allSecrets = [
  { cloud: true, name: "DATABASE_URL" },
  { cloud: true, name: "REDIS_PORT" },
  { cloud: true, name: "REDIS_HOST" },
  { cloud: true, name: "REDIS_PASSWORD" },
  { cloud: true, name: "SESSION_SECRET" },
  { cloud: true, name: "API_KEY_ENCRYPTION_KEY" },
  { cloud: false, name: "NODE_ENV" },
  { cloud: false, name: "BACKEND_PORT" },
  { cloud: false, name: "FRONTEND_PORT" },
];

export async function initializeEnv(): Promise<[null | string[]]> {
  const projectId = "flags-403201";
  const gcpSecrets = allSecrets.filter(({ name, cloud }) => cloud && process.env[name] == null);

  if (gcpSecrets.length > 0) {
    const envPath = path.join(process.cwd(), ".env");

    console.log(
      chalk.blue(`Fetching (${gcpSecrets.length}) secret(s) from Google Cloud Secret Manager...`)
    );

    try {
      const client = new SecretManagerServiceClient();

      for (const { name } of gcpSecrets) {
        const [version] = await client.accessSecretVersion({
          name: `projects/${projectId}/secrets/${name}/versions/latest`,
        });

        const secret = version.payload?.data?.toString();

        if (secret == null) {
          throw new Error(`Secret ${name} not found`);
        }

        appendFileSync(envPath, `\n${name}=${secret}`);
        console.log(chalk.green(`Added ${name} to .env file`));

        process.env[name] = secret;
      }
    } catch (error) {
      console.log(chalk.red(error));
    }
  } else {
    console.log(chalk.green("All secrets found in environment variables"));
  }

  const errors = allSecrets.reduce((acc: string[], { name }) => {
    if (process.env[name] == null) {
      acc.push(`${name} is not defined`);
    }

    return acc;
  }, []);

  if (errors.length > 0) return [errors];

  return [null];
}
