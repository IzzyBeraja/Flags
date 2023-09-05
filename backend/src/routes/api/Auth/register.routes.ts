import type { UserWithoutPassword } from "../../../queries/User.queries";
import type { Params, RequestHandlerAsync } from "../../../types/types";
import type { JSONSchemaType } from "ajv";

import { BAD_REQUEST, CREATED } from "../../../errors/errorCodes";
import { registerUser } from "../../../queries/User.queries";
import { emailSchema, nameSchema, passwordSchema } from "../../../validation/validationRules";

export const method = "POST";

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

type UserCreated = {
  createdUser: UserWithoutPassword;
};

type UserNotCreated = {
  error: string;
};

export type RegisterResponse = UserCreated | UserNotCreated;

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

type RouteHandler = RequestHandlerAsync<Params, RegisterResponse, RegisterRequest>;

export const route: RouteHandler = async (req, res) => {
  const registerUserRequest = await registerUser(req.prisma, {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  });

  if (!registerUserRequest.success) {
    res.status(BAD_REQUEST);
    res.json({ error: registerUserRequest.error });
    return;
  }

  req.session.userId = registerUserRequest.createdUser.id;
  res.status(CREATED);
  res.json({ createdUser: registerUserRequest.createdUser });
};
