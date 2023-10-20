import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { accounts } from "../../db/schema/accounts";
import { compare, hash } from "../../utils/passwordFunctions";

import { and, eq } from "drizzle-orm";
import postgres from "postgres";

export type getAccountWithCredentialsInput = {
  accountId: string;
  oldPassword: string;
  newPassword: string;
};

export type Account = {
  accountId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export async function updateAccountCredentials(
  db: PostgresJsDatabase,
  input: getAccountWithCredentialsInput
): ResultAsync<Account, postgres.PostgresError | ErrorType> {
  try {
    const updatedAccount = await db.transaction(async tx => {
      const [account] = await tx
        .select({
          accountId: accounts.id,
          createdAt: accounts.created_at,
          email: accounts.email,
          password: accounts.password,
          updatedAt: accounts.updated_at,
        })
        .from(accounts)
        .where(eq(accounts.id, input.accountId));

      const oldPasswordMatches = await compare(input.oldPassword, account.password);

      if (!oldPasswordMatches) {
        throw new Error("Invalid email password combination");
      }

      const newPasswordHash = await hash(input.newPassword);

      const [updatedAccount] = await tx
        .update(accounts)
        .set({ password: newPasswordHash })
        .where(and(eq(accounts.id, input.accountId), eq(accounts.updated_at, account.updatedAt)))
        .returning({
          accountId: accounts.id,
          createdAt: accounts.created_at,
          email: accounts.email,
          updatedAt: accounts.updated_at,
        });

      return updatedAccount;
    });

    return [updatedAccount, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : error instanceof Error
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
