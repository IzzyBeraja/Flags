import { NOT_FOUND, OK } from "../../../../errors/errorCodes";
import * as GetSwitchModule from "../../../../queries/switches/getSwitch";
import * as UpdateSwitchModule from "../../../../queries/switches/updateSwitch";
import { Get, Patch } from "../[switchId].routes";

import { mock } from "jest-mock-extended";

let getReq: Parameters<typeof Get>[0];
let getRes: Parameters<typeof Get>[1];

let patchReq: Parameters<typeof Patch>[0];
let patchRes: Parameters<typeof Patch>[1];

const mockGetSwitch = jest.spyOn(GetSwitchModule, "getSwitch");
const mockUpdateSwitch = jest.spyOn(UpdateSwitchModule, "updateSwitch");

const next = jest.fn();

describe("[switchId].routes", () => {
  describe("GET", () => {
    beforeEach(() => {
      getReq = mock<typeof getReq>();
      getRes = mock<typeof getRes>();
    });

    describe("when logged in", () => {
      it("does not find a switch", async () => {
        getReq.session.userId = "U1";
        getReq.params.switchId = "S1";

        mockGetSwitch.mockResolvedValue([null, new Error("Switch was not found")]);

        await Get(getReq, getRes, next);

        expect(mockGetSwitch).toHaveBeenCalledTimes(1);
        expect(mockGetSwitch).toHaveBeenCalledWith(getReq.db, { switchId: "S1", userId: "U1" });
        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(NOT_FOUND);
        expect(getRes.json).toHaveBeenCalledTimes(1);
        expect(getRes.json).toHaveBeenCalledWith({ message: "Switch was not found" });
      });

      it("finds a switch", async () => {
        getReq.session.userId = "U1";
        getReq.params.switchId = "S1";

        mockGetSwitch.mockResolvedValue([
          {
            createdAt: "1",
            description: "desc",
            name: "name",
            state: true,
            switchId: "S1",
            updatedAt: "1",
            userId: "U1",
          },
          null,
        ]);

        await Get(getReq, getRes, next);

        expect(mockGetSwitch).toHaveBeenCalledTimes(1);
        expect(mockGetSwitch).toHaveBeenCalledWith(getReq.db, { switchId: "S1", userId: "U1" });
        expect(getRes.status).toHaveBeenCalledTimes(1);
        expect(getRes.status).toHaveBeenCalledWith(OK);
        expect(getRes.json).toHaveBeenCalledTimes(1);
        expect(getRes.json).toHaveBeenCalledWith({
          fSwitch: {
            createdAt: "1",
            description: "desc",
            name: "name",
            state: true,
            switchId: "S1",
            updatedAt: "1",
            userId: "U1",
          },
        });
      });
    });
  });

  describe("PATCH", () => {
    beforeEach(() => {
      patchReq = mock<typeof patchReq>();
      patchRes = mock<typeof patchRes>();
    });

    describe("when logged in", () => {
      it("updates switch data", async () => {
        patchReq.session.userId = "U1";
        patchReq.params.switchId = "S1";
        patchReq.body = { description: "Switch", name: "Fake", state: true };

        mockUpdateSwitch.mockResolvedValue([
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

        await Patch(patchReq, patchRes, next);

        expect(mockUpdateSwitch).toHaveBeenCalledTimes(1);
        expect(mockUpdateSwitch).toHaveBeenCalledWith(patchReq.db, {
          description: "Switch",
          name: "Fake",
          state: true,
          switchId: "S1",
          userId: "U1",
        });
        expect(patchRes.status).toHaveBeenCalledTimes(1);
        expect(patchRes.status).toHaveBeenCalledWith(OK);
        expect(patchRes.json).toHaveBeenCalledTimes(1);
        expect(patchRes.json).toHaveBeenCalledWith({
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

      it("does not update undefined fields", async () => {
        patchReq.session.userId = "U1";
        patchReq.params.switchId = "S1";
        patchReq.body = {};

        mockUpdateSwitch.mockResolvedValue([
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

        await Patch(patchReq, patchRes, next);

        expect(mockUpdateSwitch).toHaveBeenCalledTimes(1);
        expect(mockUpdateSwitch).toHaveBeenCalledWith(patchReq.db, {
          switchId: "S1",
          userId: "U1",
        });
        expect(patchRes.status).toHaveBeenCalledTimes(1);
        expect(patchRes.status).toHaveBeenCalledWith(OK);
        expect(patchRes.json).toHaveBeenCalledTimes(1);
        expect(patchRes.json).toHaveBeenCalledWith({
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
    });
  });
});
