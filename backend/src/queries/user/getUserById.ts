import type { Error, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "../../db/schema/users";

import { eq } from "drizzle-orm";
import postgres from "postgres";

export type UserInput = {
  id: string;
};

export type User = {
  id: string;
  accountId: string;
  firstName: string | null;
  lastName: string | null;
};

export async function getUserById(
  db: PostgresJsDatabase,
  input: UserInput
): ResultAsync<User, postgres.PostgresError | Error> {
  try {
    const [user] = await db
      .select({
        accountId: users.account_id,
        firstName: users.first_name,
        id: users.id,
        lastName: users.last_name,
      })
      .from(users)
      .where(eq(users.id, input.id));

    return [user, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
