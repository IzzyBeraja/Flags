import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "../../db/schema/users";

import { eq } from "drizzle-orm";
import postgres from "postgres";

export type GetUserInput = {
  userId: string;
};

export type User = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export async function getUser(
  db: PostgresJsDatabase,
  input: GetUserInput
): ResultAsync<User, postgres.PostgresError | ErrorType> {
  try {
    const [user] = await db
      .select({
        email: users.email,
        firstName: users.first_name,
        lastName: users.last_name,
        userId: users.id,
      })
      .from(users)
      .where(eq(users.id, input.userId));

    return [user, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
