import type { GetHandler, PatchHandler, PostHandler } from "../@me.routes";

import { NOT_FOUND, OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import * as CreateUserModule from "../../../../queries/user/createUser";
import * as GetUserModule from "../../../../queries/user/getUser";
import * as UpdateUserModule from "../../../../queries/user/updateUser";
import { Get, Patch, Post } from "../@me.routes";

import { mock } from "jest-mock-extended";

let getReq: Parameters<GetHandler>[0];
let getRes: Parameters<GetHandler>[1];

let patchReq: Parameters<PatchHandler>[0];
let patchRes: Parameters<PatchHandler>[1];

let postReq: Parameters<PostHandler>[0];
let postRes: Parameters<PostHandler>[1];

const mockGetUser = jest.spyOn(GetUserModule, "getUser");
const mockUpdateUser = jest.spyOn(UpdateUserModule, "updateUser");
const mockCreateUser = jest.spyOn(CreateUserModule, "createUser");

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
        getReq.session.accountId = "A1";

        mockGetUser.mockResolvedValue([null, new Error("User was not found")]);

        await Get(getReq, getRes, next);

        expect(mockGetUser).toHaveBeenCalledTimes(1);
        expect(mockGetUser).toHaveBeenCalledWith(getReq.db, { accountId: "A1" });
        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(NOT_FOUND);
        expect(getRes.json).toHaveBeenCalledTimes(1);
        expect(getRes.json).toHaveBeenCalledWith({ message: "User was not found" });
      });

      it("finds a user", async () => {
        getReq.session.accountId = "A1";

        mockGetUser.mockResolvedValue([
          { accountId: "A1", firstName: "Fake", lastName: "User", userId: "U1" },
          null,
        ]);

        await Get(getReq, getRes, next);

        expect(mockGetUser).toHaveBeenCalledTimes(1);
        expect(mockGetUser).toHaveBeenCalledWith(getReq.db, { accountId: "A1" });
        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(OK);
        expect(getRes.json).toHaveBeenCalledTimes(1);
        expect(getRes.json).toHaveBeenCalledWith({
          user: {
            accountId: "A1",
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
        patchReq.session.accountId = "A1";
        patchReq.body = { firstName: "Fake", lastName: "User" };

        mockUpdateUser.mockResolvedValue([
          { accountId: "A1", firstName: "Fake", lastName: "User", userId: "U1" },
          null,
        ]);

        await Patch(patchReq, patchRes, next);

        expect(mockUpdateUser).toHaveBeenCalledTimes(1);
        expect(mockUpdateUser).toHaveBeenCalledWith(patchReq.db, {
          accountId: "A1",
          firstName: "Fake",
          lastName: "User",
        });
        expect(patchRes.status).toHaveBeenCalledTimes(1);
        expect(patchRes.status).toHaveBeenCalledWith(OK);
        expect(patchRes.json).toHaveBeenCalledTimes(1);
        expect(patchRes.json).toHaveBeenCalledWith({
          user: {
            accountId: "A1",
            firstName: "Fake",
            lastName: "User",
            userId: "U1",
          },
        });
      });

      it("does not update undefined fields", async () => {
        patchReq.session.accountId = "A1";
        patchReq.body = {};

        mockUpdateUser.mockResolvedValue([
          { accountId: "A1", firstName: "Fake", lastName: "User", userId: "U1" },
          null,
        ]);

        await Patch(patchReq, patchRes, next);

        expect(mockUpdateUser).toHaveBeenCalledTimes(1);
        expect(mockUpdateUser).toHaveBeenCalledWith(patchReq.db, { accountId: "A1" });
        expect(patchRes.status).toHaveBeenCalledTimes(1);
        expect(patchRes.status).toHaveBeenCalledWith(OK);
        expect(patchRes.json).toHaveBeenCalledTimes(1);
        expect(patchRes.json).toHaveBeenCalledWith({
          user: {
            accountId: "A1",
            firstName: "Fake",
            lastName: "User",
            userId: "U1",
          },
        });
      });
    });
  });

  describe("POST", () => {
    beforeEach(() => {
      postReq = mock<typeof postReq>();
      postRes = mock<typeof postRes>();
    });

    describe("when NOT logged in", () => {
      it("returns unauthorized", async () => {
        await Post(postReq, postRes, next);

        expect(postRes.status).toHaveBeenCalledTimes(1);
        expect(postRes.status).toHaveBeenCalledWith(UNAUTHORIZED);
        expect(postRes.json).toHaveBeenCalledTimes(1);
        expect(postRes.json).toHaveBeenCalledWith({
          message: "You need to be logged in to access this route",
        });
      });
    });

    describe("when logged in", () => {
      it("creates user data", async () => {
        postReq.session.accountId = "A1";
        postReq.body = { firstName: "Fake", lastName: "User" };

        mockCreateUser.mockResolvedValue([
          { accountId: "A1", firstName: "Fake", lastName: "User", userId: "U1" },
          null,
        ]);

        await Post(postReq, postRes, next);

        expect(mockCreateUser).toHaveBeenCalledTimes(1);
        expect(mockCreateUser).toHaveBeenCalledWith(postReq.db, {
          accountId: "A1",
          firstName: "Fake",
          lastName: "User",
        });
        expect(postRes.status).toHaveBeenCalledTimes(1);
        expect(postRes.status).toHaveBeenCalledWith(OK);
        expect(postRes.json).toHaveBeenCalledTimes(1);
        expect(postRes.json).toHaveBeenCalledWith({
          user: {
            accountId: "A1",
            firstName: "Fake",
            lastName: "User",
            userId: "U1",
          },
        });
      });

      it("doesn't include undefined fields", async () => {
        postReq.session.accountId = "A1";
        postReq.body = {};

        mockCreateUser.mockResolvedValue([
          { accountId: "A1", firstName: null, lastName: null, userId: "U1" },
          null,
        ]);

        await Post(postReq, postRes, next);

        expect(mockCreateUser).toHaveBeenCalledTimes(1);
        expect(mockCreateUser).toHaveBeenCalledWith(postReq.db, { accountId: "A1" });
        expect(postRes.status).toHaveBeenCalledTimes(1);
        expect(postRes.status).toHaveBeenCalledWith(OK);
        expect(postRes.json).toHaveBeenCalledTimes(1);
        expect(postRes.json).toHaveBeenCalledWith({
          user: {
            accountId: "A1",
            firstName: null,
            lastName: null,
            userId: "U1",
          },
        });
      });
    });
  });
});
