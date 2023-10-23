import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { RequestHandler } from "express";

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

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/** Takes a type and makes all of its functions async */
export type Asyncify<T> = T extends (...args: infer U) => infer R
  ? (...args: U) => Promise<UnwrapPromise<R>>
  : T;

export type RequestHandlerAsync<
  P = Params,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Query
> = Asyncify<RequestHandler<P, ResBody, ReqBody, ReqQuery>>;

export interface Params {
  [key: string]: string;
}

export type ErrorType = {
  message: string;
};

export type Result<T, U = ErrorType> = [T, null] | [null, U];
export type ResultAsync<T, U = ErrorType> = Promise<Result<T, U>>;

export type EmptyObject = Record<PropertyKey, never>;
