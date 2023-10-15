import type { Error, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "../../db/schema/users";

import postgres from "postgres";

export type UserInput = {
  accountId: string;
  firstName?: string | null;
  lastName?: string | null;
};

export type User = {
  id: string;
  accountId: string;
  firstName: string | null;
  lastName: string | null;
};

export async function registerUser(
  db: PostgresJsDatabase,
  input: UserInput
): ResultAsync<User, postgres.PostgresError | Error> {
  try {
    const [user] = await db
      .insert(users)
      .values({
        account_id: input.accountId,
        first_name: input.firstName ?? null,
        last_name: input.lastName ?? null,
      })
      .returning({
        accountId: users.account_id,
        firstName: users.first_name,
        id: users.id,
        lastName: users.last_name,
      });

    return [user, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
