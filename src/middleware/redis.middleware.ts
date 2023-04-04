import dotenv from "dotenv";
import ioredis from "ioredis";

dotenv.config();

const port = Number.parseInt(process.env["REDIS_PORT"] ?? "5000");
const host = process.env["REDIS_HOST"] ?? "localhost";

const redis = new ioredis(port, host);

export default redis;
