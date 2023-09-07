import RedisStore from "connect-redis";
import dotenv from "dotenv";
import ioredis from "ioredis";

dotenv.config();

export default async function initializeSessionCache(errors: Array<string>) {
  const port = Number.parseInt(process.env["REDIS_PORT"] ?? "5000");
  const host = process.env["REDIS_HOST"] ?? "localhost";
  const password = process.env["REDIS_PASSWORD"] ?? "password";

  const client = new ioredis({ host, password, port });

  try {
    // Verify connection with redis
    await client.monitor();
  } catch (error) {
    errors.push(error as string);
  }

  return new RedisStore({ client });
}
