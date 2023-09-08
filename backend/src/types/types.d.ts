import type { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import type { Connection } from "mysql2/promise";

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
      db: Connection;
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
