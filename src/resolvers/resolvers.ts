import { mergeResolvers } from "@graphql-tools/merge";

import LinkResolvers from "./LinkResolvers";
import UserResolvers from "./UserResolvers";

export const resolvers = mergeResolvers([LinkResolvers, UserResolvers]);
