// https://github.com/vercel/next.js/blob/canary/examples/api-routes-cors/pages/api/cors.ts
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const prisma = new PrismaClient();

const importSchema = z.array(
  z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    categories: z.array(z.string().min(1)),
    location: z.string().min(1),
    contact: z.string().min(1),
    website: z.string().min(1),
    email: z.string().min(1),
    start: z.date(),
    end: z.date(),
  })
);
type Res = {
  name: string;
};

const importOpps = async (req: NextApiRequest, res: NextApiResponse<Res>) => {
  if (req.method === "POST") {
    const opps = importSchema.parse(req.body);
    // https://github.com/prisma/prisma/issues/11507#issuecomment-1025587202
    // TODO: Fix when we switch databases
    // await prisma.opp.createMany({
    //   data: opps.map((opp) => ({
    //     name: opp.title,
    //     description: opp.description,
    //     categories: opp.categories.join(","),
    //     location: opp.location,
    //     contact: opp.contact,
    //     website: opp.website,
    //     email: opp.email,
    //   })),
    // });
  } else {
    res.status(200).json({ name: "John Doe" });
  }
};

export default importOpps;
