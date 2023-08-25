import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const data = await req.prisma.link.findMany({
    include: { createdBy: true },
  });
  return res.json(data);
});

export default router;
