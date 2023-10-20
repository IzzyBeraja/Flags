import type { Switch } from "../../queries/switch/createSwitch";
import type { ErrorType, Params, RequestHandlerAsync } from "../../types/types";

import { BAD_REQUEST, CREATED, UNAUTHORIZED } from "../../errors/errorCodes";
import { createSwitch } from "../../queries/switch/createSwitch";
import { descriptionSchema, nameSchema } from "../../validation/validationRules";

export interface PostRequest {
  name: string;
  description?: string;
  state?: boolean;
}

export type PostResponse = {
  fSwitch: Switch;
};

export const PostRequestSchema = {
  additionalProperties: false,
  properties: {
    description: descriptionSchema,
    name: nameSchema,
    state: { type: "boolean" },
  },
  required: ["name"],
  type: "object",
};

type PostHandler = RequestHandlerAsync<Params, PostResponse | ErrorType, PostRequest>;

export const Post: PostHandler = async (req, res) => {
  if (req.session.accountId == null || req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You must be logged in to access this route" });
    return;
  }

  const [fSwitch, error] = await createSwitch(req.db, {
    ...req.body,
    userId: req.session.userId,
  });

  if (error != null) {
    res.status(BAD_REQUEST);
    res.json({ message: error.message });
    return;
  }

  res.status(CREATED);
  res.json({ fSwitch });
};
