import type { PostHandler } from "../login.routes";

import { OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import * as LoginModule from "../../../../queries/users/loginUser";
import { Post } from "../login.routes";

import { mock } from "jest-mock-extended";

const mockLogin = jest.spyOn(LoginModule, "loginUser");
const next = jest.fn();

let postReq: Parameters<PostHandler>[0];
let postRes: Parameters<PostHandler>[1];

describe("/api/auth/login", () => {
  beforeEach(() => {
    postReq = mock<typeof postReq>();
    postRes = mock<typeof postRes>();
  });

  describe("when NOT logged in", () => {
    it("has valid credentials", async () => {
      postReq.ip = "::1";

      mockLogin.mockResolvedValueOnce([
        {
          email: "fake@email.com",
          firstName: "Fake",
          lastName: "User",
          userId: "U1",
        },
        null,
      ]);

      await Post(postReq, postRes, next);

      expect(postReq.session.email).toBe("fake@email.com");
      expect(postReq.session.firstName).toBe("Fake");
      expect(postReq.session.lastName).toBe("User");
      expect(postReq.session.userId).toBe("U1");
      expect(postReq.session.ipAddress).toBe("::1");

      expect(postRes.status).toHaveBeenCalledTimes(1);
      expect(postRes.status).toHaveBeenCalledWith(OK);
      expect(postRes.json).toHaveBeenCalledTimes(1);
    });

    it("has invalid credentials", async () => {
      mockLogin.mockResolvedValueOnce([null, new Error("Invalid credentials")]);

      await Post(postReq, postRes, next);

      expect(postReq.session.email).toBeUndefined();
      expect(postReq.session.firstName).toBeUndefined();
      expect(postReq.session.lastName).toBeUndefined();
      expect(postReq.session.userId).toBeUndefined();
      expect(postReq.session.ipAddress).toBeUndefined();

      expect(postRes.status).toHaveBeenCalledTimes(1);
      expect(postRes.status).toHaveBeenCalledWith(UNAUTHORIZED);
      expect(postRes.json).toHaveBeenCalledTimes(1);
      expect(postRes.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });
  });
});
