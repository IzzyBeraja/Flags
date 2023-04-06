import redisSessionStore from "../middleware/redisSessionStore.middleware";

import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const secret = process.env["SESSION_SECRET"] ?? "secret";

export const sessionName = "flags.sid";

const sessionMiddleware = session({
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

export default sessionMiddleware;
