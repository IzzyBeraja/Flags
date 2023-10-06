import type { Params, RequestHandlerAsync } from "../../../types/types";

import { BAD_REQUEST, CREATED, UNAUTHORIZED } from "../../../errors/errorCodes";
import { nameSchema } from "../../../validation/validationRules";

import { Prisma, type Killswitch } from "@prisma/client";

export interface PostRequest {
  name: string;
  description?: string | undefined;
  status?: boolean | undefined;
}

export const PostRequestSchema = {
  additionalProperties: false,
  properties: {
    description: { type: "string" },
    name: nameSchema,
    status: { type: "boolean" },
  },
  required: ["name", "description"],
  type: "object",
};

export type PostResponse = { error: string } | { killswitch: Killswitch };

type PostHandler = RequestHandlerAsync<Params, PostResponse, PostRequest>;

export const Post: PostHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ error: "You must be logged in to access this route" });
    return;
  }

  try {
    const killswitch = await req.prisma.killswitch.create({
      data: {
        description: req.body.description ?? null,
        name: req.body.name,
        status: req.body.status ?? false,
        userId: req.session.userId,
      },
    });

    res.status(CREATED);
    res.json({ killswitch });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.code, error.meta, error.message);
    }
    console.log(error);
  }

  res.status(BAD_REQUEST);
  res.json({ error: "Something went wrong" });
};
