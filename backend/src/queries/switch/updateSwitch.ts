import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { switches } from "../../db/schema/switches";

import { and, eq } from "drizzle-orm";
import postgres from "postgres";

export type CreateSwitchInput = {
  name?: string;
  description?: string;
  state?: boolean;
  switchId: string;
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

export async function updateSwitch(
  db: PostgresJsDatabase,
  input: CreateSwitchInput
): ResultAsync<Switch, postgres.PostgresError | ErrorType> {
  try {
    const [fswitch] = await db
      .update(switches)
      .set({
        description: input.description,
        name: input.name,
        state: input.state,
      })
      .where(and(eq(switches.owned_by, input.userId), eq(switches.id, input.switchId)))
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
