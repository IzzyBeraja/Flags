import { BAD_REQUEST, CREATED } from "../errors/errorCodes";

import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import express from "express";

const router = express.Router();
const saltRounds = 10;

router.get("/", async (req, res) => {
  const data = await req.prisma.user.findMany({
    include: { links: true },
  });
  res.json(data);
});

router.post("/register", async (req, res) => {
  if (!req.body["email"] || !req.body["name"] || !req.body["password"]) {
    return res
      .status(BAD_REQUEST)
      .send(
        "To register a new user, a valid email, name, and password are required"
      );
  }

  const hashedPassword = await bcrypt.hash(req.body["password"], saltRounds);

  try {
    const createdUser = await req.prisma.user.create({
      data: {
        email: req.body["email"].toLowerCase(),
        name: req.body["name"],
        password: hashedPassword,
      },
    });

    return res.status(CREATED).json({ ...createdUser, password: undefined });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res
        .status(BAD_REQUEST)
        .send("A account with that email already exists");
    }

    return res.status(BAD_REQUEST).send("Something else went wrong");
  }
});

export default router;
