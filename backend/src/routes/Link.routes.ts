import { CREATED, NOT_FOUND, OK } from "../errors/errorCodes";
import { validate } from "../validation/validateRequest";

import express from "express";
import { body } from "express-validator";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await req.prisma.link.findMany({
    include: { createdBy: true },
  });
  return res.json(data);
});

router.post(
  "/create",
  validate([
    body("description", "A valid description required").isLength({
      max: 50,
      min: 10,
    }),
    body("url", "A valid url is required").isURL(),
  ]),
  async (req, res) => {
    const prisma = await req.prisma.link.create({
      data: {
        createdBy: { connect: { id: "0df7ae7d-4f48-4e34-ba2a-705476c9e3ef" } },
        description: req.body["description"],
        url: req.body["url"],
      },
    });
    return res.status(CREATED).json(prisma);
  }
);

router.post(
  "/update",
  validate([
    body("description", "A valid descrpition required").isLength({
      max: 50,
      min: 10,
    }),
    body("url", "A valid url is required").isURL(),
    body("id", "A valid id required").isUUID(),
  ]),
  async (req, res) => {
    const prisma = await req.prisma.link.update({
      data: {
        description: req.body["description"] ?? undefined,
        url: req.body["url"] ?? undefined,
      },
      where: {
        id: req.body["id"],
      },
    });

    return res.status(OK).json(prisma);
  }
);

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
