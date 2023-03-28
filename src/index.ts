import type { Context } from "./context";

import { context } from "./context";
import { resolvers } from "./resolvers/resolvers";
import { typeDefs } from "./schema";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { koaMiddleware } from "@as-integrations/koa";
import cors from "@koa/cors";
import http from "http";
import Koa from "koa";
import bodyParser from "koa-bodyparser";

const app = new Koa();
const httpServer = http.createServer(app.callback());

export const server = new ApolloServer<Context>({
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  resolvers,
  typeDefs,
});

await server.start();

app.use(cors()).use(bodyParser()).use(koaMiddleware(server, { context }));

const port = Number.parseInt(process.env["PORT"] ?? "4000");
await new Promise<void>(resolve => httpServer.listen(port, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);
