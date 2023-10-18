import type { Params, RequestHandlerAsync } from "../../../types/types";

import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { sessionName } from "../../../initialize/initializeSession";

export interface PostRequest {}

export interface PostResponse {
  message: string;
}

type RouteHandler = RequestHandlerAsync<Params, PostResponse, PostRequest>;

export const Post: RouteHandler = async (req, res) => {
  if (req.session.accountId == null) {
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
