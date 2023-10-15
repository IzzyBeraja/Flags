import type { Error, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { accounts } from "../../db/schema/accounts";
import { compare } from "../../utils/passwordFunctions";

import { eq } from "drizzle-orm";
import postgres from "postgres";

export type LoginInput = {
  email: string;
  password: string;
};

export type Account = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export async function loginAccount(
  db: PostgresJsDatabase,
  input: LoginInput
): ResultAsync<Account, postgres.PostgresError | Error> {
  try {
    const [account] = await db
      .select({
        createdAt: accounts.created_at,
        email: accounts.email,
        id: accounts.id,
        password: accounts.password,
        updatedAt: accounts.updated_at,
      })
      .from(accounts)
      .where(eq(accounts.email, input.email));

    if (account == null) {
      return [null, { message: "No account found" }];
    }

    const passwordMatch = await compare(input.password, account.password);

    if (!passwordMatch) {
      return [null, { message: "Bad email and password combination" }];
    }

    const accountWithoutPassword = { ...account, password: undefined };

    return [accountWithoutPassword, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
