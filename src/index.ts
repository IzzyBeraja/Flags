import type { Context } from "./context";

import { context } from "./context";
import { middleware } from "./middleware/middleware";
import { resolvers } from "./resolvers/resolvers";
import { typeDefs } from "./schema";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";

const app = express();

const httpServer = http.createServer(app);

export const server = new ApolloServer<Context>({
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  resolvers,
  typeDefs,
});

await server.start();

app.use("/", middleware, expressMiddleware(server, { context }));

const port = Number.parseInt(process.env["PORT"] ?? "4000");
await new Promise<void>(resolve => httpServer.listen(port, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);
