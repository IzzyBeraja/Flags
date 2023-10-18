import type { PutRequest, PutResponse } from "./../password.routes";
import type { Params } from "../../../../../types/types";
import type { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import type { DeepMockProxy } from "jest-mock-extended";

import { OK, UNAUTHORIZED } from "../../../../../errors/errorCodes";
import * as passwordUtils from "../../../../../utils/passwordFunctions";
import { Put } from "../password.routes";

import { mock, mockDeep } from "jest-mock-extended";

const compareMock = jest.spyOn(passwordUtils, "compare");
const hashMock = jest.spyOn(passwordUtils, "hash");

const next = jest.fn();

let mockPrisma: DeepMockProxy<PrismaClient>;
let req: Request<Params, PutResponse, PutRequest>;
let res: Response<PutResponse>;

describe("password.routes", () => {
  beforeEach(() => {
    mockPrisma = mockDeep<PrismaClient>();
    req = mock<Request>({ prisma: mockPrisma });
    res = mock<Response>();
  });

  describe("when NOT logged in", () => {
    it("returns unauthorized", async () => {
      await Put(req, res, next);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe("when logged in", () => {
    it("has invalid credentials", async () => {
      req.session.accountId = "1";
      req.body = { newPassword: "newPassword", oldPassword: "badPassword" };

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        createdAt: new Date("1994-11-09T00:00:00"),
        email: "email@email.com",
        id: "1",
        name: "name",
        password: "oldPassword",
        updatedAt: new Date("1994-11-09T00:00:00"),
      });

      compareMock.mockResolvedValueOnce(false);

      await Put(req, res, next);

      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("has valid credentials", async () => {
      req.session.accountId = "1";
      req.body = { newPassword: "newPassword", oldPassword: "oldPassword" };

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        createdAt: new Date("1994-11-09T00:00:00"),
        email: "email@email.com",
        id: "1",
        name: "name",
        password: "oldPassword",
        updatedAt: new Date("1994-11-09T00:00:00"),
      });

      mockPrisma.user.update.mockResolvedValueOnce({
        createdAt: new Date("1994-11-09T00:00:00"),
        email: "email@email.com",
        id: "1",
        name: "name",
        password: "newPassword",
        updatedAt: new Date("1994-11-09T00:00:00"),
      });

      compareMock.mockResolvedValueOnce(true);
      hashMock.mockResolvedValueOnce("newPassword");

      await Put(req, res, next);

      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(hashMock).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        data: { password: "newPassword" },
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        createdAt: new Date("1994-11-09T00:00:00"),
        email: "email@email.com",
        id: "1",
        name: "name",
        updatedAt: new Date("1994-11-09T00:00:00"),
      });
    });
  });
});
