import type { Params } from "../../../../types/types";
import type { PatchRequest, PatchResponse } from "../@me.routes";
import type { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { DeepMockProxy } from "jest-mock-extended";

import { OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import { Get, Patch } from "../@me.routes";

import { mock, mockDeep } from "jest-mock-extended";

let mockPrisma: DeepMockProxy<PrismaClient>;
let getReq: Request;
let getRes: Response;
let patchReq: Request<Params, PatchResponse, PatchRequest>;
let patchRes: Response<PatchResponse>;
let next: NextFunction;

describe("@me.routes", () => {
  beforeEach(() => {
    mockPrisma = mockDeep<PrismaClient>();
    next = jest.fn();
  });

  describe("GET", () => {
    beforeEach(() => {
      getReq = mock<Request>({ prisma: mockPrisma });
      getRes = mock<Response>();
    });

    describe("when NOT logged in", () => {
      it("returns unauthorized", async () => {
        await Get(getReq, getRes, next);

        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(UNAUTHORIZED);
      });
    });

    describe("when logged in", () => {
      it("returns user data w/o password", async () => {
        getReq.session.userId = "1";

        mockPrisma.user.findUnique.mockResolvedValue({
          createdAt: new Date("1994-11-09T00:00:00"),
          email: "email@email.com",
          id: "1",
          name: "name",
          password: "password",
          updatedAt: new Date("1994-11-09T00:00:00"),
        });

        await Get(getReq, getRes, next);

        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(OK);
        expect(getRes.json).toHaveBeenCalledTimes(1);
        expect(getRes.json).toHaveBeenCalledWith({
          createdAt: new Date("1994-11-09T00:00:00"),
          email: "email@email.com",
          id: "1",
          name: "name",
          updatedAt: new Date("1994-11-09T00:00:00"),
        });
      });
    });
  });

  describe("PATCH", () => {
    beforeEach(() => {
      patchReq = mock<Request>({ prisma: mockPrisma });
      patchRes = mock<Response>();
    });

    describe("when NOT logged in", () => {
      it("returns unauthorized", async () => {
        await Patch(patchReq, patchRes, next);

        expect(patchRes.status).toHaveBeenCalledTimes(1);
        expect(patchRes.status).toHaveBeenCalledWith(UNAUTHORIZED);
        expect(patchRes.json).toHaveBeenCalledTimes(1);
      });
    });

    describe("when logged in", () => {
      it("updates user data", async () => {
        patchReq.session.userId = "1";
        patchReq.body = { name: "name2" };

        mockPrisma.user.update.mockResolvedValue({
          createdAt: new Date("1994-11-09T00:00:00"),
          email: "email@email.com",
          id: "1",
          name: "name2",
          password: "password",
          updatedAt: new Date("1994-11-09T00:00:00"),
        });

        await Patch(patchReq, patchRes, next);

        expect(patchRes.status).toHaveBeenCalledTimes(1);
        expect(patchRes.status).toHaveBeenCalledWith(OK);
        expect(patchRes.json).toHaveBeenCalledTimes(1);
        expect(patchRes.json).toHaveBeenCalledWith({
          createdAt: new Date("1994-11-09T00:00:00"),
          email: "email@email.com",
          id: "1",
          name: "name2",
          updatedAt: new Date("1994-11-09T00:00:00"),
        });
      });

      it("does not update null fields", async () => {
        patchReq.session.userId = "1";
        patchReq.body = { name: undefined };

        mockPrisma.user.update.mockResolvedValue({
          createdAt: new Date("1994-11-09T00:00:00"),
          email: "email@email.com",
          id: "1",
          name: "name",
          password: "password",
          updatedAt: new Date("1994-11-09T00:00:00"),
        });

        await Patch(patchReq, patchRes, next);

        expect(patchRes.status).toHaveBeenCalledTimes(1);
        expect(patchRes.status).toHaveBeenCalledWith(OK);
        expect(patchRes.json).toHaveBeenCalledTimes(1);
        expect(patchRes.json).toHaveBeenCalledWith({
          createdAt: new Date("1994-11-09T00:00:00"),
          email: "email@email.com",
          id: "1",
          name: "name",
          updatedAt: new Date("1994-11-09T00:00:00"),
        });

        expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          data: {},
          where: { id: "1" },
        });
      });
    });
  });
});
