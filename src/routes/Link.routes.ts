import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../errors/errorCodes";

import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await req.prisma.link.findMany({
    include: { createdBy: true },
  });
  return res.json(data);
});

router.post("/create", async (req, res) => {
  if (!req.body["description"] || !req.body["url"]) {
    return res.status(BAD_REQUEST).send("Bad Request");
  }

  const prisma = await req.prisma.link.create({
    data: {
      createdBy: { connect: { id: "0df7ae7d-4f48-4e34-ba2a-705476c9e3ef" } },
      description: req.body["description"],
      url: req.body["url"],
    },
  });
  return res.status(CREATED).json(prisma);
});

router.post("/update", async (req, res) => {
  if (!req.body["description"] && !req.body["url"]) {
    return res
      .status(BAD_REQUEST)
      .send("Either a descrption or url must be provided to update a post");
  }

  if (!req.body["id"]) {
    return res
      .status(BAD_REQUEST)
      .send("A valid id must be provided to update a post");
  }

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
});

router.delete("/delete", async (req, res) => {
  if (!req.body["id"]) {
    return res
      .status(BAD_REQUEST)
      .send("A valid id must be provided to delete a post");
  }

  //> TODO - Handle all of the error codes with proper error messages
  try {
    const prisma = await req.prisma.link.delete({
      where: { id: req.body["id"] },
    });

    return res.status(OK).json(prisma);
  } catch (err) {
    return res
      .status(NOT_FOUND)
      .send("The post with the id provided was not found");
  }
});

export default router;
