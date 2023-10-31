import { BAD_REQUEST, OK } from "../../../../errors/errorCodes";
import * as CreateApiKey from "../../../../queries/api_keys/createApiKey";
import * as GetApiKey from "../../../../queries/api_keys/getApiKey";
import * as ApiKeyFunctions from "../../../../utils/apiKeyFunctions";
import { Get, Post } from "../api-key.routes";

import { mock } from "jest-mock-extended";

const mockGetApiKeys = jest.spyOn(GetApiKey, "getApiKeys");
const mockCreateApiKey = jest.spyOn(CreateApiKey, "createApiKey");

const mockDecryptApiKey = jest.spyOn(ApiKeyFunctions, "decryptApiKey");
const mockEncryptApiKey = jest.spyOn(ApiKeyFunctions, "encryptApiKey");
const mockGenerateApiKey = jest.spyOn(ApiKeyFunctions, "generateApiKey");
const next = jest.fn();

let getReq: Parameters<typeof Get>[0];
let getRes: Parameters<typeof Get>[1];

let postReq: Parameters<typeof Post>[0];
let postRes: Parameters<typeof Post>[1];

describe("/api/auth/api-key", () => {
  describe("GET", () => {
    beforeEach(() => {
      getReq = mock<typeof getReq>();
      getRes = mock<typeof getRes>();

      mockDecryptApiKey.mockImplementation((apiKey: string) => apiKey);
    });

    it("returns empty array when no api keys", async () => {
      getReq.session.userId = "U1";

      mockGetApiKeys.mockResolvedValueOnce([[], null]);

      await Get(getReq, getRes, next);

      expect(mockGetApiKeys).toHaveBeenCalledTimes(1);
      expect(mockGetApiKeys).toHaveBeenCalledWith(getReq.db, { userId: getReq.session.userId });
      expect(getRes.status).toHaveBeenCalledTimes(1);
      expect(getRes.status).toHaveBeenCalledWith(OK);
      expect(getRes.json).toHaveBeenCalledTimes(1);
      expect(getRes.json).toHaveBeenCalledWith({ apiKeys: [] });
    });

    it("returns api keys", async () => {
      getReq.session.userId = "U1";

      mockGetApiKeys.mockResolvedValueOnce([
        [
          {
            apiKey: "apikey_1",
            createdAt: "2021-01-01",
            expiresAt: null,
            updatedAt: "2021-01-01",
          },
          {
            apiKey: "apikey_2",
            createdAt: "2021-01-01",
            expiresAt: null,
            updatedAt: "2021-01-01",
          },
        ],
        null,
      ]);

      await Get(getReq, getRes, next);

      expect(mockGetApiKeys).toHaveBeenCalledTimes(1);
      expect(mockGetApiKeys).toHaveBeenCalledWith(getReq.db, { userId: getReq.session.userId });
      expect(mockDecryptApiKey).toHaveBeenCalledTimes(2);
      expect(getRes.status).toHaveBeenCalledTimes(1);
      expect(getRes.status).toHaveBeenCalledWith(OK);
      expect(getRes.json).toHaveBeenCalledTimes(1);
      expect(getRes.json).toHaveBeenCalledWith({
        apiKeys: [
          {
            apiKey: "apikey_1",
            createdAt: "2021-01-01",
            expiresAt: null,
            updatedAt: "2021-01-01",
          },
          {
            apiKey: "apikey_2",
            createdAt: "2021-01-01",
            expiresAt: null,
            updatedAt: "2021-01-01",
          },
        ],
      });
    });

    it("properly returns errors", async () => {
      getReq.session.userId = "U1";

      mockGetApiKeys.mockResolvedValueOnce([null, { message: "Something went wrong" }]);

      await Get(getReq, getRes, next);

      expect(mockGetApiKeys).toHaveBeenCalledTimes(1);
      expect(mockGetApiKeys).toHaveBeenCalledWith(getReq.db, { userId: getReq.session.userId });
      expect(getRes.status).toHaveBeenCalledTimes(1);
      expect(getRes.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(getRes.json).toHaveBeenCalledTimes(1);
      expect(getRes.json).toHaveBeenCalledWith({ message: "Error retrieving api keys" });
    });
  });

  describe("POST", () => {
    beforeEach(() => {
      postReq = mock<typeof postReq>();
      postRes = mock<typeof postRes>();

      mockEncryptApiKey.mockImplementation((apiKey: string) => `e_${apiKey}`);
      mockGenerateApiKey.mockImplementation(() => "apikey_1");
    });

    it("returns a new api key", async () => {
      postReq.session.userId = "U1";

      mockCreateApiKey.mockResolvedValueOnce([
        {
          apiKey: "e_apikey_1",
          createdAt: "2021-01-01",
          expiresAt: null,
          updatedAt: "2021-01-01",
        },
        null,
      ]);

      await Post(postReq, postRes, next);

      expect(mockGenerateApiKey).toHaveBeenCalledTimes(1);
      expect(mockEncryptApiKey).toHaveBeenCalledTimes(1);
      expect(mockCreateApiKey).toHaveBeenCalledTimes(1);
      expect(mockCreateApiKey).toHaveBeenCalledWith(postReq.db, {
        apiKey: "e_apikey_1",
        userId: postReq.session.userId,
      });
      expect(postRes.status).toHaveBeenCalledTimes(1);
      expect(postRes.status).toHaveBeenCalledWith(OK);
      expect(postRes.json).toHaveBeenCalledTimes(1);
      expect(postRes.json).toHaveBeenCalledWith({
        apiKey: {
          apiKey: "apikey_1",
          createdAt: "2021-01-01",
          expiresAt: null,
          updatedAt: "2021-01-01",
        },
      });
    });

    it("properly retries if api key already exists", async () => {
      postReq.session.userId = "U1";

      mockCreateApiKey.mockResolvedValueOnce([null, { message: "Something went wrong" }]);
      mockCreateApiKey.mockResolvedValueOnce([
        {
          apiKey: "e_apikey_1",
          createdAt: "2021-01-01",
          expiresAt: null,
          updatedAt: "2021-01-01",
        },
        null,
      ]);

      await Post(postReq, postRes, next);

      expect(mockGenerateApiKey).toHaveBeenCalledTimes(2);
      expect(mockEncryptApiKey).toHaveBeenCalledTimes(2);
      expect(mockCreateApiKey).toHaveBeenCalledTimes(2);
      expect(mockCreateApiKey).toHaveBeenCalledWith(postReq.db, {
        apiKey: "e_apikey_1",
        userId: postReq.session.userId,
      });
      expect(postRes.status).toHaveBeenCalledTimes(1);
      expect(postRes.status).toHaveBeenCalledWith(OK);
      expect(postRes.json).toHaveBeenCalledTimes(1);
      expect(postRes.json).toHaveBeenCalledWith({
        apiKey: {
          apiKey: "apikey_1",
          createdAt: "2021-01-01",
          expiresAt: null,
          updatedAt: "2021-01-01",
        },
      });
    });

    it("properly returns errors if max retries reached", async () => {
      postReq.session.userId = "U1";

      mockCreateApiKey.mockResolvedValueOnce([null, { message: "Something went wrong" }]);
      mockCreateApiKey.mockResolvedValueOnce([null, { message: "Something went wrong" }]);
      mockCreateApiKey.mockResolvedValueOnce([null, { message: "Something went wrong" }]);

      await Post(postReq, postRes, next);

      expect(mockGenerateApiKey).toHaveBeenCalledTimes(3);
      expect(mockEncryptApiKey).toHaveBeenCalledTimes(3);
      expect(mockCreateApiKey).toHaveBeenCalledTimes(3);
      expect(mockCreateApiKey).toHaveBeenCalledWith(postReq.db, {
        apiKey: "e_apikey_1",
        userId: postReq.session.userId,
      });
      expect(postRes.status).toHaveBeenCalledTimes(1);
      expect(postRes.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(postRes.json).toHaveBeenCalledTimes(1);
      expect(postRes.json).toHaveBeenCalledWith({ message: "Failed to generate api key" });
    });
  });
});
