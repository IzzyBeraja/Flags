import { PrismaClient } from "@prisma/client";

export default async function initializeDB() {
  const prisma = new PrismaClient();

  await prisma.$connect();

  return prisma;
}
