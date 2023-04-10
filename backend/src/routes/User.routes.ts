import { OK, UNAUTHORIZED } from "../errors/errorCodes";

import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  if (req.session.userId == null) {
    return res
      .status(UNAUTHORIZED)
      .send("You need to be logged in to access this route");
  }

  const user = await req.prisma.user.findUnique({
    where: { id: req.session.userId },
  });
  return res.status(OK).json({ ...user, password: undefined });
});

export default router;
