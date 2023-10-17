import type RedisStore from "connect-redis";

import expressSession from "express-session";

export const sessionName = "sid";

const sessionMiddleware = (redisStore: RedisStore) =>
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
    store: redisStore,
  });

export default sessionMiddleware;
