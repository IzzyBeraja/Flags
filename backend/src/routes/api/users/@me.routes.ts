import type { IsAuthenticated } from "../../../middleware/route/isAuthenticated";
import type { AsyncHandler, EmptyObject, ErrorType } from "../../../types/types";

import { NOT_FOUND, OK } from "../../../errors/errorCodes";
import { isAuthenticated } from "../../../middleware/route/isAuthenticated";
import { getUser } from "../../../queries/users/getUser";
import { updateUser, type User } from "../../../queries/users/updateUser";
import { emailSchema, nameSchema } from "../../../validation/validationRules";

//#region GET

export const GetMiddleware = [isAuthenticated];

type GetRequest = EmptyObject;

type GetResponse = {
  user: User;
};

type GetHandler = {
  Response: GetResponse;
  Request: GetRequest;
  Error: ErrorType;
  Middleware: IsAuthenticated;
};

export const Get: AsyncHandler<GetHandler> = async (req, res) => {
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

export const PatchMiddleware = [isAuthenticated];

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

type PatchHandler = {
  Response: PatchResponse;
  Error: ErrorType;
  Request: PatchRequest;
  Middleware: IsAuthenticated;
};

export const Patch: AsyncHandler<PatchHandler> = async (req, res) => {
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
