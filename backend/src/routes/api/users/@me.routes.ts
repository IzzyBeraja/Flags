import type { UserWithoutPassword } from "../../../queries/User.queries";
import type { Params, RequestHandlerAsync } from "../../../types/types";

import { OK, UNAUTHORIZED } from "../../../errors/errorCodes";

export const Get: RequestHandlerAsync = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.send("You need to be logged in to access this route");
    return;
  }

  const user = await req.prisma.user.findUnique({
    where: { id: req.session.userId ?? "" },
  });

  res.status(OK);
  res.json({ ...user, password: undefined });
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
