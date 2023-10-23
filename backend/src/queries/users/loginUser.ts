import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { passwords } from "../../db/schema/passwords";
import { users } from "../../db/schema/users";
import { compare } from "../../utils/passwordFunctions";

import { eq } from "drizzle-orm";
import postgres from "postgres";

export type LoginUserInput = {
  email: string;
  password: string;
};

export type User = {
  email: string;
  firstName: string | null;
  lastName: string | null;
  userId: string;
};

export async function loginUser(
  db: PostgresJsDatabase,
  input: LoginUserInput
): ResultAsync<User, postgres.PostgresError | ErrorType> {
  try {
    const [userWithCredentials] = await db
      .select({
        email: users.email,
        firstName: users.first_name,
        lastName: users.last_name,
        password: passwords.password,
        userId: users.id,
      })
      .from(users)
      .innerJoin(passwords, eq(users.id, passwords.id))
      .where(eq(users.email, input.email));

    if (userWithCredentials == null) {
      return [null, { message: "Bad email and password combination" }];
    }

    const passwordMatch = await compare(input.password, userWithCredentials.password);

    if (!passwordMatch) {
      return [null, { message: "Bad email and password combination" }];
    }

    const userWithoutPassword = { ...userWithCredentials, password: undefined };

    return [userWithoutPassword, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
