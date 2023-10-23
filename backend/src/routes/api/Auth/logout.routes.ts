import type { EmptyObject, Params, RequestHandlerAsync } from "../../../types/types";

import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "../../../errors/errorCodes";
import { sessionName } from "../../../initialize/initializeSession";

type PostRequest = EmptyObject;

type PostResponse = {
  message: string;
};

export type PostHandler = RequestHandlerAsync<Params, PostResponse, PostRequest>;

export const Post: PostHandler = async (req, res) => {
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
