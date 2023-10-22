import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { accounts } from "../../db/schema/accounts";
import { hash } from "../../utils/passwordFunctions";

import postgres from "postgres";

export type AccountInput = {
  email: string;
  password: string;
};

export type Account = {
  accountId: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export async function registerAccount(
  db: PostgresJsDatabase,
  input: AccountInput
): ResultAsync<Account, postgres.PostgresError | ErrorType> {
  const hashedPassword = await hash(input.password);

  try {
    const [account] = await db
      .insert(accounts)
      .values({ email: input.email, password: hashedPassword })
      .returning({
        accountId: accounts.id,
        created_at: accounts.created_at,
        email: accounts.email,
        updated_at: accounts.updated_at,
      });

    return [account, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
