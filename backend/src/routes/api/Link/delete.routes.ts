import { NOT_FOUND, OK } from "../../../errors/errorCodes.js";

import { Router } from "express";

const router = Router();

router.delete("/delete", async (req, res) => {
  //> TODO - Handle all of the error codes with proper error messages
  try {
    const prisma = await req.prisma.link.delete({
      where: { id: req.body["id"] },
    });

    return res.status(OK).json(prisma);
  } catch (err) {
    return res.status(NOT_FOUND).send("The post with the id provided was not found");
  }
});

export default router;
