import type { IsAuthenticated } from "../../../middleware/route/isAuthenticated";
import type { Switch } from "../../../queries/switches/createSwitch";
import type { AsyncHandler, EmptyObject, ErrorType } from "../../../types/types";

import { BAD_REQUEST, NOT_FOUND, OK } from "../../../errors/errorCodes";
import { isAuthenticated } from "../../../middleware/route/isAuthenticated";
import { getSwitch } from "../../../queries/switches/getSwitch";
import { updateSwitch } from "../../../queries/switches/updateSwitch";
import { descriptionSchema, nameSchema } from "../../../validation/validationRules";

type Params = {
  switchId: string;
};

//#region GET

export const GetMiddleware = [isAuthenticated];

type GetRequest = EmptyObject;

type GetResponse = {
  fSwitch: Switch;
};

export type GetHandler = AsyncHandler<
  Params,
  GetResponse | ErrorType,
  GetRequest,
  EmptyObject,
  IsAuthenticated
>;

export const Get: GetHandler = async (req, res) => {
  const [fSwitch, error] = await getSwitch(req.db, {
    switchId: req.params.switchId,
    userId: req.session.userId,
  });

  if (error != null) {
    res.status(NOT_FOUND);
    res.json({ message: error.message });
    return;
  }

  res.status(OK);
  res.json({ fSwitch });
};

//#endregion

//#region PATCH

export const PatchMiddleware = [isAuthenticated];

type PatchRequest = {
  name?: string;
  description?: string;
  state?: boolean;
};

type PatchResponse = {
  fSwitch: Switch;
};

export const PatchRequestSchema = {
  additionalProperties: false,
  properties: {
    description: descriptionSchema,
    name: nameSchema,
    state: { type: "boolean" },
  },
  type: "object",
};

export type PatchHandler = AsyncHandler<
  Params,
  PatchResponse | ErrorType,
  PatchRequest,
  EmptyObject,
  IsAuthenticated
>;

export const Patch: PatchHandler = async (req, res) => {
  const [fSwitch, error] = await updateSwitch(req.db, {
    ...req.body,
    switchId: req.params.switchId,
    userId: req.session.userId,
  });

  if (error != null) {
    res.status(BAD_REQUEST);
    res.json({ message: error.message });
    return;
  }

  res.status(OK);
  res.json({ fSwitch });
};

//#endregion
