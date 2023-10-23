import type { EmptyObject, ErrorType, Params, RequestHandlerAsync } from "../../../types/types";

import { NOT_FOUND, OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { getUser } from "../../../queries/users/getUser";
import { updateUser, type User } from "../../../queries/users/updateUser";
import { emailSchema, nameSchema } from "../../../validation/validationRules";

//#region GET

type GetRequest = EmptyObject;

type GetResponse = {
  user: User;
};

export type GetHandler = RequestHandlerAsync<Params, GetResponse | ErrorType, GetRequest>;

export const Get: GetHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You need to be logged in to access this route" });
    return;
  }

  const [user, error] = await getUser(req.db, { userId: req.session.userId });

  if (error != null) {
    res.status(NOT_FOUND);
    res.json({ message: "User was not found" });
    return;
  }

  res.status(OK);
  res.json({ user });
};

//#endregion

//#region PATCH

type PatchRequest = {
  email?: string;
  firstName?: string;
  lastName?: string;
};

type PatchResponse = {
  user: User;
};

export const PatchRequestSchema = {
  additionalProperties: false,
  properties: {
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
  },
  type: "object",
};

export type PatchHandler = RequestHandlerAsync<Params, PatchResponse | ErrorType, PatchRequest>;

export const Patch: PatchHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You need to be logged in to access this route" });
    return;
  }

  const [user, error] = await updateUser(req.db, {
    userId: req.session.userId,
    ...req.body,
  });

  if (error != null) {
    res.status(NOT_FOUND);
    res.json({ message: "User was not found" });
    return;
  }

  req.session.email = user.email;
  req.session.firstName = user.firstName;
  req.session.lastName = user.lastName;

  res.status(OK);
  res.json({ user });
};

//#endregion
