import type { User } from "../../../queries/users/registerUser";
import type { Params, RequestHandlerAsync } from "../../../types/types";
import type { JSONSchemaType } from "ajv";

import { BAD_REQUEST, CREATED } from "../../../errors/errorCodes";
import { registerUser } from "../../../queries/users/registerUser";
import { emailSchema, passwordSchema } from "../../../validation/validationRules";

export interface PostRequest {
  email: string;
  password: string;
}

type UserCreated = {
  createdUser: User;
};

type UserNotCreated = {
  error: string;
};

export type PostResponse = UserCreated | UserNotCreated;

export const PostRequestSchema: JSONSchemaType<PostRequest> = {
  additionalProperties: false,
  properties: {
    email: emailSchema,
    password: passwordSchema,
  },
  required: ["email", "password"],
  type: "object",
};

type RouteHandler = RequestHandlerAsync<Params, PostResponse, PostRequest>;

export const Post: RouteHandler = async (req, res) => {
  const [user, error] = await registerUser(req.db, { ...req.body });

  if (error != null) {
    res.status(BAD_REQUEST);
    res.json({ error: error.message });
    return;
  }

  req.session.userId = user.userId;
  res.status(CREATED);
  res.json({ createdUser: user });
};
