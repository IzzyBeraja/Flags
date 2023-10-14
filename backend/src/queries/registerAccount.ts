import type { ResultAsync } from "../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { accounts } from "../db/schema/accounts";
import { hash } from "../utils/passwordFunctions";

export type AccountInput = {
  email: string;
  password: string;
};

export type Account = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export async function registerAccount(
  db: PostgresJsDatabase,
  input: AccountInput
): ResultAsync<Account> {
  const hashedPassword = await hash(input.password);

  try {
    const [account] = await db
      .insert(accounts)
      .values({ email: input.email, password: hashedPassword })
      .returning({
        created_at: accounts.created_at,
        email: accounts.email,
        id: accounts.id,
        updated_at: accounts.updated_at,
      });

    console.log(account);

    return [account, null];
  } catch (error) {
    return error instanceof Error ? [null, error] : [null, { message: "Something went wrong" }];
  }
}
