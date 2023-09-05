import type { Params } from "../../../../types/types";
import type { RegisterRequest, RegisterResponse } from "../register.routes";
import type { Request, Response } from "express";

import { BAD_REQUEST, CREATED } from "../../../../errors/errorCodes";
import * as UserQueries from "../../../../queries/User.queries";
import { route } from "../register.routes";

import { mock } from "jest-mock-extended";

const registerUserMock = jest.spyOn(UserQueries, "registerUser");
const next = jest.fn();

let req: Request<Params, RegisterResponse, RegisterRequest>;
let res: Response<RegisterResponse>;

describe("/api/auth/register", () => {
  beforeEach(() => {
    req = mock<Request>();
    res = mock<Response>();
  });

  it("registration successful", async () => {
    registerUserMock.mockResolvedValueOnce({
      createdUser: { email: "email", id: "1", name: "name" },
      success: true,
    });

    await route(req, res, next);

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

    await route(req, res, next);

    expect(req.session.userId).toBeUndefined();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
