import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      db: PostgresJsDatabase;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    userId?: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
    ipAddress?: string;
    userAgent?: string;
    loginDate?: string;
  }
}

type ErrorType = {
  message: string;
};

type Result<T, U = ErrorType> = [T, null] | [null, U];
type ResultAsync<T, U = ErrorType> = Promise<Result<T, U>>;

type EmptyObject = Record<PropertyKey, never>;

type RemoveOptional<T> = {
  [K in keyof T]-?: T[K];
};

type HandlerShape = {
  Request: unknown;
  Response: unknown;
  Error?: unknown;
  Params?: unknown;
  Query?: unknown;
  Middleware?: unknown;
};

type AsyncHandler<T extends HandlerShape> = (
  req: Request<T["Params"], T["Response"] | T["Error"], T["Request"], T["Query"]> & T["Middleware"],
  res: Response<T["Response"] | T["Error"]>,
  next?: NextFunction
) => Promise<void>;
