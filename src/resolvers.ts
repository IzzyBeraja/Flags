import { IResolvers } from "@graphql-tools/utils";

import { resolvers as LinkResolvers } from "./graphql/Link";
import { resolvers as UserResolvers } from "./graphql/User";

export const resolvers: IResolvers = {
  ...LinkResolvers,
  ...UserResolvers,
};
