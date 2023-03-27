import { IResolvers } from "@graphql-tools/utils";

import {
  MutationResolvers,
  QueryResolvers,
} from "../generated/graphql.generated";

const get_posts: QueryResolvers["get_posts"] = async (
  _parent,
  _args,
  context
) =>
  context.prisma.link.findMany({
    include: { createdBy: true },
  });

const create_post: MutationResolvers["create_post"] = async (
  _parent,
  args,
  context
) => {
  return await context.prisma.link.create({
    data: {
      createdBy: { connect: { id: "0df7ae7d-4f48-4e34-ba2a-705476c9e3ef" } },
      description: args.description,
      url: args.url,
    },
    include: { createdBy: true },
  });
};

const update_post: MutationResolvers["update_post"] = async (
  _parent,
  args,
  context
) => {
  return await context.prisma.link.update({
    data: {
      ...(args.description != null && { description: args.description }), // description: args.description ?? undefined,
      ...(args.url != null && { url: args.url }), // url: args.url ?? undefined,
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
