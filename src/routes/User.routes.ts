import express from "express";

const router = express.Router();

router.get("/getUser", async (_req, res) => {
  const data = await _req.prisma.user.findMany({
    include: { links: true },
  });
  res.json(data);
});

export default router;
