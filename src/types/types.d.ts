import type { PrismaClient } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
