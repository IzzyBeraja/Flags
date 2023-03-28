import { KoaContextFunctionArgument as ArgsType } from "@as-integrations/koa";
import { PrismaClient } from "@prisma/client";
import { Context as KoaContext } from "koa";

export const prisma = new PrismaClient();

export interface Context extends KoaContext {
  prisma: PrismaClient;
}

export async function context({ ctx }: ArgsType): Promise<Context> {
  const token = ctx.request.headers.authorization;

  if (!token) {
    // throw new Error("No token provided");
  }

  return { ...ctx, prisma };
}
