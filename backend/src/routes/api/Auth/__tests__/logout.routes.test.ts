import { INTERNAL_SERVER_ERROR, OK } from "../../../../errors/errorCodes";
import { Post } from "../logout.routes";

import { mock } from "jest-mock-extended";

const next = jest.fn();

const mockDestroy = jest.fn();

let postReq: Parameters<typeof Post>[0];
let postRes: Parameters<typeof Post>[1];

describe("/api/auth/logout", () => {
  beforeEach(() => {
    postReq = mock<typeof postReq>({ session: { destroy: mockDestroy } });
    postRes = mock<typeof postRes>();
  });

  describe("when logged in", () => {
    it("logout is successful", async () => {
      mockDestroy.mockImplementationOnce(cb => cb(null));

      await Post(postReq, postRes, next);

      expect(postReq.session.destroy).toHaveBeenCalledTimes(1);
      expect(postRes.clearCookie).toHaveBeenCalledTimes(1);
      expect(postRes.status).toHaveBeenCalledTimes(1);
      expect(postRes.status).toHaveBeenCalledWith(OK);
      expect(postRes.json).toHaveBeenCalledTimes(1);
    });

    it("logout fails gracefully", async () => {
      mockDestroy.mockImplementationOnce(cb => cb(new Error("error")));

      await Post(postReq, postRes, next);

      expect(postReq.session.destroy).toHaveBeenCalledTimes(1);
      expect(postRes.clearCookie).not.toHaveBeenCalled();
      expect(postRes.status).toHaveBeenCalledTimes(1);
      expect(postRes.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
      expect(postRes.json).toHaveBeenCalledTimes(1);
    });
  });
});
