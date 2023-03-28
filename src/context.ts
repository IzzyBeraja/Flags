import { ExpressContextFunctionArgument as ArgsType } from "@apollo/server/dist/esm/express4";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
}

export async function context({ req }: ArgsType): Promise<Context> {
  const token = req.headers.authorization;

  if (!token) {
    // throw new Error("No token provided");
  }

  return { prisma };
}
