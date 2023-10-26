import type { IsAuthenticated } from "../../../middleware/route/isAuthenticated";
import type { AsyncHandler, EmptyObject, ErrorType } from "../../../types/types";

import { INTERNAL_SERVER_ERROR, OK } from "../../../errors/errorCodes";
import { sessionName } from "../../../initialize/initializeSession";
import { isAuthenticated } from "../../../middleware/route/isAuthenticated";

export const PostMiddleware = [isAuthenticated];

type PostRequest = EmptyObject;

type PostResponse = {
  message: string;
};

export type PostHandler = {
  Response: PostResponse;
  Request: PostRequest;
  Error: ErrorType;
  Middleware: IsAuthenticated;
};

export const Post: AsyncHandler<PostHandler> = async (req, res) => {
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
