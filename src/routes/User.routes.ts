import { BAD_REQUEST, CREATED } from "../errors/errorCodes";
import { validate } from "../validation/requestValidation";

import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import express from "express";
import { body } from "express-validator";

const router = express.Router();
const saltRounds = 10;

router.get("/", async (req, res) => {
  const data = await req.prisma.user.findMany({
    include: { links: true },
  });
  res.json(data);
});

router.post(
  "/register",
  validate([
    body("email", "A valid email is required").isEmail(),
    body("name", "A valid name is required"),
    body("password", "A valid password is required").isLength({ min: 6 }),
  ]),
  async (req, res) => {
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
  }
);

export default router;
