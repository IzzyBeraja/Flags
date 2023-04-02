import applyMiddleware from "./middleware/middleware";

import express from "express";

const app = express();

applyMiddleware(app);

const port = Number.parseInt(process.env["PORT"] ?? "4000");
app.listen(port, () =>
  console.log(`Starting server on http://localhost:${port}`)
);
