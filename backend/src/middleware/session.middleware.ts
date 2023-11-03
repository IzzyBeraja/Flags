import type { Redis } from "ioredis";

import RedisStore from "connect-redis";
import expressSession from "express-session";

export const sessionName = "sid";

export const sessionMiddleware = (client: Redis) =>
  expressSession({
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
    store: new RedisStore({ client }),
  });
