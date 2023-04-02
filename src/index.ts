import prismaMiddleware from "./middleware/prisma.middleware";
import router from "./routes/router";

import express from "express";

const app = express();

app.use(express.json());
app.use(prismaMiddleware);
app.use("/api", router);

const port = Number.parseInt(process.env["PORT"] ?? "4000");
app.listen(port, () =>
  console.log(`Starting server on http://localhost:${port}`)
);
