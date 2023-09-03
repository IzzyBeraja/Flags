import express, { Router } from "express";
import request from "supertest";

const app = express();
const route = Router();

route.get("/", function (_req, res) {
  res.status(200).send("Hello World!");
});

app.use(route);

describe("GET /user", function () {
  it("responds with json", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toStrictEqual("Hello World!");
  });
});
