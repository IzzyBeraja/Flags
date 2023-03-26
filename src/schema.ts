import { DocumentNode } from "graphql";
import { gql } from "graphql-tag";

import { readFileSync } from "fs";
import { join } from "path";

const schemaPath = join(process.cwd(), "src/graphql/schema.graphql");
const schemaContent = readFileSync(schemaPath, "utf8");

export const typeDefs: DocumentNode = gql`
  ${schemaContent}
`;
