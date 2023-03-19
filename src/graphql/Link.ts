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

export const Mutation = extendType({
  definition(t) {
    t.nonNull.field("post", {
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
