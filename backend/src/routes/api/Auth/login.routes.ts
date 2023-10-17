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
  const [account, error] = await loginAccount(req.db, req.body);

  if (error != null) {
    res.status(UNAUTHORIZED);
    res.json({ message: error.message });
    return;
  }

  req.session.userId = account.id;
  res.status(OK);
  res.json({ message: "Login successful" });
};
