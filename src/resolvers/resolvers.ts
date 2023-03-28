import LinkResolvers from "./LinkResolvers";
import UserResolvers from "./UserResolvers";

import { mergeResolvers } from "@graphql-tools/merge";

export const resolvers = mergeResolvers([LinkResolvers, UserResolvers]);
