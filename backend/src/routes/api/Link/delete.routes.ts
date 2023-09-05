import type { RequestHandlerAsync } from "../../../types/types.js";
import type { ParamsDictionary } from "express-serve-static-core";

import { NOT_FOUND, OK } from "../../../errors/errorCodes.js";

import { Router } from "express";

const router = Router();

export const method = "DELETE";

interface DeleteRequest {
  id: string;
}

interface DeleteResponse {}

type RouteHandler = RequestHandlerAsync<ParamsDictionary, DeleteResponse, DeleteRequest>;

export const route: RouteHandler = async (req, res) => {
  //> TODO - Handle all of the error codes with proper error messages
  try {
    const prisma = await req.prisma.link.delete({
      where: { id: req.body["id"] },
    });

    res.status(OK).json(prisma);
    return;
  } catch (err) {
    res.status(NOT_FOUND).send("The post with the id provided was not found");
    return;
  }
};

export default router;
