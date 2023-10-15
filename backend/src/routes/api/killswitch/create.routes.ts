import type { Killswitch } from "../../../queries/killswitch/createKillswitch";
import type { Params, RequestHandlerAsync } from "../../../types/types";

import { BAD_REQUEST, CREATED, UNAUTHORIZED } from "../../../errors/errorCodes";
import { createKillswitch } from "../../../queries/killswitch/createKillswitch";
import { nameSchema } from "../../../validation/validationRules";

export interface PostRequest {
  name: string;
  description?: string;
  status?: boolean;
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

  const [killswitch, error] = await createKillswitch(req.db, {
    ...req.body,
    userId: req.session.userId,
  });

  if (error != null) {
    res.status(BAD_REQUEST);
    res.json({ error: error.message });
    return;
  }

  res.status(CREATED);
  res.json({ killswitch });
};
