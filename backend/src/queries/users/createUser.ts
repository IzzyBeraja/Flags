import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "../../db/schema/users";

import postgres from "postgres";

export type CreateUserInput = {
  email: string;
  firstName?: string;
  lastName?: string;
};

export type User = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export async function createUser(
  db: PostgresJsDatabase,
  input: CreateUserInput
): ResultAsync<User, postgres.PostgresError | ErrorType> {
  try {
    const [user] = await db
      .insert(users)
      .values({
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
      })
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
