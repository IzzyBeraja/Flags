import type { Request, Response } from "express";

import { BAD_REQUEST, CREATED } from "../../../../errors/errorCodes";
import * as RegisterUser from "../../../../queries/users/registerUser";
import { Post } from "../register.routes";

import { mock } from "jest-mock-extended";

const mockRegisterUser = jest.spyOn(RegisterUser, "registerUser");
const next = jest.fn();

let postReq: Parameters<typeof Post>[0];
let postRes: Parameters<typeof Post>[1];

describe("/api/auth/register", () => {
  beforeEach(() => {
    postReq = mock<Request>();
    postRes = mock<Response>();
  });

  it("registration successful", async () => {
    mockRegisterUser.mockResolvedValueOnce([
      {
        email: "fake@email.com",
        firstName: "Fake",
        lastName: "User",
        userId: "U1",
      },
      null,
    ]);

    await Post(postReq, postRes, next);

    expect(postReq.session.userId).toBe("U1");
    expect(postRes.status).toHaveBeenCalledTimes(1);
    expect(postRes.status).toHaveBeenCalledWith(CREATED);
    expect(postRes.json).toHaveBeenCalledTimes(1);
  });

  it("registration failed", async () => {
    mockRegisterUser.mockResolvedValueOnce([null, new Error("Invalid credentials")]);

    await Post(postReq, postRes, next);

    expect(postReq.session.userId).toBeUndefined();
    expect(postRes.status).toHaveBeenCalledTimes(1);
    expect(postRes.status).toHaveBeenCalledWith(BAD_REQUEST);
    expect(postRes.json).toHaveBeenCalledTimes(1);
    expect(postRes.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    expect(postRes.json).toHaveBeenCalledTimes(1);
  });
});
