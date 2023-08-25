import { BAD_REQUEST, CREATED } from "../../../errors/errorCodes";
import { registerUser } from "../../../queries/User.queries";
import { validate } from "../../../validation/validateRequest";

import { Router } from "express";
import { body } from "express-validator";

const router = Router();

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

export default router;
