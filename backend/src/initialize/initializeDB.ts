import { PrismaClient } from "@prisma/client";

export default async function initializeDB(errors: Array<string>) {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
  } catch (error) {
    errors.push(error as string);
  }

  return prisma;
}
