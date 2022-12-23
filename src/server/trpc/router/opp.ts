import { TRPCError } from "@trpc/server";
import {
  oppCreateSchema,
  oppEditSchema,
  oppRateSchema,
} from "../../../schemas";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import type { LayersModel, Tensor } from "@tensorflow/tfjs";
import { z } from "zod";

let cachedModel: LayersModel | undefined = undefined;

export const oppRouter = router({
  // Get all the service opps
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.opp.findMany();
  }),
  // Get a single service opp by id
  get: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const opp = await ctx.prisma.opp.findUnique({
        where: { id: input.id },
        include: {
          users: true,
        },
      });
      return { ...opp, categories: opp?.categories.split(",") };
    }),
  // Create a new service opp
  create: protectedProcedure
    .input(oppCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          message: "Only admins can create service opportunities.",
          code: "UNAUTHORIZED",
        });
      }
      const { categories, ...rest } = input;
      return ctx.prisma.opp.create({
        data: {
          ...rest,
          categories: categories.join(","),
        },
      });
    }),
  edit: protectedProcedure
    .input(oppEditSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          message: "Only admins can edit service opportunities.",
          code: "UNAUTHORIZED",
        });
      }
      const { categories, ...rest } = input;
      return ctx.prisma.opp.update({
        where: { id: input.id },
        data: {
          ...rest,
          categories: categories.join(","),
        },
      });
    }),
  // Add a user to a service opp
  add: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const opp = await ctx.prisma.opp.findUnique({
        where: { id: input.id },
      });
      if (!opp) {
        throw new TRPCError({
          message: "Service opportunity not found.",
          code: "NOT_FOUND",
        });
      }
      await ctx.prisma.userOppAssociation.create({
        data: {
          userId: ctx.session.user.id,
          oppId: input.id,
        },
      });
    }),
  // Remove a user from a service opp
  remove: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userOppAssociation.delete({
        // where: {
        //   userId_oppId: { oppId: input.id, userId: ctx.session.user.id },
        // },
        where: {
          userId_oppId: {
            oppId: input.id,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
  // Add a rating to a service opp
  rate: protectedProcedure
    .input(oppRateSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userOppAssociation.update({
        where: {
          userId_oppId: { oppId: input.oppId, userId: ctx.session.user.id },
        },
        data: { rating: input.rating },
      });
    }),
  // Get the upcoming opps that are not already added by a user
  upcoming: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.opp.findMany({
      where: {
        start: {
          gte: new Date(),
        },
        users: {
          none: {
            userId: ctx.session.user.id,
          },
        },
      },
    });
  }),
  // Get all the past opps for a user, order by date
  userPast: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.userOppAssociation.findMany({
      where: {
        userId: ctx.session.user.id,
        opp: {
          end: {
            lte: new Date(),
          },
        },
      },
      orderBy: {
        rating: "desc",
      },
      include: {
        opp: true,
      },
    });
  }),
  // Get all the upcoming opps for a user
  userUpcoming: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.userOppAssociation.findMany({
      where: {
        userId: ctx.session.user.id,
        opp: {
          end: {
            gte: new Date(),
          },
        },
      },
      include: {
        opp: true,
      },
    });
  }),
  // Use a suggestion model to predict the next opps for a user
  suggested: protectedProcedure.query(async ({ ctx }) => {
    const associations = await ctx.prisma.userOppAssociation.findMany({
      include: {
        opp: true,
        user: true,
      },
      where: { userId: ctx.session.user.id },
    });

    const tf = (await import("@tensorflow/tfjs")).default;
    if (!cachedModel) {
      cachedModel = await tf.loadLayersModel(
        "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json" // TODO: update when the model is saved
      );
    }
    const inputs = associations.map((asc) =>
      JSON.stringify({
        userId: ctx.session.user.id,
        oppId: asc.oppId,
        rating: asc.rating,
        title: asc.opp.title,
        description: asc.opp.description,
      })
    );
    cachedModel.predict(inputs as any as Tensor[]); // TODO: Update when input shape is known
  }),
});
