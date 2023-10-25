import type { RemoveOptional } from "../../types/types";
import type { NextFunction, Request, Response } from "express";
import type { SessionData } from "express-session";

import { UNAUTHORIZED } from "../../errors/errorCodes";

export type IsAuthenticated = { session: RemoveOptional<SessionData> };

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId == null) {
    res.status(UNAUTHORIZED);
    res.json({ error: "Unauthorized", message: "Invalid credentials" });
    return;
  }

  next();
};
