import { extendType, nonNull, objectType, stringArg } from "nexus";

import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("url");
    t.nonNull.string("description");
  },
  name: "Link",
});

let links: NexusGenObjects["Link"][] = [
  {
    description: "Fullstack tutorial for GraphQL",
    id: "0",
    url: "www.howtographql.com",
  },
  {
    description: "Official GraphQL website",
    id: "1",
    url: "www.graphql.org",
  },
];

export const Query = extendType({
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      resolve: () => links,
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
      resolve: (_parent, args) => {
        const link = {
          description: args.description,
          id: links.length.toString(),
          url: args.url,
        };
        links.push(link);
        return link;
      },
      type: "Link",
    });
  },
  type: "Mutation",
});

/** Updates a post */
export const updatePostMutation = extendType({
  definition(t) {
    t.nonNull.field("update_post", {
      args: {
        description: stringArg(),
        id: nonNull(stringArg()),
        url: stringArg(),
      },
      description: "Updates a post",
      resolve: (_parent, args) => {
        const linkToUpdate = links.find(l => l.id === args.id);
        if (!linkToUpdate) {
          throw new Error(`Link with id ${args.id} not found`);
        }

        const link = {
          description: args.description ?? linkToUpdate.description,
          id: linkToUpdate.id,
          url: args.url ?? linkToUpdate.url,
        };
        links = links.map(l => (l.id === link.id ? link : l));
        return link;
      },
      type: "Link",
    });
  },
  type: "Mutation",
});

/** Deletes a post by ID */
export const deletePostMutation = extendType({
  definition(t) {
    t.nonNull.field("delete_post", {
      args: {
        id: nonNull(stringArg()),
      },
      description: "Deletes a post",
      resolve: (_parent, args) => {
        const linkToDelete = links.find(l => l.id === args.id);
        if (!linkToDelete) {
          throw new Error(`Link with id ${args.id} not found`);
        }

        links = links.filter(l => l.id !== linkToDelete.id);
        return linkToDelete;
      },
      type: "Link",
    });
  },
  type: "Mutation",
});
