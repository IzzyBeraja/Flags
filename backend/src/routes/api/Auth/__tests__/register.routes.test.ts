import type { Params } from "../../../../types/types";
import type { PostRequest, PostResponse } from "../register.routes";
import type { Request, Response } from "express";

import { BAD_REQUEST, CREATED } from "../../../../errors/errorCodes";
import * as UserQueries from "../../../../queries/User.queries";
import { Post } from "../register.routes";

import { mock } from "jest-mock-extended";

const registerUserMock = jest.spyOn(UserQueries, "registerUser");
const next = jest.fn();

let req: Request<Params, PostResponse, PostRequest>;
let res: Response<PostResponse>;

describe("/api/auth/register", () => {
  beforeEach(() => {
    req = mock<Request>();
    res = mock<Response>();
  });

  it("registration successful", async () => {
    registerUserMock.mockResolvedValueOnce({
      createdUser: {
        createdAt: new Date("1994-11-09T00:00:00"),
        email: "email",
        id: "1",
        name: "name",
        updatedAt: new Date("1994-11-09T00:00:00"),
      },
      success: true,
    });

    await Post(req, res, next);

    expect(req.session.userId).toBe("1");
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(CREATED);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it("registration failed", async () => {
    registerUserMock.mockResolvedValueOnce({
      error: "Bad email and password combination",
      success: false,
    });

    await Post(req, res, next);

    expect(req.session.userId).toBeUndefined();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
