import type { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

const prismaMiddleware =
  (prismaClient: PrismaClient) => (req: Request, _res: Response, next: NextFunction) => {
    req.prisma = prismaClient;
    next();
  };

export default prismaMiddleware;
