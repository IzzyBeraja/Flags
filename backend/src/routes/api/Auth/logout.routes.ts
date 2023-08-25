import { BAD_REQUEST, OK } from "../../../errors/errorCodes";
import { sessionName } from "../../../middleware/session.middleware";

import { Router } from "express";

const router = Router();

router.post("/logout", (req, res) => {
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
});

export default router;
