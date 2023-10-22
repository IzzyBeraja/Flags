import type { Params } from "../../../../types/types";
import type { PostRequest, PostResponse } from "../register.routes";
import type { Request, Response } from "express";

import { BAD_REQUEST, CREATED } from "../../../../errors/errorCodes";
import * as RegisterModule from "../../../../queries/account/registerAccount";
import { Post } from "../register.routes";

import { mock } from "jest-mock-extended";

const mockRegisterAccount = jest.spyOn(RegisterModule, "registerAccount");
const next = jest.fn();

let req: Request<Params, PostResponse, PostRequest>;
let res: Response<PostResponse>;

describe("/api/auth/register", () => {
  beforeEach(() => {
    req = mock<Request>();
    res = mock<Response>();
  });

  it("registration successful", async () => {
    mockRegisterAccount.mockResolvedValueOnce([
      {
        accountId: "A1",
        created_at: "1",
        email: "fake@email.com",
        updated_at: "1",
      },
      null,
    ]);

    await Post(req, res, next);

    expect(req.session.accountId).toBe("A1");
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(CREATED);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it("registration failed", async () => {
    mockRegisterAccount.mockResolvedValueOnce([null, new Error("Invalid credentials")]);

    await Post(req, res, next);

    expect(req.session.accountId).toBeUndefined();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
