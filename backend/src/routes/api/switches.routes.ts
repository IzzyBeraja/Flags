import type { Switch } from "../../queries/switches/createSwitch";
import type { EmptyObject, ErrorType, Params, RequestHandlerAsync } from "../../types/types";

import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../../errors/errorCodes";
import { createSwitch } from "../../queries/switches/createSwitch";
import { getSwitches } from "../../queries/switches/getSwitch";
import { descriptionSchema, nameSchema } from "../../validation/validationRules";

//#region GET

type GetRequest = EmptyObject;

type GetResponse = {
  switches: Switch[];
};

export type GetHandler = RequestHandlerAsync<Params, GetResponse | ErrorType, GetRequest>;

export const Get: GetHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You must be logged in to access this route" });
    return;
  }

  const [switches, error] = await getSwitches(req.db, {
    userId: req.session.userId,
  });

  if (error != null) {
    res.status(BAD_REQUEST);
    res.json({ message: error.message });
    return;
  }

  res.status(OK);
  res.json({ switches });
};

//#endregion

//#region POST

type PostRequest = {
  name: string;
  description?: string;
  state?: boolean;
};

type PostResponse = {
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

export type PostHandler = RequestHandlerAsync<Params, PostResponse | ErrorType, PostRequest>;

export const Post: PostHandler = async (req, res) => {
  if (req.session.userId == null) {
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

//#endregion
