import type { Params, RequestHandlerAsync } from "../../../types/types";

import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { sessionName } from "../../../initialize/initializeSession";

export const method = "POST";

export interface LogoutRequest {}

export interface LogoutResponse {
  message: string;
}

type RouteHandler = RequestHandlerAsync<Params, LogoutResponse, LogoutRequest>;

export const route: RouteHandler = async (req, res) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ message: "You must be logged in to logout" });
    return;
  }

  req.session.destroy(err => {
    if (err) {
      res.status(INTERNAL_SERVER_ERROR);
      res.json({ message: "Something went wrong" });
      return;
    }

    res.clearCookie(sessionName);
    res.status(OK);
    res.json({ message: "Logout successful" });
  });
};
