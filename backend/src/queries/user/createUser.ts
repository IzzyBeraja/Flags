import type { Error, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "../../db/schema/users";

import postgres from "postgres";

export type CreateUserInput = {
  accountId: string;
  firstName?: string;
  lastName?: string;
};

export type User = {
  userId: string;
  accountId: string;
  firstName: string | null;
  lastName: string | null;
};

export async function createUser(
  db: PostgresJsDatabase,
  input: CreateUserInput
): ResultAsync<User, postgres.PostgresError | Error> {
  try {
    const [user] = await db
      .insert(users)
      .values({
        account_id: input.accountId,
        first_name: input.firstName,
        last_name: input.lastName,
      })
      .returning({
        accountId: users.account_id,
        firstName: users.first_name,
        lastName: users.last_name,
        userId: users.id,
      });

    return [user, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
