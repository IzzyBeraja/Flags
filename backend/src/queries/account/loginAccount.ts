import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { accounts } from "../../db/schema/accounts";
import { users } from "../../db/schema/users";
import { compare } from "../../utils/passwordFunctions";

import { eq } from "drizzle-orm";
import postgres from "postgres";

export type LoginInput = {
  email: string;
  password: string;
};

export type UserDetails = {
  accountId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  updatedAt: string;
  userId: string;
};

export async function loginAccount(
  db: PostgresJsDatabase,
  input: LoginInput
): ResultAsync<UserDetails, postgres.PostgresError | ErrorType> {
  try {
    const [userDetails] = await db.transaction(async tx => {
      const [accountCredentials] = await tx
        .select({
          email: accounts.email,
          id: accounts.id,
          password: accounts.password,
        })
        .from(accounts)
        .where(eq(accounts.email, input.email));

      if (accountCredentials == null) {
        return [null, { message: "Bad email and password combination" }];
      }

      const passwordMatch = await compare(input.password, accountCredentials.password);

      if (!passwordMatch) {
        return [null, { message: "Bad email and password combination" }];
      }

      const [details] = await tx
        .select({
          accountId: accounts.id,
          email: accounts.email,
          firstName: users.first_name,
          lastName: users.last_name,
          updatedAt: accounts.updated_at,
          userId: users.id,
        })
        .from(accounts)
        .innerJoin(users, eq(accounts.id, users.account_id))
        .where(eq(accounts.id, accountCredentials.id));

      return [details, null];
    });

    if (userDetails == null) {
      return [null, { message: "Bad email and password combination" }];
    }

    return [userDetails, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
