import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import { Context, context } from "./context";
import { resolvers } from "./resolvers/resolvers";
import { typeDefs } from "./schema";
import http from "http";

const app = express();

const httpServer = http.createServer(app);

export const server = new ApolloServer<Context>({
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  resolvers,
  typeDefs,
});

await server.start();

app.use(
  "/",
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, { context })
);

const port = Number.parseInt(process.env["PORT"] ?? "4000");
await new Promise<void>(resolve => httpServer.listen(port, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);
