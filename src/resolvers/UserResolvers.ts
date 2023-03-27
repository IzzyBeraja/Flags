import { IResolvers } from "@graphql-tools/utils";

import { QueryResolvers } from "../generated/graphql.generated";

const get_users: QueryResolvers["get_users"] = async (
  _parent,
  _args,
  context
) =>
  context.prisma.user.findMany({
    include: { links: true },
  });

const resolvers: IResolvers = {
  Query: {
    get_users,
  },
};

export default resolvers;
