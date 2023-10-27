import type { IsAuthenticated } from "./../../middleware/route/isAuthenticated";
import type { Switch } from "../../queries/switches/createSwitch";
import type { AsyncHandler, EmptyObject, ErrorType } from "../../types/types";

import { BAD_REQUEST, CREATED, OK } from "../../errors/errorCodes";
import { isAuthenticated } from "../../middleware/route/isAuthenticated";
import { createSwitch } from "../../queries/switches/createSwitch";
import { getSwitches } from "../../queries/switches/getSwitch";
import { descriptionSchema, nameSchema } from "../../validation/validationRules";

//#region GET

export const GetMiddleware = [isAuthenticated];

type GetRequest = EmptyObject;

type GetResponse = {
  switches: Switch[];
};

type GetHandler = {
  Response: GetResponse;
  Error: ErrorType;
  Request: GetRequest;
  Middleware: IsAuthenticated;
};

export const Get: AsyncHandler<GetHandler> = async (req, res) => {
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

export const PostMiddleware = [isAuthenticated];

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

type PostHandler = {
  Request: PostRequest;
  Response: PostResponse | ErrorType;
  Middleware: IsAuthenticated;
};

export const Post: AsyncHandler<PostHandler> = async (req, res) => {
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
