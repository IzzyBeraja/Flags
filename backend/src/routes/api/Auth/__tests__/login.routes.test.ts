import type { Params } from "../../../../types/types";
import type { LoginRequest, LoginResponse } from "../login.routes";
import type { Request, Response } from "express";

import { OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import * as UserQueries from "../../../../queries/User.queries";
import { Post } from "../login.routes";

import { mock } from "jest-mock-extended";

const loginUserMock = jest.spyOn(UserQueries, "loginUser");
const next = jest.fn();

let req: Request<Params, LoginResponse, LoginRequest>;
let res: Response<LoginResponse>;

describe("/api/auth/login", () => {
  beforeEach(() => {
    req = mock<Request>();
    res = mock<Response>();
  });

  describe("when NOT logged in", () => {
    it("has valid credentials", async () => {
      loginUserMock.mockResolvedValueOnce({
        success: true,
        user: {
          createdAt: new Date("1994-11-09T00:00:00"),
          email: "email@email.com",
          id: "1",
          name: "name",
          updatedAt: new Date("1994-11-09T00:00:00"),
        },
      });

      await Post(req, res, next);

      expect(req.session.userId).toBe("1");
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("has invalid credentials", async () => {
      loginUserMock.mockResolvedValueOnce({
        error: "Bad email and password combination",
        success: false,
      });

      await Post(req, res, next);

      expect(req.session.userId).toBeUndefined();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
});
