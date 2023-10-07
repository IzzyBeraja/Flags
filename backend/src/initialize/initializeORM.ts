import type { ResultAsync } from "../types/types";

import { PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

export default async function initializeORM(): ResultAsync<PrismaClient> {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    return [prisma, null];
  } catch (error) {
    return error instanceof PrismaClientInitializationError
      ? [null, error]
      : [null, { message: "Unknown Prisma Error" }];
  }
}
