import { sessionName } from "./../middleware/session.middleware";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../errors/errorCodes";
import { validate } from "../validation/requestValidation";

import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import express from "express";
import { body } from "express-validator";

const router = express.Router();
const saltRounds = 10;

router.get("/", async (req, res) => {
  if (req.session.userId == null) {
    return res
      .status(UNAUTHORIZED)
      .send("You need to be logged in to access this route");
  }

  const user = await req.prisma.user.findUnique({
    where: { id: req.session.userId },
  });
  return res.status(OK).json({ ...user, password: undefined });
});

router.post(
  "/register",
  validate([
    body("email", "A valid email is required").isEmail(),
    body("name", "A valid name is required").isAlphanumeric(),
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

      req.session.userId = createdUser.id;

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

router.post(
  "/login",
  validate([
    body("email", "A valid email is required").isEmail(),
    body("password", "A valid password is required").isLength({ min: 6 }),
  ]),
  async (req, res) => {
    if (req.session.userId != null) {
      return res.status(BAD_REQUEST).send("You are already logged in");
    }

    const user = await req.prisma.user.findUnique({
      where: {
        email: req.body["email"].toLowerCase(),
      },
    });

    if (user == null) {
      return res.status(BAD_REQUEST).send("No user with that email found");
    }

    const passwordMatch = await bcrypt.compare(
      req.body["password"],
      user.password
    );

    if (!passwordMatch) {
      return res.status(BAD_REQUEST).send("Bad email and password combination");
    }

    req.session.userId = user.id;
    return res.status(OK).send("Login successful");
  }
);

router.post("/logout", async (req, res) => {
  if (req.session == null) {
    return res.status(BAD_REQUEST).send("You are not logged in");
  }

  return req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(BAD_REQUEST).send("Something went wrong");
    }

    res.clearCookie(sessionName);
    return res.status(OK).send("Logout successful");
  });
});
export default router;
