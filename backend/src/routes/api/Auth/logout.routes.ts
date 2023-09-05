import type { RequestHandler } from "express";

import { BAD_REQUEST, OK } from "../../../errors/errorCodes.js";
import { sessionName } from "../../../initialize/initializeSession.js";

export const method = "POST";

export const route: RequestHandler = async (req, res) => {
  if (req.session.userId == null) {
    return res.status(BAD_REQUEST).send("You are not logged in");
  }

  //> TODO - Modify this to use async/await
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(BAD_REQUEST).send("Something went wrong");
    }

    res.clearCookie(sessionName);
    return res.status(OK).send("Logout successful");
  });
  return;
};
