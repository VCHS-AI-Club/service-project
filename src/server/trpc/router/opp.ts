import { publicProcedure, router } from "../trpc";

export const oppRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.opp.findMany();
  }),
});
