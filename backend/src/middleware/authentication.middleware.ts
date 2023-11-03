import type { NextFunction, Request, Response } from "express";
import type { Redis } from "ioredis";

import { UNAUTHORIZED } from "../errors/errorCodes";
import { getUserFromApiKey } from "../queries/api_keys/getApiKey";
import { encryptApiKey } from "../utils/apiKeyFunctions";

import onHeaders from "on-headers";

export const authenticationMiddleware =
  (store: Redis) => async (req: Request, res: Response, next: NextFunction) => {
    // Check for cookie in cache
    // If the cookie exists, set req session to the session, and continue
    // If the cookie doesn't exist, check for the x-api-key header
    const apiKey = req.header("x-api-key");

    if (apiKey != null) {
      // Check the cache for the session
      const apiKeyData = await store.get(apiKey);

      if (apiKeyData != null) {
        console.log(JSON.parse(apiKeyData));
        // req.session = JSON.parse(apiKeyData);
        next();
        return;
      }

      const [user, error] = await getUserFromApiKey(req.db, { apiKey: encryptApiKey(apiKey) });

      if (error != null || user == null) {
        res.status(UNAUTHORIZED);
        res.json({ error: "Unauthorized", message: "Invalid API key" });
        return;
      }

      onHeaders(
        res,
        async () =>
          await store.set(
            apiKey,
            JSON.stringify({
              email: user.email,
              firstName: user.firstName,
              ipAddress: req.ip,
              isApiKey: true,
              lastName: user.lastName,
              loginDate: new Date().toISOString(),
              userAgent: req.get("User-Agent"),
              userId: user.id,
            })
          )
      );

      // If the session exists, set req session to the session
      // If the session doesn't exist, query the database
      // If the session exists in the database, set req session to the session and set the cache
      // If the session doesn't exist in the database, continue
    }

    next();
  };

// const header = res.getHeader("Set-Cookie") ?? [];
// const data = Array.isArray(header)
//   ? [...header, "Some data"]
//   : [header.toString(), "Some data"];
// res.setHeader("Set-Cookie", data);
