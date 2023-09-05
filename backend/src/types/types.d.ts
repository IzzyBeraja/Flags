import type { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
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
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Query
> = Asyncify<RequestHandler<P, ResBody, ReqBody, ReqQuery>>;
