import { IResolvers } from "@graphql-tools/utils";

import { resolvers as LinkResolvers } from "./graphql/Link";

export const resolvers: IResolvers = {
  ...LinkResolvers,
};
