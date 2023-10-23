import type { User } from "../../../../queries/users/updateUserCredentials";
import type { ErrorType, Params, RequestHandlerAsync } from "../../../../types/types";

import { BAD_REQUEST, OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import { updateUserCredentials } from "../../../../queries/users/updateUserCredentials";
import { passwordSchema } from "../../../../validation/validationRules";

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

export type PutHandler = RequestHandlerAsync<Params, PutResponse | ErrorType, PutRequest>;

export const Put: PutHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You need to be logged in to access this route" });
    return;
  }

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
