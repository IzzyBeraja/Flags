import { NOT_FOUND, OK } from "../../../errors/errorCodes";
import { validate } from "../../../validation/validateRequest";

import { Router } from "express";
import { body } from "express-validator";

const router = Router();

router.delete(
  "/delete",
  validate([body("id", "A valid id required").isUUID()]),
  async (req, res) => {
    //> TODO - Handle all of the error codes with proper error messages
    try {
      const prisma = await req.prisma.link.delete({
        where: { id: req.body["id"] },
      });

      return res.status(OK).json(prisma);
    } catch (err) {
      return res.status(NOT_FOUND).send("The post with the id provided was not found");
    }
  }
);

export default router;
