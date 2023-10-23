import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "../../db/schema/users";

import { eq } from "drizzle-orm";
import postgres from "postgres";

export type UpdateUserInput = {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

export type User = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export async function updateUser(
  db: PostgresJsDatabase,
  input: UpdateUserInput
): ResultAsync<User, postgres.PostgresError | ErrorType> {
  try {
    const [user] = await db
      .update(users)
      .set({ first_name: input.firstName, last_name: input.lastName })
      .where(eq(users.id, input.userId))
      .returning({
        email: users.email,
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
