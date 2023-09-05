import type { JSONSchemaType } from "ajv";
import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { BAD_REQUEST, OK } from "../../../errors/errorCodes.js";
import { loginUser } from "../../../queries/User.queries.js";
import { emailSchema, passwordSchema } from "../../../validation/validationRules.js";

export const method = "POST";

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

type RouteHandler = RequestHandler<ParamsDictionary, LoginResponse, LoginRequest>;

export const route: RouteHandler = async (req, res) => {
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
};
