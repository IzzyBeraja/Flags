import RedisStore from "connect-redis";
import dotenv from "dotenv";
import ioredis from "ioredis";

dotenv.config();

let redisSessionStore: RedisStore | undefined;

try {
  const port = Number.parseInt(process.env["REDIS_PORT"] ?? "5000");
  const host = process.env["REDIS_HOST"] ?? "localhost";
  const password = process.env["REDIS_PASSWORD"] ?? "password";

  const client = new ioredis({ host, password, port });

  // Verify connection with redis
  await client.monitor();

  redisSessionStore = new RedisStore({ client });

  console.log("✅ Redis initialized");
} catch (error) {
  console.error("❌ Redis failed to initialize");
  console.error(error);
}

export default redisSessionStore;
