import applyMiddleware from "./middleware/middleware";

import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

applyMiddleware(app);

const port = Number.parseInt(process.env["PORT"] ?? "4000");
app.listen(port, () => console.log(`Starting server on http://localhost:${port}`));
