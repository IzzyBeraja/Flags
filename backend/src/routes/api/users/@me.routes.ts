import type { Error, Params, RequestHandlerAsync } from "../../../types/types";

import { NOT_FOUND, OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { createUser } from "../../../queries/user/createUser";
import { getUser } from "../../../queries/user/getUser";
import { updateUser, type User } from "../../../queries/user/updateUser";
import { nameSchema } from "../../../validation/validationRules";

export interface GetRequest {}

export type GetResponse = { user: User };

export type GetHandler = RequestHandlerAsync<Params, GetResponse | Error, GetRequest>;

export const Get: GetHandler = async (req, res) => {
  if (req.session.accountId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You need to be logged in to access this route" });
    return;
  }

  const [user, error] = await getUser(req.db, { accountId: req.session.accountId });

  if (error != null) {
    res.status(NOT_FOUND);
    res.json({ message: "User was not found" });
    return;
  }

  res.status(OK);
  res.json({ user });
};

export interface PatchRequest {
  firstName?: string;
  lastName?: string;
}

export type PatchResponse = { user: User };

export const PatchRequestSchema = {
  additionalProperties: false,
  properties: {
    firstName: nameSchema,
    lastName: nameSchema,
  },
  type: "object",
};

export type PatchHandler = RequestHandlerAsync<Params, PatchResponse | Error, PatchRequest>;

export const Patch: PatchHandler = async (req, res) => {
  if (req.session.accountId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You need to be logged in to access this route" });
    return;
  }

  const [user, error] = await updateUser(req.db, { accountId: req.session.accountId, ...req.body });

  if (error != null) {
    res.status(NOT_FOUND);
    res.json({ message: "User was not found" });
    return;
  }

  res.status(OK);
  res.json({ user });
};

export interface PostRequest {
  firstName?: string;
  lastName?: string;
}

export type PostResponse = { user: User };

export const PostRequestSchema = {
  additionalProperties: false,
  properties: {
    firstName: nameSchema,
    lastName: nameSchema,
  },
  type: "object",
};

export type PostHandler = RequestHandlerAsync<Params, PostResponse | Error, PostRequest>;

export const Post: PostHandler = async (req, res) => {
  if (req.session.accountId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You need to be logged in to access this route" });
    return;
  }

  const [user, error] = await createUser(req.db, { accountId: req.session.accountId, ...req.body });

  if (error != null) {
    res.status(NOT_FOUND);
    res.json({ message: "User was not found" });
    return;
  }

  res.status(OK);
  res.json({ user });
};
