import { objectType } from "nexus";

export const User = objectType({
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("email");
    t.nonNull.string("name");
    t.nonNull.list.nonNull.field("links", {
      resolve: (parent, _, context) => {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .links();
      },
      type: "User",
    });
  },
  name: "User",
});
