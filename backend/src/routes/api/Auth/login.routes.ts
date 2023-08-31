import type { JSONSchemaType } from "ajv";
import type { ParamsDictionary } from "express-serve-static-core";

import { BAD_REQUEST, OK } from "../../../errors/errorCodes";
import { loginUser } from "../../../queries/User.queries";
import { genRouteUUID } from "../../../utils/routeFunctions";
import { validateSchema } from "../../../validation/validateRequest";
import { emailSchema, passwordSchema } from "../../../validation/validationRules";

import { Router } from "express";

const router = Router();
export const route_id = genRouteUUID();

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {}

export const requestSchema: JSONSchemaType<LoginRequest> = {
  additionalProperties: false,
  properties: {
    email: emailSchema,
    password: passwordSchema,
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
