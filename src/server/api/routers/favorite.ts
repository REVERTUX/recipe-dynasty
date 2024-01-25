import { z } from 'zod';
import { getLogger } from '@/utils/logger';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const logger = getLogger();

export const favoriteRouter = createTRPCRouter({
  set: protectedProcedure
    .input(z.object({ id: z.string(), favorite: z.boolean() }))
    .mutation(async ({ ctx, input: { id, favorite } }) => {
      const userId = ctx.session.user.id;
      const recipeId = id;

      const recipeExist = await ctx.db.recipe.findFirst({
        where: { id: { equals: recipeId } },
        select: { userId: true },
      });

      if (!recipeExist) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (favorite) {
        logger.info('Marking recipe as favorite', {
          userId,
          recipeId,
        });

        await ctx.db.favorite.create({
          data: { recipeId, userId },
        });

        logger.info('Marked recipe as favorite', {
          userId,
          recipeId,
        });
      } else {
        logger.info('Removing recipe as favorite', {
          userId,
          recipeId,
        });

        await ctx.db.favorite.delete({
          where: { recipeId_userId: { recipeId, userId } },
        });

        logger.info('Removed recipe as favorite', {
          userId,
          recipeId,
        });
      }

      return favorite;
    }),

  getOne: publicProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input: { recipeId } }) => {
      const userId = ctx.session?.user.id;

      if (!userId) {
        return false;
      }

      const favorite = await ctx.db.favorite.findFirst({
        where: { recipeId, userId },
      });

      return !!favorite;
    }),
});
