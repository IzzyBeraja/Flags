import type { PrismaClient } from "@prisma/client";
import type { Application } from "express";

import { OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import { mockPrismaMiddleware } from "../../../../middleware/__mocks__/prisma.middleware.mock";
import { mockSessionMiddleware } from "../../../../middleware/__mocks__/session.middleware.mock";
import router from "../index.routes";

import express from "express";
import { mockDeep } from "jest-mock-extended";
import request from "supertest";

const mockPrisma = mockDeep<PrismaClient>();

describe("GET /api/user/", () => {
  let app: Application;
  beforeEach(() => {
    app = express();
  });

  describe("when NOT logged in", () => {
    beforeEach(() => {
      app.use(mockSessionMiddleware());
      app.use(mockPrismaMiddleware(mockPrisma));
      app.use(router);
    });

    it("returns unauthorized", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(UNAUTHORIZED);
    });
  });

  describe("when logged in", () => {
    beforeEach(() => {
      app.use(mockSessionMiddleware({ userId: "1" }));
      app.use(mockPrismaMiddleware(mockPrisma));
      app.use(router);
    });

    it("returns user data w/o password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        email: "email@email.com",
        id: "1",
        name: "name",
        password: "password",
      });

      const response = await request(app).get("/");

      expect(response.status).toBe(OK);
      expect(response.body).toMatchObject({
        email: "email@email.com",
        id: "1",
        name: "name",
      });
    });
  });
});
