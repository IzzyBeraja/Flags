import AuthRoutes from "./Auth.routes";
import LinkRoutes from "./Link.routes";
import UserRoutes from "./User.routes";

import express from "express";

const router = express.Router();
router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);
router.use("/link", LinkRoutes);

export default router;
