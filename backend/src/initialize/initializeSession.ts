import type RedisStore from "connect-redis";
import type { SessionOptions } from "express-session";

import dotenv from "dotenv";

dotenv.config();

const secret = process.env["SESSION_SECRET"] ?? "secret";

export const sessionName = "flags.sid";

export const getSessionData = (redisSessionStore: RedisStore): SessionOptions => ({
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
  },
  name: sessionName,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  secret,
  store: redisSessionStore,
});
