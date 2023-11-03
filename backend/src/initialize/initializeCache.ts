import type { ResultAsync } from "../types/types";
import type { Redis } from "ioredis";

import ioredis from "ioredis";

export async function initializeCache(): ResultAsync<Redis> {
  const port = Number.parseInt(process.env["REDIS_PORT"] ?? "5000");
  const host = process.env["REDIS_HOST"] ?? "localhost";
  const password = process.env["REDIS_PASSWORD"] ?? "password";

  const client = new ioredis({ host, password, port });

  try {
    // Verify connection with redis
    await client.monitor();
    return [client, null];
  } catch (error) {
    return error instanceof Error ? [null, error] : [null, { message: "Unknown error" }];
  }
}
