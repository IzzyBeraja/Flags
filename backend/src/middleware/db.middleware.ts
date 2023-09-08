import type { NextFunction, Request, Response } from "express";
import type { Connection } from "mysql2/promise";

const dbMiddleware =
  (database: Connection) => (req: Request, _res: Response, next: NextFunction) => {
    req.db = database;
    next();
  };

export default dbMiddleware;
