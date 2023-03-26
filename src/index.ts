import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// import { context } from "./context";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

export const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const port = Number.parseInt(process.env["PORT"] ?? "4000");
const { url } = await startStandaloneServer(server, { listen: { port } });

console.log(`🚀 Server ready at ${url}`);
