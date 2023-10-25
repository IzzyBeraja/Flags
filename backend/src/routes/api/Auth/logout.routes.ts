import type { IsAuthenticated } from "../../../middleware/route/isAuthenticated";
import type { AsyncHandler, EmptyObject, Params } from "../../../types/types";

import { INTERNAL_SERVER_ERROR, OK } from "../../../errors/errorCodes";
import { sessionName } from "../../../initialize/initializeSession";
import { isAuthenticated } from "../../../middleware/route/isAuthenticated";

export const PostMiddleware = [isAuthenticated];

type PostRequest = EmptyObject;

type PostResponse = {
  message: string;
};

export type PostHandler = AsyncHandler<
  Params,
  PostResponse,
  PostRequest,
  EmptyObject,
  IsAuthenticated
>;

export const Post: PostHandler = async (req, res) => {
  req.session.destroy((err: unknown) => {
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
