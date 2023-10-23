import type { Switch } from "../../../queries/switches/createSwitch";
import type { EmptyObject, ErrorType, RequestHandlerAsync } from "../../../types/types";

import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { getSwitch } from "../../../queries/switches/getSwitch";
import { updateSwitch } from "../../../queries/switches/updateSwitch";
import { descriptionSchema, nameSchema } from "../../../validation/validationRules";

type Params = {
  switchId: string;
};

//#region GET

type GetRequest = EmptyObject;

type GetResponse = {
  fSwitch: Switch;
};

export type GetHandler = RequestHandlerAsync<Params, GetResponse | ErrorType, GetRequest>;

export const Get: GetHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You must be logged in to access this route" });
    return;
  }

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

export type PatchHandler = RequestHandlerAsync<Params, PatchResponse | ErrorType, PatchRequest>;

export const Patch: PatchHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You must be logged in to access this route" });
    return;
  }

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
