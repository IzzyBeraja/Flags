import type { PrismaClient } from "@prisma/client";
import type RedisStore from "connect-redis";
import type { Application } from "express";

import { OK, UNAUTHORIZED } from "../../../../errors/errorCodes";
import middleware from "../../../../middleware/middleware";
import router from "../index.routes";

import express from "express";
import { mockDeep } from "jest-mock-extended";
import request from "supertest";

const mockRedisStore = mockDeep<RedisStore>();
const mockPrisma = mockDeep<PrismaClient>();

describe("GET /api/user/", () => {
  let app: Application;
  beforeEach(() => {
    app = express();
    middleware(app, router, mockRedisStore, mockPrisma);
  });

  describe("when NOT logged in", () => {
    it("returns unauthorized", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(UNAUTHORIZED);
    });
  });

  describe("when logged in", () => {
    beforeEach(() => {
      // Figure out how to mock session
      console.log("Mock session for logged in user");
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
