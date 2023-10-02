import type { RequestHandlerAsync } from "../../../types/types.js";
import type { JSONSchemaType } from "ajv";
import type { ParamsDictionary } from "express-serve-static-core";

import { OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { loginUser } from "../../../queries/User.queries";
import { emailSchema, passwordSchema } from "../../../validation/validationRules";

export interface PostRequest {
  email: string;
  password: string;
}

export interface PostResponse {
  message: string;
}

export const PostRequestSchema: JSONSchemaType<PostRequest> = {
  additionalProperties: false,
  properties: {
    email: emailSchema,
    password: passwordSchema,
  },
  required: ["email", "password"],
  type: "object",
};

type RouteHandler = RequestHandlerAsync<ParamsDictionary, PostResponse, PostRequest>;

export const Post: RouteHandler = async (req, res) => {
  const loginUserRequest = await loginUser(req.prisma, req.body.email, req.body.password);

  if (loginUserRequest.success) {
    req.session.userId = loginUserRequest.user.id;
    res.status(OK);
    res.json({ message: "Login successful" });
    return;
  }

  res.status(UNAUTHORIZED);
  res.json({ message: "Incorrect username or password" });
};
