import type { GetHandler, PatchHandler } from "../@me.routes";

import { NOT_FOUND, OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import * as GetUserModule from "../../../../queries/users/getUser";
import * as UpdateUserModule from "../../../../queries/users/updateUser";
import { Get, Patch } from "../@me.routes";

import { mock } from "jest-mock-extended";

let getReq: Parameters<GetHandler>[0];
let getRes: Parameters<GetHandler>[1];

let patchReq: Parameters<PatchHandler>[0];
let patchRes: Parameters<PatchHandler>[1];

const mockGetUser = jest.spyOn(GetUserModule, "getUser");
const mockUpdateUser = jest.spyOn(UpdateUserModule, "updateUser");

const next = jest.fn();

describe("@me.routes", () => {
  describe("GET", () => {
    beforeEach(() => {
      getReq = mock<typeof getReq>();
      getRes = mock<typeof getRes>();
    });

    describe("when NOT logged in", () => {
      it("returns unauthorized", async () => {
        await Get(getReq, getRes, next);

        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(UNAUTHORIZED);
      });
    });

    describe("when logged in", () => {
      it("does not find a user", async () => {
        getReq.session.userId = "U1";

        mockGetUser.mockResolvedValue([null, new Error("User was not found")]);

        await Get(getReq, getRes, next);

        expect(mockGetUser).toHaveBeenCalledTimes(1);
        expect(mockGetUser).toHaveBeenCalledWith(getReq.db, { userId: "U1" });
        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(NOT_FOUND);
        expect(getRes.json).toHaveBeenCalledTimes(1);
        expect(getRes.json).toHaveBeenCalledWith({ message: "User was not found" });
      });

      it("finds a user", async () => {
        getReq.session.userId = "U1";

        mockGetUser.mockResolvedValue([
          { email: "fake@email.com", firstName: "Fake", lastName: "User", userId: "U1" },
          null,
        ]);

        await Get(getReq, getRes, next);

        expect(mockGetUser).toHaveBeenCalledTimes(1);
        expect(mockGetUser).toHaveBeenCalledWith(getReq.db, { userId: "U1" });
        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(OK);
        expect(getRes.json).toHaveBeenCalledTimes(1);
        expect(getRes.json).toHaveBeenCalledWith({
          user: {
            email: "fake@email.com",
            firstName: "Fake",
            lastName: "User",
            userId: "U1",
          },
        });
      });
    });
  });

  describe("PATCH", () => {
    beforeEach(() => {
      patchReq = mock<typeof patchReq>();
      patchRes = mock<typeof patchRes>();
    });

    describe("when NOT logged in", () => {
      it("returns unauthorized", async () => {
        await Patch(patchReq, patchRes, next);

        expect(patchRes.status).toHaveBeenCalledTimes(1);
        expect(patchRes.status).toHaveBeenCalledWith(UNAUTHORIZED);
        expect(patchRes.json).toHaveBeenCalledTimes(1);
        expect(patchRes.json).toHaveBeenCalledWith({
          message: "You need to be logged in to access this route",
        });
      });
    });

    describe("when logged in", () => {
      it("updates user data", async () => {
        patchReq.session.userId = "U1";
        patchReq.body = { firstName: "Fake", lastName: "User" };

        mockUpdateUser.mockResolvedValue([
          { email: "fake@email.com", firstName: "Fake", lastName: "User", userId: "U1" },
          null,
        ]);

        await Patch(patchReq, patchRes, next);

        expect(mockUpdateUser).toHaveBeenCalledTimes(1);
        expect(mockUpdateUser).toHaveBeenCalledWith(patchReq.db, {
          firstName: "Fake",
          lastName: "User",
          userId: "U1",
        });
        expect(patchRes.status).toHaveBeenCalledTimes(1);
        expect(patchRes.status).toHaveBeenCalledWith(OK);
        expect(patchRes.json).toHaveBeenCalledTimes(1);
        expect(patchRes.json).toHaveBeenCalledWith({
          user: {
            email: "fake@email.com",
            firstName: "Fake",
            lastName: "User",
            userId: "U1",
          },
        });
      });

      it("does not update undefined fields", async () => {
        patchReq.session.userId = "U1";
        patchReq.body = {};

        mockUpdateUser.mockResolvedValue([
          { email: "fake@email.com", firstName: "Fake", lastName: "User", userId: "U1" },
          null,
        ]);

        await Patch(patchReq, patchRes, next);

        expect(mockUpdateUser).toHaveBeenCalledTimes(1);
        expect(mockUpdateUser).toHaveBeenCalledWith(patchReq.db, { userId: "U1" });
        expect(patchRes.status).toHaveBeenCalledTimes(1);
        expect(patchRes.status).toHaveBeenCalledWith(OK);
        expect(patchRes.json).toHaveBeenCalledTimes(1);
        expect(patchRes.json).toHaveBeenCalledWith({
          user: {
            email: "fake@email.com",
            firstName: "Fake",
            lastName: "User",
            userId: "U1",
          },
        });
      });
    });
  });
});
