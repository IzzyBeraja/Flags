import type { ResultAsync } from "../types/types";

import RedisStore from "connect-redis";
import ioredis from "ioredis";

export async function initializeCache(): ResultAsync<RedisStore> {
  const port = Number.parseInt(process.env["REDIS_PORT"] ?? "5000");
  const host = process.env["REDIS_HOST"] ?? "localhost";
  const password = process.env["REDIS_PASSWORD"] ?? "password";

  const client = new ioredis({ host, password, port });
  const redisStore = new RedisStore({ client });

  try {
    // Verify connection with redis
    await client.monitor();
    return [redisStore, null];
  } catch (error) {
    return error instanceof Error ? [null, error] : [null, { message: "Unknown error" }];
  }
}
