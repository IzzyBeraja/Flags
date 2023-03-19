"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const apollo_server_1 = require("apollo-server");
const schema_1 = require("./schema");
exports.server = new apollo_server_1.ApolloServer({
    schema: schema_1.schema,
});
const port = process.env["PORT"] || 4000;
exports.server.listen(port).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
