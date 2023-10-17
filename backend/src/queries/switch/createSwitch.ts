import type { Error, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { killswitches } from "../../db/schema/killswitches";

import postgres from "postgres";

export type CreateSwitchInput = {
  name: string;
  description?: string | null;
  state?: boolean;
  userId: string;
};

export type Switch = {
  createdAt: string;
  description: string | null;
  name: string;
  state: boolean;
  updatedAt: string;
  userId: string;
};

export async function createSwitch(
  db: PostgresJsDatabase,
  input: CreateSwitchInput
): ResultAsync<Switch, postgres.PostgresError | Error> {
  try {
    const [killswitch] = await db
      .insert(killswitches)
      .values({
        description: input.description ?? null,
        name: input.name,
        owned_by: input.userId,
        state: input.state,
      })
      .returning({
        createdAt: killswitches.created_at,
        description: killswitches.description,
        name: killswitches.name,
        state: killswitches.state,
        updatedAt: killswitches.updated_at,
        userId: killswitches.owned_by,
      });

    return [killswitch, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
