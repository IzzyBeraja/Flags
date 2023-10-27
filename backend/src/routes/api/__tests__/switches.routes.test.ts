import { BAD_REQUEST, CREATED, OK } from "../../../errors/errorCodes";
import * as CreateSwitchModule from "../../../queries/switches/createSwitch";
import * as GetSwitchModule from "../../../queries/switches/getSwitch";
import { Get, Post } from "../switches.routes";

import { mock } from "jest-mock-extended";

let getReq: Parameters<typeof Get>[0];
let getRes: Parameters<typeof Get>[1];

let postReq: Parameters<typeof Post>[0];
let postRes: Parameters<typeof Post>[1];

const mockGetSwitches = jest.spyOn(GetSwitchModule, "getSwitches");
const mockCreateSwitch = jest.spyOn(CreateSwitchModule, "createSwitch");

const next = jest.fn();

describe("switches.routes", () => {
  describe("GET", () => {
    beforeEach(() => {
      getReq = mock<typeof getReq>();
      getRes = mock<typeof getRes>();
    });

    describe("when logged in", () => {
      it("does not find any switches", async () => {
        getReq.session.userId = "U1";

        mockGetSwitches.mockResolvedValue([null, new Error("Switch was not found")]);

        await Get(getReq, getRes, next);

        expect(mockGetSwitches).toHaveBeenCalledTimes(1);
        expect(mockGetSwitches).toHaveBeenCalledWith(getReq.db, { userId: "U1" });
        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(BAD_REQUEST);
        expect(getRes.json).toHaveBeenCalledTimes(1);
        expect(getRes.json).toHaveBeenCalledWith({ message: "Switch was not found" });
      });

      it("finds a switch", async () => {
        getReq.session.userId = "U1";

        mockGetSwitches.mockResolvedValue([
          [
            {
              createdAt: "1",
              description: "desc",
              name: "first",
              state: true,
              switchId: "S1",
              updatedAt: "1",
              userId: "U1",
            },
            {
              createdAt: "1",
              description: "desc",
              name: "second",
              state: true,
              switchId: "S2",
              updatedAt: "1",
              userId: "U1",
            },
          ],
          null,
        ]);

        await Get(getReq, getRes, next);

        expect(mockGetSwitches).toHaveBeenCalledTimes(1);
        expect(mockGetSwitches).toHaveBeenCalledWith(getReq.db, { userId: "U1" });
        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(OK);
        expect(getRes.json).toHaveBeenCalledTimes(1);
        expect(getRes.json).toHaveBeenCalledWith({
          switches: [
            {
              createdAt: "1",
              description: "desc",
              name: "first",
              state: true,
              switchId: "S1",
              updatedAt: "1",
              userId: "U1",
            },
            {
              createdAt: "1",
              description: "desc",
              name: "second",
              state: true,
              switchId: "S2",
              updatedAt: "1",
              userId: "U1",
            },
          ],
        });
      });
    });
  });

  describe("POST", () => {
    beforeEach(() => {
      postReq = mock<typeof postReq>();
      postRes = mock<typeof postRes>();
    });

    describe("when logged in", () => {
      it("creates a switch", async () => {
        postReq.session.userId = "U1";
        postReq.body = { description: "Switch", name: "Fake", state: true };

        mockCreateSwitch.mockResolvedValue([
          {
            createdAt: "1",
            description: "Switch",
            name: "Fake",
            state: true,
            switchId: "S1",
            updatedAt: "1",
            userId: "U1",
          },
          null,
        ]);

        await Post(postReq, postRes, next);

        expect(mockCreateSwitch).toHaveBeenCalledTimes(1);
        expect(mockCreateSwitch).toHaveBeenCalledWith(postReq.db, {
          description: "Switch",
          name: "Fake",
          state: true,
          userId: "U1",
        });
        expect(postRes.status).toHaveBeenCalledTimes(1);
        expect(postRes.status).toHaveBeenCalledWith(CREATED);
        expect(postRes.json).toHaveBeenCalledTimes(1);
        expect(postRes.json).toHaveBeenCalledWith({
          fSwitch: {
            createdAt: "1",
            description: "Switch",
            name: "Fake",
            state: true,
            switchId: "S1",
            updatedAt: "1",
            userId: "U1",
          },
        });
      });

      it("works without optional fields", async () => {
        postReq.session.userId = "U1";
        postReq.body = { name: "Fake" };

        mockCreateSwitch.mockResolvedValue([
          {
            createdAt: "1",
            description: null,
            name: "Fake",
            state: false,
            switchId: "S1",
            updatedAt: "1",
            userId: "U1",
          },
          null,
        ]);

        await Post(postReq, postRes, next);

        expect(mockCreateSwitch).toHaveBeenCalledTimes(1);
        expect(mockCreateSwitch).toHaveBeenCalledWith(postReq.db, {
          name: "Fake",
          userId: "U1",
        });
        expect(postRes.status).toHaveBeenCalledTimes(1);
        expect(postRes.status).toHaveBeenCalledWith(CREATED);
        expect(postRes.json).toHaveBeenCalledTimes(1);
        expect(postRes.json).toHaveBeenCalledWith({
          fSwitch: {
            createdAt: "1",
            description: null,
            name: "Fake",
            state: false,
            switchId: "S1",
            updatedAt: "1",
            userId: "U1",
          },
        });
      });
    });
  });
});
