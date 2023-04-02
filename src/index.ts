import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
export const prisma = new PrismaClient();

app.get("/user", async (_req, res) => {
  const data = await prisma.user.findMany({
    include: { links: true },
  });
  res.json(data);
});

const port = Number.parseInt(process.env["PORT"] ?? "4000");
app.listen(port, () =>
  console.log(`Starting server on http://localhost:${port}`)
);
