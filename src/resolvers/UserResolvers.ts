import { QueryResolvers } from "../generated/graphql.generated";

import { IResolvers } from "@graphql-tools/utils";

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
  User: {
    links: async (parent, _args, context) => {
      return await context.prisma.user
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .links();
    },
  },
};

export default resolvers;
