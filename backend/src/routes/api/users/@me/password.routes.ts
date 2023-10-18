import type { Account } from "../../../../queries/account/updateAccountCredentials";
import type { Error, Params, RequestHandlerAsync } from "../../../../types/types";

import { BAD_REQUEST, OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import { updateAccountCredentials } from "../../../../queries/account/updateAccountCredentials";
import { passwordSchema } from "../../../../validation/validationRules";

export interface PutRequest {
  oldPassword: string;
  newPassword: string;
}

export type PutResponse = { account: Account };

export const PutRequestSchema = {
  additionalProperties: false,
  properties: {
    newPassword: passwordSchema,
    oldPassword: passwordSchema,
  },
  required: ["oldPassword", "newPassword"],
  type: "object",
};

type PutHandler = RequestHandlerAsync<Params, PutResponse | Error, PutRequest>;

export const Put: PutHandler = async (req, res) => {
  if (req.session.accountId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You need to be logged in to access this route" });
    return;
  }

  const [account, error] = await updateAccountCredentials(req.db, {
    accountId: req.session.accountId,
    ...req.body,
  });

  if (error != null) {
    res.status(BAD_REQUEST);
    res.json({ message: "Invalid email password combination" });
    return;
  }

  res.status(OK);
  res.json({ account: account });
};
