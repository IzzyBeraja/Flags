import type { ParamsDictionary } from "express-serve-static-core";

import { BAD_REQUEST, OK } from "../../../errors/errorCodes";
import { loginUser } from "../../../queries/User.queries";
import { validateSchema } from "../../../validation/requestValidation";

import { Router } from "express";
import { v4 as createUUID } from "uuid";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {}

const router = Router();
export const route_id = createUUID();
export const requestSchema = {
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["email", "password"],
  type: "object",
};

router.post<ParamsDictionary, LoginResponse, LoginRequest>(
  "/login",
  validateSchema(route_id),
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
