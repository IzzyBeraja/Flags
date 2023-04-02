import LinkRoutes from "./Link.routes";
import UserRoutes from "./User.routes";

import express from "express";

const router = express.Router();
router.use("/user", UserRoutes);
router.use("/link", LinkRoutes);

export default router;
