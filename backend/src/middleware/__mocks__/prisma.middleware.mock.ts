import type { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

export const mockPrismaMiddleware =
  (mockClient: PrismaClient) => (req: Request, _res: Response, next: NextFunction) => {
    req.prisma = mockClient;
    next();
  };
