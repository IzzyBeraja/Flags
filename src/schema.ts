import { makeSchema } from "nexus";

import * as types from "./graphql";
import { join } from "path";

export const schema = makeSchema({
  outputs: {
    schema: join(process.cwd(), "schema.graphql"),
    typegen: join(process.cwd(), "nexus-typegen.ts"),
  },
  types,
});
