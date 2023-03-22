import { makeSchema } from "nexus";

import * as types from "./graphql";
import { join } from "path";

export const schema = makeSchema({
  contextType: {
    export: "Context",
    module: join(process.cwd(), "./src/context.ts"),
  },
  outputs: {
    schema: join(process.cwd(), "schema.graphql"),
    typegen: join(process.cwd(), "nexus-typegen.ts"),
  },
  types,
});
