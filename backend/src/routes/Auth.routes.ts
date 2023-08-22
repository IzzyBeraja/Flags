import { sessionName } from "./../middleware/session.middleware";
import { BAD_REQUEST, CREATED, OK } from "../errors/errorCodes";
import { registerUser, loginUser } from "../queries/User.queries";
import { validate } from "../validation/validateRequest";

import express from "express";
import { body } from "express-validator";

const router = express.Router();

//** Register **//

router.post(
  "/register",
  validate([
    body("email", "A valid email is required").isEmail(),
    body("name", "A valid name is required").isAlphanumeric(),
    body("password", "A valid password is required").isLength({ min: 6 }),
  ]),
  async (req, res) => {
    const registerUserRequest = await registerUser(req.prisma, {
      email: req.body["email"].toLowerCase(),
      name: req.body["name"],
      password: req.body["password"],
    });

    return registerUserRequest.success
      ? res.status(CREATED).json(registerUserRequest.createdUser)
      : res.status(BAD_REQUEST).send(registerUserRequest.error);
  }
);

//** Login **//

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

    const loginUserRequest = await loginUser(
      req.prisma,
      req.body["email"].toLowerCase(),
      req.body["password"]
    );

    if (loginUserRequest.success) {
      req.session.userId = loginUserRequest.user.id;
      return res.status(OK).send("Login successful");
    }

    return res.status(BAD_REQUEST).send(loginUserRequest.error);
  }
);

//** Logout **//

router.post("/logout", (req, res) => {
  if (req.session.userId == null) {
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
