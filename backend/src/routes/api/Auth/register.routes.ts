import type { User } from "../../../queries/users/registerUser";
import type { AsyncHandler, ErrorType } from "../../../types/types";
import type { JSONSchemaType } from "ajv";

import { BAD_REQUEST, CREATED } from "../../../errors/errorCodes";
import { registerUser } from "../../../queries/users/registerUser";
import { emailSchema, passwordSchema } from "../../../validation/validationRules";

type PostRequest = {
  email: string;
  password: string;
};

type PostResponse = {
  user: User;
};

export const PostRequestSchema: JSONSchemaType<PostRequest> = {
  additionalProperties: false,
  properties: {
    email: emailSchema,
    password: passwordSchema,
  },
  required: ["email", "password"],
  type: "object",
};

export type PostHandler = {
  Response: PostResponse;
  Error: ErrorType;
  Request: PostRequest;
};

export const Post: AsyncHandler<PostHandler> = async (req, res) => {
  const [user, error] = await registerUser(req.db, { ...req.body });

  if (error != null) {
    res.status(BAD_REQUEST);
    res.json({ message: error.message });
    return;
  }

  req.session.userId = user.userId;
  res.status(CREATED);
  res.json({ user: user });
};
