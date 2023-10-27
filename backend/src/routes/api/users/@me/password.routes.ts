import type { IsAuthenticated } from "../../../../middleware/route/isAuthenticated";
import type { User } from "../../../../queries/users/updateUserCredentials";
import type { AsyncHandler, ErrorType } from "../../../../types/types";

import { BAD_REQUEST, OK } from "../../../../errors/errorCodes";
import { isAuthenticated } from "../../../../middleware/route/isAuthenticated";
import { updateUserCredentials } from "../../../../queries/users/updateUserCredentials";
import { passwordSchema } from "../../../../validation/validationRules";

export const PutMiddleware = [isAuthenticated];

type PutRequest = {
  oldPassword: string;
  newPassword: string;
};

type PutResponse = {
  user: User;
};

export const PutRequestSchema = {
  additionalProperties: false,
  properties: {
    newPassword: passwordSchema,
    oldPassword: passwordSchema,
  },
  required: ["oldPassword", "newPassword"],
  type: "object",
};

type PutHandler = {
  Request: PutRequest;
  Response: PutResponse;
  Error: ErrorType;
  Middleware: IsAuthenticated;
};

export const Put: AsyncHandler<PutHandler> = async (req, res) => {
  const [user, error] = await updateUserCredentials(req.db, {
    userId: req.session.userId,
    ...req.body,
  });

  if (error != null) {
    res.status(BAD_REQUEST);
    res.json({ message: "Invalid email password combination" });
    return;
  }

  res.status(OK);
  res.json({ user });
};
