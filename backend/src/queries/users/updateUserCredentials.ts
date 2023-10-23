import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { passwords } from "../../db/schema/passwords";
import { users } from "../../db/schema/users";
import { compare, hash } from "../../utils/passwordFunctions";

import { and, eq } from "drizzle-orm";
import postgres from "postgres";

export type UpdateUserCredentialsInput = {
  userId: string;
  oldPassword: string;
  newPassword: string;
};

export type User = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export async function updateUserCredentials(
  db: PostgresJsDatabase,
  input: UpdateUserCredentialsInput
): ResultAsync<User, postgres.PostgresError | ErrorType> {
  try {
    const updatedUser = await db.transaction(async tx => {
      const [userWithCredentials] = await tx
        .select({
          email: users.email,
          firstName: users.first_name,
          lastName: users.last_name,
          password: passwords.password,
          passwordUpdatedAt: passwords.updated_at,
          userId: users.id,
        })
        .from(users)
        .innerJoin(passwords, eq(users.id, passwords.id))
        .where(eq(users.id, input.userId));

      const oldPasswordMatches = await compare(input.oldPassword, userWithCredentials.password);

      if (!oldPasswordMatches) {
        throw new Error("Invalid email password combination");
      }

      const newPasswordHash = await hash(input.newPassword);

      await tx
        .update(passwords)
        .set({ password: newPasswordHash })
        .where(
          and(
            eq(users.id, input.userId),
            eq(passwords.updated_at, userWithCredentials.passwordUpdatedAt)
          )
        );

      const userWithoutPassword = {
        ...userWithCredentials,
        password: undefined,
        passwordUpdatedAt: undefined,
      };

      return userWithoutPassword;
    });

    return [updatedUser, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : error instanceof Error
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
