import { z } from 'zod';
import { getLogger } from '@/utils/logger';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const logger = getLogger();

export const ratingRouter = createTRPCRouter({
  set: protectedProcedure
    .input(z.object({ recipeId: z.string(), score: z.number().min(0).max(5) }))
    .mutation(async ({ ctx, input: { recipeId, score } }) => {
      const userId = ctx.session.user.id;

      const recipeExist = await ctx.db.recipe.findFirst({
        where: { id: { equals: recipeId } },
        select: { userId: true },
      });

      if (!recipeExist) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      logger.info(`Setting recipe rating to ${score}`, {
        userId,
        recipeId,
      });

      await ctx.db.recipeRating.upsert({
        create: { value: score, recipeId, userId },
        update: { value: score },
        where: { recipeId_userId: { recipeId, userId } },
        select: { value: true },
      });

      logger.info(`Setted recipe rating to ${score}`, {
        userId,
        recipeId,
      });

      return score;
    }),

  getRecipePersonal: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input: { recipeId } }) => {
      const userId = ctx.session?.user.id;

      const rating = await ctx.db.recipeRating.findFirst({
        where: { recipeId, userId },
        select: { value: true },
      });

      if (!rating) {
        return { value: 0 };
      }

      return rating;
    }),

  getRecipeAvg: publicProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input: { recipeId } }) => {
      const rating = await ctx.db.recipeRatingAvg.findFirst({
        where: { recipeId },
        select: { value: true, count: true },
      });

      if (!rating) {
        return { value: 0, count: 0 };
      }

      return rating;
    }),
});
