import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { NextFunction, Request, Response } from "express";

const dbMiddleware =
  (db: PostgresJsDatabase) => (req: Request, _res: Response, next: NextFunction) => {
    req.db = db;
    next();
  };

export default dbMiddleware;
