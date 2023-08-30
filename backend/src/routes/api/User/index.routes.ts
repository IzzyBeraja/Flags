import { OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { validateSchema } from "../../../validation/validateRequest";

import { Router } from "express";
import { v4 as createUUID } from "uuid";

const router = Router();

export const route_id = createUUID();
export const requestSchema = {};

router.get("/", validateSchema(route_id), async (req, res) => {
  if (req.session.userId == null) {
    return res.status(UNAUTHORIZED).send("You need to be logged in to access this route");
  }

  const user = await req.prisma.user.findUnique({
    where: { id: req.session.userId },
  });
  return res.status(OK).json({ ...user, password: undefined });
});

export default router;
