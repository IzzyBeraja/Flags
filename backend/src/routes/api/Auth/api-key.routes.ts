import type { IsAuthenticated } from "../../../middleware/route/isAuthenticated";
import type { ApiKey } from "../../../queries/api_keys/createApiKey";
import type { AsyncHandler, EmptyObject, ErrorType } from "../../../types/types";

import { BAD_REQUEST, OK } from "../../../errors/errorCodes";
import { isAuthenticated } from "../../../middleware/route/isAuthenticated";
import { createApiKey } from "../../../queries/api_keys/createApiKey";
import { getApiKeys } from "../../../queries/api_keys/getApiKey";
import { decryptApiKey, encryptApiKey, generateApiKey } from "../../../utils/apiKeyFunctions";

//#region GET

export const GetMiddleware = [isAuthenticated];

type GetRequest = EmptyObject;

type GetResponse = {
  apiKeys: ApiKey[];
};

export const GetRequestSchema = {
  additionalProperties: false,
  type: "object",
};

type GetHandler = {
  Response: GetResponse;
  Request: GetRequest;
  Error: ErrorType;
  Middleware: IsAuthenticated;
};

export const Get: AsyncHandler<GetHandler> = async (req, res) => {
  const [apiKeys, error] = await getApiKeys(req.db, { userId: req.session.userId });

  if (error != null) {
    res.status(BAD_REQUEST);
    res.json({ message: "Error retrieving api keys" });
    return;
  }

  const decryptedApiKeys = apiKeys.map(key => ({
    ...key,
    apiKey: decryptApiKey(key.apiKey),
  }));

  res.status(OK);
  res.json({ apiKeys: decryptedApiKeys });
};

//#region POST

export const PostMiddleware = [isAuthenticated];

type PostRequest = EmptyObject;

type PostResponse = {
  apiKey: ApiKey;
};

export const PostRequestSchema = {
  additionalProperties: false,
  type: "object",
};

type PostHandler = {
  Response: PostResponse;
  Request: PostRequest;
  Error: ErrorType;
  Middleware: IsAuthenticated;
};

export const Post: AsyncHandler<PostHandler> = async (req, res) => {
  const maxRetries = 3;
  let tries = 0;

  do {
    const generatedKey = generateApiKey("fk_");

    const [apiKey, _error] = await createApiKey(req.db, {
      apiKey: encryptApiKey(generatedKey),
      userId: req.session.userId,
    });

    if (apiKey != null) {
      res.status(OK);
      res.json({ apiKey: { ...apiKey, apiKey: generatedKey } });
      return;
    }

    tries++;
    //> TODO: Log this somewhere
  } while (tries < maxRetries);

  res.status(BAD_REQUEST);
  res.json({ message: "Failed to generate api key" });
};

//#endregion
