import RedisStore from "connect-redis";
import dotenv from "dotenv";
import ioredis from "ioredis";

dotenv.config();

const port = Number.parseInt(process.env["REDIS_PORT"] ?? "5000");
const host = process.env["REDIS_HOST"] ?? "localhost";
const password = process.env["REDIS_PASSWORD"] ?? "password";

const client = new ioredis({ host, password, port });

const redisSessionStore = new RedisStore({ client });

export default redisSessionStore;
