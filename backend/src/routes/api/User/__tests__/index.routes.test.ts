import type { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { DeepMockProxy } from "jest-mock-extended";

import { OK } from "../../../../errors/errorCodes";
import { route } from "../index.routes";

import { mock, mockDeep } from "jest-mock-extended";

let mockPrisma: DeepMockProxy<PrismaClient>;
let req: Request;
let res: Response;
let next: NextFunction;

describe("GET /api/user/", () => {
  beforeEach(() => {
    mockPrisma = mockDeep<PrismaClient>();
    req = mock<Request>({ prisma: mockPrisma });
    res = mock<Response>();
    next = jest.fn();
  });

  describe("when NOT logged in", () => {
    it("returns unauthorized", async () => {
      await route(req, res, next);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("when logged in", () => {
    it("returns user data w/o password", async () => {
      req.session.userId = "1";

      mockPrisma.user.findUnique.mockResolvedValue({
        email: "email@email.com",
        id: "1",
        name: "name",
        password: "password",
      });

      await route(req, res, next);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        email: "email@email.com",
        id: "1",
        name: "name",
      });
    });
  });
});
