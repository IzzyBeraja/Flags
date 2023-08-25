import { BAD_REQUEST, OK } from "../../../errors/errorCodes";
import { loginUser } from "../../../queries/User.queries";
import { validate } from "../../../validation/validateRequest";

import { Router } from "express";
import { body } from "express-validator";

const router = Router();

export const schema = {};

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
      req.session.userId = loginUserRequest.user["id"];
      return res.status(OK).send("Login successful");
    }

    return res.status(BAD_REQUEST).send(loginUserRequest.error);
  }
);

export default router;
