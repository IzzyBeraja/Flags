import type { JSONSchemaType } from "ajv";
import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { BAD_REQUEST, CREATED } from "../../../errors/errorCodes.js";
import { registerUser } from "../../../queries/User.queries.js";
import { emailSchema, nameSchema, passwordSchema } from "../../../validation/validationRules.js";

export const method = "POST";

interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

interface RegisterResponse {}

export const requestSchema: JSONSchemaType<RegisterRequest> = {
  additionalProperties: false,
  properties: {
    email: emailSchema,
    name: nameSchema,
    password: passwordSchema,
  },
  required: ["email", "name", "password"],
  type: "object",
};

type RouteHandler = RequestHandler<ParamsDictionary, RegisterResponse, RegisterRequest>;

export const route: RouteHandler = async (req, res) => {
  const registerUserRequest = await registerUser(req.prisma, {
    email: req.body["email"].toLowerCase(),
    name: req.body["name"],
    password: req.body["password"],
  });

  registerUserRequest.success
    ? res.status(CREATED).json(registerUserRequest.createdUser)
    : res.status(BAD_REQUEST).send(registerUserRequest.error);
};
