import { PrismaClient } from "@prisma/client";

export let prisma: PrismaClient;

export default async function initializeDB() {
  prisma = new PrismaClient();

  await prisma.$connect();
}
