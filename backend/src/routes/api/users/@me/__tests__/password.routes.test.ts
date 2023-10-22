import type { PutHandler } from "./../password.routes";

import { BAD_REQUEST, OK, UNAUTHORIZED } from "../../../../../errors/errorCodes";
import * as UpadateAccountCredentialsModule from "../../../../../queries/account/updateAccountCredentials";
import { Put } from "../password.routes";

import { mock } from "jest-mock-extended";

const mockUpdateAccountCredentials = jest.spyOn(
  UpadateAccountCredentialsModule,
  "updateAccountCredentials"
);

const next = jest.fn();

let putReq: Parameters<PutHandler>[0];
let putRes: Parameters<PutHandler>[1];

describe("password.routes", () => {
  beforeEach(() => {
    putReq = mock<typeof putReq>();
    putRes = mock<typeof putRes>();
  });

  describe("when NOT logged in", () => {
    it("returns unauthorized", async () => {
      await Put(putReq, putRes, next);

      expect(putRes.status).toHaveBeenCalledTimes(1);
      expect(putRes.status).toHaveBeenCalledWith(UNAUTHORIZED);
      expect(putRes.json).toHaveBeenCalledTimes(1);
    });
  });

  describe("when logged in", () => {
    it("has invalid credentials", async () => {
      putReq.session.accountId = "A1";
      putReq.body = { newPassword: "newPassword", oldPassword: "badPassword" };

      mockUpdateAccountCredentials.mockResolvedValueOnce([null, new Error("Invalid credentials")]);

      await Put(putReq, putRes, next);

      expect(mockUpdateAccountCredentials).toHaveBeenCalledTimes(1);
      expect(mockUpdateAccountCredentials).toHaveBeenCalledWith(putReq.db, {
        accountId: "A1",
        newPassword: "newPassword",
        oldPassword: "badPassword",
      });
      expect(putRes.status).toHaveBeenCalledTimes(1);
      expect(putRes.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(putRes.json).toHaveBeenCalledTimes(1);
      expect(putRes.json).toHaveBeenCalledWith({ message: "Invalid email password combination" });
    });

    it("has valid credentials", async () => {
      putReq.session.accountId = "1";
      putReq.body = { newPassword: "newPassword", oldPassword: "oldPassword" };

      mockUpdateAccountCredentials.mockResolvedValueOnce([
        {
          accountId: "A1",
          createdAt: "1",
          email: "email",
          updatedAt: "U1",
        },
        null,
      ]);

      await Put(putReq, putRes, next);

      expect(mockUpdateAccountCredentials).toHaveBeenCalledTimes(1);
      expect(mockUpdateAccountCredentials).toHaveBeenCalledWith(putReq.db, {
        accountId: "1",
        newPassword: "newPassword",
        oldPassword: "oldPassword",
      });
      expect(putRes.status).toHaveBeenCalledTimes(1);
      expect(putRes.status).toHaveBeenCalledWith(OK);
      expect(putRes.json).toHaveBeenCalledTimes(1);
      expect(putRes.json).toHaveBeenCalledWith({
        account: {
          accountId: "A1",
          createdAt: "1",
          email: "email",
          updatedAt: "U1",
        },
      });
    });
  });
});
