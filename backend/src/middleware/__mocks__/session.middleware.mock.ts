import type { NextFunction, Request, Response } from "express";
import type { SessionData } from "express-session";

export const mockSessionMiddleware =
  (session?: Partial<SessionData>) => (req: Request, _res: Response, next: NextFunction) => {
    req.session = {
      cookie: {
        originalMaxAge: null,
      },
      destroy: jest.fn(),
      id: "1",
      regenerate: jest.fn(),
      reload: jest.fn(),
      resetMaxAge: jest.fn(),
      save: jest.fn(),
      touch: jest.fn(),
      ...session,
    };
    next();
  };
