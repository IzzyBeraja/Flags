import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { api_keys } from "../../db/schema/api_keys";
import { users } from "../../db/schema/users";

import { eq } from "drizzle-orm";
import postgres from "postgres";

export type GetApiKeyInput = {
  userId: string;
};

export type ApiKey = {
  apiKey: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
};

export async function getApiKeys(
  db: PostgresJsDatabase,
  input: GetApiKeyInput
): ResultAsync<ApiKey[], postgres.PostgresError | ErrorType> {
  try {
    const apiKeys = await db
      .select({
        apiKey: api_keys.api_key,
        createdAt: api_keys.created_at,
        expiresAt: api_keys.expires_at,
        updatedAt: api_keys.updated_at,
      })
      .from(api_keys)
      .where(eq(api_keys.owned_by, input.userId));

    return [apiKeys, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}

export type GetUserFromApiKeyInput = {
  apiKey: string;
};

export type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
};

export async function getUserFromApiKey(
  db: PostgresJsDatabase,
  input: GetUserFromApiKeyInput
): ResultAsync<User, postgres.PostgresError | ErrorType> {
  try {
    const [user] = await db
      .select({
        email: users.email,
        firstName: users.first_name,
        id: users.id,
        lastName: users.last_name,
      })
      .from(api_keys)
      .innerJoin(users, eq(api_keys.owned_by, users.id))
      .where(eq(api_keys.api_key, input.apiKey));

    return [user, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
