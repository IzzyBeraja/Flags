import type { UserWithoutPassword } from "../../../../queries/User.queries";
import type { Params, RequestHandlerAsync } from "../../../../types/types";

import { OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import { compare, hash } from "../../../../utils/passwordFunctions";
import { passwordSchema } from "../../../../validation/validationRules";

export interface PutRequest {
  oldPassword: string;
  newPassword: string;
}

export type PutResponse = { error: string } | UserWithoutPassword;

export const PutRequestSchema = {
  additionalProperties: false,
  properties: {
    newPassword: passwordSchema,
    oldPassword: passwordSchema,
  },
  required: ["oldPassword", "newPassword"],
  type: "object",
};

type PutHandler = RequestHandlerAsync<Params, PutResponse, PutRequest>;

export const Put: PutHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ error: "You need to be logged in to access this route" });
    return;
  }

  const user = await req.prisma.user.findUnique({
    where: { id: req.session.userId },
  });

  if (user == null) {
    res.status(UNAUTHORIZED);
    res.json({ error: "You need to be logged in to access this route" });
    return;
  }

  const oldPasswordMatches = await compare(req.body.oldPassword, user.password);

  if (!oldPasswordMatches) {
    res.status(UNAUTHORIZED);
    res.json({ error: "Incorrect password" });
    return;
  }

  const newPasswordHash = await hash(req.body.newPassword);

  const updatedUser = await req.prisma.user.update({
    data: { password: newPasswordHash },
    where: { id: req.session.userId },
  });

  const userWithoutPassword = { ...updatedUser, password: undefined };

  res.status(OK);
  res.json(userWithoutPassword);
};
