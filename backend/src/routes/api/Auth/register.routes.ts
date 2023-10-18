import type { Account } from "../../../queries/account/registerAccount";
import type { Params, RequestHandlerAsync } from "../../../types/types";
import type { JSONSchemaType } from "ajv";

import { BAD_REQUEST, CREATED } from "../../../errors/errorCodes";
import { registerAccount } from "../../../queries/account/registerAccount";
import { emailSchema, passwordSchema } from "../../../validation/validationRules";

export interface PostRequest {
  email: string;
  password: string;
}

type UserCreated = {
  createdUser: Account;
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
  const [account, accountError] = await registerAccount(req.db, { ...req.body });

  if (accountError != null) {
    res.status(BAD_REQUEST);
    res.json({ error: accountError.message });
    return;
  }

  req.session.accountId = account.id;
  res.status(CREATED);
  res.json({ createdUser: account });
};
