import { extendType, nonNull, objectType, stringArg } from "nexus";

export const Link = objectType({
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("url");
    t.nonNull.string("description");
  },
  name: "Link",
});

export const Query = extendType({
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      description: "Returns all posts",
      resolve: (_, __, context) => context.prisma.link.findMany(),
      type: "Link",
    });
  },
  type: "Query",
});

export const createPostMutation = extendType({
  definition(t) {
    t.nonNull.field("create_post", {
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      description: "Creates a post",
      resolve: (_, args, context) => {
        return context.prisma.link.create({
          data: {
            description: args.description,
            url: args.url,
          },
        });
      },
      type: "Link",
    });
  },
  type: "Mutation",
});

export const updatePostMutation = extendType({
  definition(t) {
    t.nonNull.field("update_post", {
      args: {
        description: stringArg(),
        id: nonNull(stringArg()),
        url: stringArg(),
      },
      description: "Updates a post",
      resolve: (_, args, context) => {
        return context.prisma.link.update({
          data: {
            ...(args.description != null && { description: args.description }),
            ...(args.url != null && { url: args.url }),
          },
          where: {
            id: args.id,
          },
        });
      },
      type: "Link",
    });
  },
  type: "Mutation",
});

export const deletePostMutation = extendType({
  definition(t) {
    t.nonNull.field("delete_post", {
      args: {
        id: nonNull(stringArg()),
      },
      description: "Deletes a post",
      resolve: (_, args, context) => {
        return context.prisma.link.delete({
          where: {
            id: args.id,
          },
        });
      },
      type: "Link",
    });
  },
  type: "Mutation",
});
