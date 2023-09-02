import type { NextFunction, Request, Response } from "express";

import { prisma } from "../initialize/initializeDB.js";

export default function prismaMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.prisma = prisma;
  next();
}
