import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { api_keys } from "../../db/schema/api_keys";

import postgres from "postgres";

export type CreateApiKeyInput = {
  apiKey: string;
  userId: string;
};

export type ApiKey = {
  apiKey: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
};

export async function createApiKey(
  db: PostgresJsDatabase,
  input: CreateApiKeyInput
): ResultAsync<ApiKey, postgres.PostgresError | ErrorType> {
  try {
    const [apiKey] = await db
      .insert(api_keys)
      .values({
        api_key: input.apiKey,
        owned_by: input.userId,
      })
      .returning({
        apiKey: api_keys.api_key,
        createdAt: api_keys.created_at,
        expiresAt: api_keys.expires_at,
        updatedAt: api_keys.updated_at,
        userId: api_keys.owned_by,
      });

    return [apiKey, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
