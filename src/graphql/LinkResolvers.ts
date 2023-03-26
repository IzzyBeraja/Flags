import { IResolvers } from "@graphql-tools/utils";

import { MutationResolvers, QueryResolvers } from "../generated/graphql";

const get_posts: QueryResolvers["get_posts"] = async (
  _parent,
  _args,
  context
) => context.prisma.link.findMany();

const create_post: MutationResolvers["create_post"] = async (
  _parent,
  args,
  context
) => {
  return await context.prisma.link.create({
    data: {
      description: args.description,
      url: args.url,
    },
  });
};

const update_post: MutationResolvers["update_post"] = async (
  _parent,
  args,
  context
) => {
  return await context.prisma.link.update({
    data: {
      ...(args.description != null && { description: args.description }),
      ...(args.url != null && { url: args.url }),
    },
    where: {
      id: args.id,
    },
  });
};

const delete_post: MutationResolvers["delete_post"] = async (
  _parent,
  args,
  context
) => {
  return await context.prisma.link.delete({
    where: {
      id: args.id,
    },
  });
};

const resolvers: IResolvers = {
  Mutation: {
    create_post,
    delete_post,
    update_post,
  },
  Query: {
    get_posts,
  },
};

export default resolvers;
