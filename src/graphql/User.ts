import { IResolvers } from "@graphql-tools/utils";

import { Context } from "../context";
import { QueryResolvers } from "../generated/graphql";

const get_users: QueryResolvers["get_users"] = async (
  _parent,
  _args,
  context: Context
) =>
  context.prisma.user.findMany({
    include: {
      links: true,
    },
  });

export const resolvers: IResolvers = {
  Query: {
    get_users,
  },
};
