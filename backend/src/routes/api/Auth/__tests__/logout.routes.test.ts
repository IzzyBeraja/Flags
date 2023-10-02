import type { Params } from "../../../../types/types";
import type { PostRequest, PostResponse } from "../logout.routes";
import type { Request, Response } from "express";

import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import { Post } from "../logout.routes";

import { mock } from "jest-mock-extended";

const next = jest.fn();

const mockDestroy = jest.fn();

let req: Request<Params, PostResponse, PostRequest>;
let res: Response<PostResponse>;

describe("/api/auth/logout", () => {
  beforeEach(() => {
    req = mock<Request>({ session: { destroy: mockDestroy } });
    res = mock<Response>();
  });

  describe("when NOT logged in", () => {
    it("returns an error", async () => {
      req.session.userId = undefined;

      await Post(req, res, next);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe("when logged in", () => {
    it("logout is successful", async () => {
      req.session.userId = "1";
      mockDestroy.mockImplementationOnce(cb => cb(null));

      await Post(req, res, next);

      expect(req.session.destroy).toHaveBeenCalledTimes(1);
      expect(res.clearCookie).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("logout fails gracefully", async () => {
      req.session.userId = "1";
      mockDestroy.mockImplementationOnce(cb => cb(new Error("error")));

      await Post(req, res, next);

      expect(req.session.destroy).toHaveBeenCalledTimes(1);
      expect(res.clearCookie).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
});
