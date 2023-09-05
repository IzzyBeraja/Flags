import type { RequestHandlerAsync } from "../../../types/types.js";
import type { ParamsDictionary } from "express-serve-static-core";

import { OK } from "../../../errors/errorCodes.js";

export const method = "POST";

interface CreateRequest {
  description: string;
  url: string;
  id: string;
}

interface CreateResponse {
  description: string;
  url: string;
  id: string;
}

type RouteHandler = RequestHandlerAsync<ParamsDictionary, CreateResponse, CreateRequest>;

export const route: RouteHandler = async (req, res) => {
  const prisma = await req.prisma.link.update({
    data: {
      description: req.body.description ?? "",
      url: req.body.url ?? "",
    },
    where: {
      id: req.body.id,
    },
  });

  res.status(OK).json(prisma);
  return;
};
