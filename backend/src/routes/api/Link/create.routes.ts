import type { ParamsDictionary } from "express-serve-static-core";

import { OK } from "../../../errors/errorCodes";

import { Router } from "express";

const router = Router();

type updateInputType = {
  description: string;
  url: string;
  id: string;
};

type updateOutputType = {
  description: string | undefined;
  url: string | undefined;
  id: string;
};

router.post<ParamsDictionary, updateOutputType, updateInputType>(
  "/create",
  // validate([
  //   body("description", "A valid descrpition required").isLength({
  //     max: 50,
  //     min: 10,
  //   }),
  //   body("url", "A valid url is required").isURL(),
  //   body("id", "A valid id required").isUUID(),
  // ]),
  async (req, res) => {
    const prisma = await req.prisma.link.update({
      data: {
        description: req.body.description ?? "",
        url: req.body.url ?? "",
      },
      where: {
        id: req.body.id,
      },
    });

    return res.status(OK).json(prisma);
  }
);

export default router;
