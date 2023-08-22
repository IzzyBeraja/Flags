import type { Request, Response, NextFunction } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function prismaMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.prisma = prisma;
  next();
}
