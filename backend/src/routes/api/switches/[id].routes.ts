import type { Switch } from "../../../queries/switch/createSwitch";
import type { ErrorType, RequestHandlerAsync } from "../../../types/types";

import { BAD_REQUEST, OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { getSwitch } from "../../../queries/switch/getSwitch";

export interface GetParams {
  id: string;
}

export interface GetRequest {}

export type GetResponse = {
  fSwitch: Switch;
};

type GetHandler = RequestHandlerAsync<GetParams, GetResponse | ErrorType, GetRequest>;

export const Get: GetHandler = async (req, res) => {
  if (req.session.accountId == null || req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You must be logged in to access this route" });
    return;
  }

  const [fSwitch, error] = await getSwitch(req.db, {
    switchId: req.params.id,
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
