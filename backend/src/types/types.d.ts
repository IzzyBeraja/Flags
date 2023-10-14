import type { PrismaClient } from "@prisma/client";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
      db: PostgresJsDatabase;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    userId: string | undefined;
  }
}

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/** Takes a type and makes all of its functions async */
type Asyncify<T> = T extends (...args: infer U) => infer R
  ? (...args: U) => Promise<UnwrapPromise<R>>
  : T;

type RequestHandlerAsync<
  P = Params,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Query
> = Asyncify<RequestHandler<P, ResBody, ReqBody, ReqQuery>>;

export interface Params {
  [key: string]: string;
}

type Error = {
  message: string;
};

export type Result<T, U = Error> = [T, null] | [null, U];
export type ResultAsync<T, U = Error> = Promise<Result<T, U>>;
