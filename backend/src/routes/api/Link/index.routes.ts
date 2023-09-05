import type { RequestHandlerAsync } from "../../../types/types";

export const method = "GET";

export const route: RequestHandlerAsync = async (req, res) => {
  const data = await req.prisma.link.findMany({
    include: { createdBy: true },
  });

  res.json(data);
};
