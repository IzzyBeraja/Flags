import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { switches } from "../../db/schema/switches";

import postgres from "postgres";

export type CreateSwitchInput = {
  name: string;
  description?: string | null;
  state?: boolean;
  userId: string;
};

export type Switch = {
  switchId: string;
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
): ResultAsync<Switch, postgres.PostgresError | ErrorType> {
  try {
    const [fswitch] = await db
      .insert(switches)
      .values({
        description: input.description ?? null,
        name: input.name,
        owned_by: input.userId,
        state: input.state,
      })
      .returning({
        createdAt: switches.created_at,
        description: switches.description,
        name: switches.name,
        state: switches.state,
        switchId: switches.id,
        updatedAt: switches.updated_at,
        userId: switches.owned_by,
      });

    return [fswitch, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
