import type { ErrorType, ResultAsync } from "../../types/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { switches } from "../../db/schema/switches";

import { and, eq } from "drizzle-orm";
import postgres from "postgres";

export type Switch = {
  switchId: string;
  createdAt: string;
  description: string | null;
  name: string;
  state: boolean;
  updatedAt: string;
  userId: string;
};

export type GetSwitchInput = {
  userId: string;
  switchId: string;
};

export async function getSwitch(
  db: PostgresJsDatabase,
  input: GetSwitchInput
): ResultAsync<Switch, postgres.PostgresError | ErrorType> {
  try {
    const [fswitches] = await db
      .select({
        createdAt: switches.created_at,
        description: switches.description,
        name: switches.name,
        state: switches.state,
        switchId: switches.id,
        updatedAt: switches.updated_at,
        userId: switches.owned_by,
      })
      .from(switches)
      .where(and(eq(switches.owned_by, input.userId), eq(switches.id, input.switchId)));

    return [fswitches, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}

export type GetSwitchesInput = {
  userId: string;
};

export async function getSwitches(
  db: PostgresJsDatabase,
  input: GetSwitchesInput
): ResultAsync<Switch[], postgres.PostgresError | ErrorType> {
  try {
    const fswitches = await db
      .select({
        createdAt: switches.created_at,
        description: switches.description,
        name: switches.name,
        state: switches.state,
        switchId: switches.id,
        updatedAt: switches.updated_at,
        userId: switches.owned_by,
      })
      .from(switches)
      .where(eq(switches.owned_by, input.userId));

    return [fswitches, null];
  } catch (error) {
    return error instanceof postgres.PostgresError
      ? [null, error]
      : [null, { message: "Something went wrong" }];
  }
}
