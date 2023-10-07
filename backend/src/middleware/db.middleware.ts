import type { NextFunction, Request, Response } from "express";
import type { DatabasePool } from "slonik";

const dbMiddleware =
  (dbPool: DatabasePool) => (req: Request, _res: Response, next: NextFunction) => {
    req.db = dbPool;
    next();
  };

export default dbMiddleware;
