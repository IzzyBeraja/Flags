import type { RequestHandlerAsync } from "../../../types/types";

import { OK, UNAUTHORIZED } from "../../../errors/errorCodes";

export const method = "GET";

export const route: RequestHandlerAsync = async (req, res) => {
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
