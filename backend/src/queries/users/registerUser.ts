import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { passwords } from "../../db/schema/passwords";
import { users } from "../../db/schema/users";
import { hash } from "../../utils/passwordFunctions";

import postgres from "postgres";

export type RegisterUserInput = {
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
};

export type User = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
};

export async function registerUser(
  db: PostgresJsDatabase,
  input: RegisterUserInput
): ResultAsync<User, postgres.PostgresError | ErrorType> {
  try {
    const [registeredUser] = await db.transaction(async tx => {
      const [user] = await tx
        .insert(users)
        .values({
          email: input.email,
          first_name: input.firstName ?? null,
          last_name: input.lastName ?? null,
        })
        .returning({
          email: users.email,
          firstName: users.first_name,
          lastName: users.last_name,
          userId: users.id,
        });

      const hashedPassword = await hash(input.password);

      await tx.insert(passwords).values({
        id: user.userId,
        password: hashedPassword,
      });

      return [user, null];
    });

    return [registeredUser, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
