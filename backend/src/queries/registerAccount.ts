import type { ResultAsync } from "../types/types";

import { hash } from "../utils/passwordFunctions";

import { sql, type DatabasePool, UniqueIntegrityConstraintViolationError } from "slonik";
export type AccountInput = {
  email: string;
  password: string;
};

export type Account = {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export async function registerAccount(
  pool: DatabasePool,
  input: AccountInput
): ResultAsync<Account> {
  const hashedPassword = await hash(input.password);

  try {
    const account: Account = await pool.one(sql.unsafe`
    insert into common.accounts (email, password)
    values (${input.email}, ${hashedPassword})
    returning id, email, created_at, updated_at
  `);

    return [account, null];
  } catch (error) {
    if (error instanceof UniqueIntegrityConstraintViolationError) {
      return [null, { message: `Email ${input.email} is already in use` }];
    }
    return error instanceof Error ? [null, error] : [null, { message: "Something went wrong" }];
  }
}
