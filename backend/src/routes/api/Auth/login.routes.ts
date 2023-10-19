import type { Error, Params, RequestHandlerAsync } from "../../../types/types.js";
import type { JSONSchemaType } from "ajv";

import { OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { loginAccount } from "../../../queries/account/loginAccount.js";
import { emailSchema, passwordSchema } from "../../../validation/validationRules";

export interface PostRequest {
  email: string;
  password: string;
}

export interface PostResponse {}

export const PostRequestSchema: JSONSchemaType<PostRequest> = {
  additionalProperties: false,
  properties: {
    email: emailSchema,
    password: passwordSchema,
  },
  required: ["email", "password"],
  type: "object",
};

type RouteHandler = RequestHandlerAsync<Params, PostResponse | Error, PostRequest>;

export const Post: RouteHandler = async (req, res) => {
  const [userDetails, error] = await loginAccount(req.db, req.body);

  if (error != null) {
    res.status(UNAUTHORIZED);
    res.json({ message: error.message });
    return;
  }

  req.session.accountId = userDetails.accountId;
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
