import type { JSONSchemaType } from "ajv";
import type { ParamsDictionary } from "express-serve-static-core";

import { BAD_REQUEST, CREATED } from "../../../errors/errorCodes";
import { registerUser } from "../../../queries/User.queries";
import { genRouteUUID } from "../../../utils/routeFunctions";
import { validateSchema } from "../../../validation/validateRequest";
import { emailSchema, nameSchema, passwordSchema } from "../../../validation/validationRules";

import { Router } from "express";

const router = Router();

interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

interface RegisterResponse {}

export const route_id = genRouteUUID();
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

router.post<ParamsDictionary, RegisterResponse, RegisterRequest>(
  "/register",
  validateSchema(route_id),
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
