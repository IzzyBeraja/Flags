import type { Error, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "../../db/schema/users";

import { eq } from "drizzle-orm";
import postgres from "postgres";

export type GetUserInput =
  | { accountId: string; userId?: never }
  | { accountId?: never; userId: string };

export type User = {
  userId: string;
  accountId: string;
  firstName: string | null;
  lastName: string | null;
};

export async function getUser(
  db: PostgresJsDatabase,
  input: GetUserInput
): ResultAsync<User, postgres.PostgresError | Error> {
  try {
    const [user] = await db
      .select({
        accountId: users.account_id,
        firstName: users.first_name,
        lastName: users.last_name,
        userId: users.id,
      })
      .from(users)
      .where(
        input.accountId == null ? eq(users.id, input.userId) : eq(users.account_id, input.accountId)
      );

    return [user, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
