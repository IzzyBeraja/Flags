import type { AsyncHandler } from "./../../../types/types.d";
import type { ErrorType } from "../../../types/types.js";
import type { JSONSchemaType } from "ajv";

import { OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { loginUser } from "../../../queries/users/loginUser.js";
import { emailSchema, passwordSchema } from "../../../validation/validationRules";

type PostRequest = {
  email: string;
  password: string;
};

type PostResponse = {
  message: string;
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
  const [userDetails, error] = await loginUser(req.db, req.body);

  if (error != null) {
    res.status(UNAUTHORIZED);
    res.json({ message: error.message });
    return;
  }

  req.session.email = userDetails.email;
  req.session.firstName = userDetails.firstName;
  req.session.lastName = userDetails.lastName;
  req.session.userId = userDetails.userId;
  req.session.ipAddress = req.ip;
  req.session.loginDate = new Date().toISOString();
  req.session.userAgent = req.get("user-agent") ?? "";

  res.status(OK);
  res.json({ message: "Login successful" });
};
