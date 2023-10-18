import type { Switch } from "../../queries/switch/createSwitch";
import type { Error, Params, RequestHandlerAsync } from "../../types/types";

import { BAD_REQUEST, CREATED, UNAUTHORIZED } from "../../errors/errorCodes";
import { createSwitch } from "../../queries/switch/createSwitch";
import { descriptionSchema, nameSchema } from "../../validation/validationRules";

export interface PostRequest {
  name: string;
  description?: string;
  status?: boolean;
}

export type PostResponse = {
  killswitch: Switch;
};

export const PostRequestSchema = {
  additionalProperties: false,
  properties: {
    description: descriptionSchema,
    name: nameSchema,
    status: { type: "boolean" },
  },
  required: ["name"],
  type: "object",
};

type PostHandler = RequestHandlerAsync<Params, PostResponse | Error, PostRequest>;

export const Post: PostHandler = async (req, res) => {
  if (req.session.accountId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You must be logged in to access this route" });
    return;
  }

  const [killswitch, error] = await createSwitch(req.db, {
    ...req.body,
    userId: req.session.accountId, //> TODO: use userId when added to session
  });

  if (error != null) {
    res.status(BAD_REQUEST);
    res.json({ message: error.message });
    return;
  }

  res.status(CREATED);
  res.json({ killswitch });
};
