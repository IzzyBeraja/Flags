import type RedisStore from "connect-redis";
import type { SessionOptions } from "express-session";

export const sessionName = "sid";

export const genSessionData = (redisSessionStore: RedisStore): SessionOptions => ({
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
  secret: process.env["SESSION_SECRET"] ?? "secret",
  store: redisSessionStore,
});
