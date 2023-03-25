import { IResolvers } from "@graphql-tools/utils";

import LinkResolvers from "./graphql/LinkResolvers";
import UserResolvers from "./graphql/UserResolvers";

export const resolvers: IResolvers = {
  ...LinkResolvers,
  ...UserResolvers,
};
