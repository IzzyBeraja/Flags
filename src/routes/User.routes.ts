import { sessionName } from "./../middleware/session.middleware";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../errors/errorCodes";
import { createUser, getUser } from "../queries/User.queries";
import { validate } from "../validation/requestValidation";

import express from "express";
import { body } from "express-validator";

const router = express.Router();

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
    const createUserRequest = await createUser(req.prisma, {
      email: req.body["email"].toLowerCase(),
      name: req.body["name"],
      password: req.body["password"],
    });

    return createUserRequest.success
      ? res.status(CREATED).json(createUserRequest.createdUser)
      : res.status(BAD_REQUEST).send(createUserRequest.error);
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

    const getUserRequest = await getUser(
      req.prisma,
      req.body["email"].toLowerCase(),
      req.body["password"]
    );

    if (getUserRequest.success) {
      req.session.userId = getUserRequest.user.id;
      return res.status(OK).send("Login successful");
    }

    return res.status(BAD_REQUEST).send(getUserRequest.error);
  }
);

router.post("/logout", (req, res) => {
  if (req.session == null) {
    return res.status(BAD_REQUEST).send("You are not logged in");
  }

  //> TODO - Modify this to use async/await
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(BAD_REQUEST).send("Something went wrong");
    }

    res.clearCookie(sessionName);
    return res.status(OK).send("Logout successful");
  });
  return;
});
export default router;
