import { TRPCError } from "@trpc/server";
import { type INTERESTS, interestsSchema } from "../../../schemas";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  updateInterests: protectedProcedure
    .input(interestsSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          interests: input.interests.join(","),
        },
      });
    }),
  interests: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    //SAFETY: Interests are parsed by zod before they go into the db
    return user.interests
      ? (user.interests.split(",") as unknown as typeof INTERESTS)
      : null;
  }),
});
