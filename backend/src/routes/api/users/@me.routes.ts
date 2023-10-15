import type { User } from "../../../queries/user/getUserByAccount";
import type { UserWithoutPassword } from "../../../queries/User.queries";
import type { Params, RequestHandlerAsync } from "../../../types/types";

import { NOT_FOUND, OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { getUserByAccount } from "../../../queries/user/getUserByAccount";

export interface GetRequest {}

export type GetResponse = { error: string } | { user: User };

export type GetHandler = RequestHandlerAsync<Params, GetResponse, GetRequest>;

export const Get: GetHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ error: "You need to be logged in to access this route" });
    return;
  }

  const [user, error] = await getUserByAccount(req.db, { accountId: req.session.userId });

  if (error != null) {
    res.status(NOT_FOUND);
    res.json({ error: "User was not found" });
    return;
  }

  res.status(OK);
  res.json({ user });
};

export interface PatchRequest {
  name?: string | undefined;
}

export type PatchResponse =
  | {
      error: string;
    }
  | UserWithoutPassword;

export const PatchRequestSchema = {
  additionalProperties: false,
  properties: {
    name: { type: "string" },
  },
  type: "object",
};

export type PatchHandler = RequestHandlerAsync<Params, PatchResponse, PatchRequest>;

export const Patch: PatchHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ error: "You need to be logged in to access this route" });
    return;
  }

  const user = await req.prisma.user.update({
    data: {
      ...(req.body.name != null && { name: req.body.name }),
    },
    where: { id: req.session.userId },
  });

  const userWithoutPassword = { ...user, password: undefined };

  res.status(OK);
  res.json(userWithoutPassword);
};
