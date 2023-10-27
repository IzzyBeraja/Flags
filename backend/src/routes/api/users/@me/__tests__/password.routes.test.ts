import { BAD_REQUEST, OK } from "../../../../../errors/errorCodes";
import * as UpadateUserCredentialsModule from "../../../../../queries/users/updateUserCredentials";
import { Put } from "../password.routes";

import { mock } from "jest-mock-extended";

const mockUpdateUserCredentials = jest.spyOn(UpadateUserCredentialsModule, "updateUserCredentials");

const next = jest.fn();

let putReq: Parameters<typeof Put>[0];
let putRes: Parameters<typeof Put>[1];

describe("password.routes", () => {
  beforeEach(() => {
    putReq = mock<typeof putReq>();
    putRes = mock<typeof putRes>();
  });

  describe("when logged in", () => {
    it("has invalid credentials", async () => {
      putReq.session.userId = "U1";
      putReq.body = { newPassword: "newPassword", oldPassword: "badPassword" };

      mockUpdateUserCredentials.mockResolvedValueOnce([null, new Error("Invalid credentials")]);

      await Put(putReq, putRes, next);

      expect(mockUpdateUserCredentials).toHaveBeenCalledTimes(1);
      expect(mockUpdateUserCredentials).toHaveBeenCalledWith(putReq.db, {
        newPassword: "newPassword",
        oldPassword: "badPassword",
        userId: "U1",
      });
      expect(putRes.status).toHaveBeenCalledTimes(1);
      expect(putRes.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(putRes.json).toHaveBeenCalledTimes(1);
      expect(putRes.json).toHaveBeenCalledWith({ message: "Invalid email password combination" });
    });

    it("has valid credentials", async () => {
      putReq.session.userId = "U1";
      putReq.body = { newPassword: "newPassword", oldPassword: "oldPassword" };

      mockUpdateUserCredentials.mockResolvedValueOnce([
        {
          email: "email",
          firstName: "firstName",
          lastName: "lastName",
          userId: "U1",
        },
        null,
      ]);

      await Put(putReq, putRes, next);

      expect(mockUpdateUserCredentials).toHaveBeenCalledTimes(1);
      expect(mockUpdateUserCredentials).toHaveBeenCalledWith(putReq.db, {
        newPassword: "newPassword",
        oldPassword: "oldPassword",
        userId: "U1",
      });
      expect(putRes.status).toHaveBeenCalledTimes(1);
      expect(putRes.status).toHaveBeenCalledWith(OK);
      expect(putRes.json).toHaveBeenCalledTimes(1);
      expect(putRes.json).toHaveBeenCalledWith({
        user: {
          email: "email",
          firstName: "firstName",
          lastName: "lastName",
          userId: "U1",
        },
      });
    });
  });
});
