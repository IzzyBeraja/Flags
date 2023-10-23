import type { Switch } from "../../../queries/switches/createSwitch";
import type { ErrorType, RequestHandlerAsync } from "../../../types/types";

import { BAD_REQUEST, OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { getSwitch } from "../../../queries/switches/getSwitch";
import { updateSwitch } from "../../../queries/switches/updateSwitch";
import { descriptionSchema, nameSchema } from "../../../validation/validationRules";

export interface Params {
  switchId: string;
}

export interface GetRequest {}

export type GetResponse = {
  fSwitch: Switch;
};

type GetHandler = RequestHandlerAsync<Params, GetResponse | ErrorType, GetRequest>;

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
    res.status(BAD_REQUEST);
    res.json({ message: error.message });
    return;
  }

  res.status(OK);
  res.json({ fSwitch });
};

export interface PatchRequest {
  name?: string;
  description?: string;
  state?: boolean;
}

export type PatchResponse = {
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

type PatchHandler = RequestHandlerAsync<Params, PatchResponse | ErrorType, PatchRequest>;

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
