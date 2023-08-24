import type { Request, Response, NextFunction } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  await prisma.$connect();
  console.log("✅ Prisma initialized");
} catch (error) {
  console.error("❌ Prisma failed to initialize");
  console.error(error);
}

export default function prismaMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.prisma = prisma;
  next();
}
