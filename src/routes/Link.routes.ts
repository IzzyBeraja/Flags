import { BAD_REQUEST } from "../errors/errorCodes";

import express from "express";

const router = express.Router();

router.get("/getPost", async (req, res) => {
  const data = await req.prisma.link.findMany({
    include: { createdBy: true },
  });
  res.json(data);
});

router.post("/createPost", async (req, res) => {
  if (!req.body["description"] || !req.body["url"]) {
    res.status(BAD_REQUEST).send("Bad Request");
  }

  // const response = await req.prisma.link.create({
  //   data: {
  //     createdBy: { connect: { id: "0df7ae7d-4f48-4e34-ba2a-705476c9e3ef" } },
  //     description: req.body["description"],
  //     url: req.body["url"],
  //   },
  //   include: { createdBy: true },
  // });
  res.json("HelloWorld");
});

export default router;
