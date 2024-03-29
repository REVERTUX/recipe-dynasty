import { z } from 'zod';
import { type Prisma } from '@prisma/client';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { CreateRecipe, EditRecipe } from '@/app/lib/recipe/shema';
import { allowOnlyInProduction, ratelimit } from '@/server/ratelimiter';
import { TRPCError } from '@trpc/server';
import { getLogger } from '@/utils/logger';
import { userHasRole } from '@/server/auth';
import { RecipePaginationShema } from '../schema';

const logger = getLogger();

export const recipeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateRecipe)
    .mutation(async ({ ctx, input }) => {
      const { nutrients, cookingTime } = input;
      const userId = ctx.session.user.id;

      if (allowOnlyInProduction()) {
        const { success } = await ratelimit.createRecipe.limit(userId);
        if (!success) {
          logger.warn('Rate limit: create recipe', {
            userId,
          });
          throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
        }
      }

      if (!userHasRole(ctx.session, 'MEMBER')) {
        logger.error('User tried to create recipe without valid rights', {
          userId,
        });
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      logger.info('Creating recipe', { userId });

      const recipe = await ctx.db.recipe.create({
        data: {
          title: input.title,
          description: input.description,
          calories: input.calories,
          servings: input.servings,
          imageUrl: input.imageUrl,
          userId,
          categories: {
            createMany: {
              data: input.categories.map((category) => ({
                categoryId: category,
              })),
            },
          },
          cookingTime: {
            create: {
              ...cookingTime,
            },
          },
          nutrients: {
            create: { ...nutrients },
          },
          steps: { create: { steps: input.steps } },
        },
      });

      logger.info('Created recipe', {
        userId,
        recipeId: recipe.id,
      });

      return recipe;
    }),

  update: protectedProcedure
    .input(EditRecipe)
    .mutation(async ({ ctx, input }) => {
      const { nutrients, cookingTime } = input;

      const recipeId = input.id;
      const userId = ctx.session.user.id;

      if (allowOnlyInProduction()) {
        const { success } = await ratelimit.editRecipe.limit(userId);
        if (!success) {
          logger.warn('Rate limit: create recipe', {
            userId: userId,
          });
          throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
        }
      }

      const recipeExist = await ctx.db.recipe.findFirst({
        where: { id: { equals: recipeId } },
        select: { userId: true },
      });

      if (!recipeExist) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (
        recipeExist.userId !== userId &&
        !ctx.session.user.roles.includes('ADMIN')
      ) {
        logger.error('User tried to edit recipe he do not have rights to', {
          userId: userId,
          recipeId,
        });
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      logger.info('Editing recipe', {
        userId: userId,
        recipeId,
      });

      const recipe = await ctx.db.recipe.update({
        data: {
          title: input.title,
          description: input.description,
          calories: input.calories,
          servings: input.servings,
          imageUrl: input.imageUrl,
          lastUpdated: new Date(),
          categories: {
            deleteMany: { categoryId: { notIn: input.categories } },
            createMany: {
              data: input.categories.map((category) => ({
                categoryId: category,
              })),
              skipDuplicates: true,
            },
          },
          cookingTime: {
            update: {
              ...cookingTime,
            },
          },
          nutrients: {
            update: { ...nutrients },
          },
          steps: {
            update: {
              data: { steps: input.steps },
              where: { recipeId: recipeId },
            },
          },
        },
        where: { id: recipeId },
      });

      logger.info('Edited recipe', {
        userId: userId,
        recipeId: recipe.id,
      });

      return recipe;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const recipeId = input.id;
      const userId = ctx.session.user.id;

      if (allowOnlyInProduction()) {
        const { success } = await ratelimit.editRecipe.limit(userId);
        if (!success) {
          logger.warn('Rate limit: delete recipe', {
            userId: userId,
          });
          throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
        }
      }

      if (!ctx.session.user.roles.includes('ADMIN')) {
        logger.error('User tried to delete recipe he do not have rights to', {
          recipeId,
          userId,
        });
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const deleteCookingTime = ctx.db.cookingTime.delete({
        where: { recipeId },
      });

      const deleteCategories = ctx.db.recipeCategory.deleteMany({
        where: { recipeId },
      });

      const deleteSteps = ctx.db.recipeSteps.delete({
        where: { recipeId },
      });

      const deleteNutrients = ctx.db.nutrients.delete({
        where: { recipeId },
      });

      const deleteFavorite = ctx.db.favorite.deleteMany({
        where: { recipeId },
      });

      const deleteRecipeRratingAvg = ctx.db.recipeRatingAvg.deleteMany({
        where: { recipeId },
      });

      const deleteRecipeRrating = ctx.db.recipeRating.deleteMany({
        where: { recipeId },
      });

      const deleteRecipe = ctx.db.recipe.delete({
        where: { id: recipeId },
      });

      logger.info('Deleting recipe', { recipeId, userId });

      try {
        await ctx.db.$transaction([
          deleteCookingTime,
          deleteCategories,
          deleteSteps,
          deleteNutrients,
          deleteFavorite,
          deleteRecipeRratingAvg,
          deleteRecipeRrating,
          deleteRecipe,
        ]);
        logger.info('Deleted recipe', { recipeId, userId });
      } catch (error) {
        logger.error('Failed to delete recipe', { recipeId, userId });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete recipe',
        });
      }
    }),

  getList: publicProcedure
    .input(RecipePaginationShema)
    .query(
      async ({
        ctx,
        input: { search, skip, take, sortBy, orderBy, categories, favorite },
      }) => {
        const where: Prisma.RecipeWhereInput = {
          title: { contains: search, mode: 'insensitive' },
          categories: {},
          favorite: {},
        };

        if (categories?.length) {
          where.categories!.some = { categoryId: { in: categories } }; // TODO should only contain selected categories
        }

        if (favorite) {
          where.favorite!.some = {};
        }

        const data = await ctx.db.recipe.findMany({
          skip,
          take,
          orderBy: getListSortBy(sortBy, orderBy),
          where,
          include: {
            categories: true,
            nutrients: true,
            cookingTime: true,
          },
        });

        const count = await ctx.db.recipe.count({
          where,
        });

        return { data, count };
      }
    ),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return ctx.db.recipe.findFirstOrThrow({
        where: { id: { equals: id } },
        include: {
          categories: {
            select: {
              category: { select: { name_en: true, name_pl: true, id: true } },
            },
          },
          nutrients: { select: { carbs: true, fat: true, protein: true } },
          cookingTime: { select: { unit: true, value: true } },
        },
      });
    }),

  getStep: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return ctx.db.recipeSteps.findFirstOrThrow({
        where: { recipeId: { equals: id } },
        select: { steps: true },
      });
    }),
});

type RecipeOrderBy = keyof Prisma.RecipeOrderByWithRelationInput;

function getListSortBy(
  field: string | undefined,
  order: Prisma.SortOrder = 'desc'
): Prisma.RecipeOrderByWithRelationInput {
  const availableFields: RecipeOrderBy[] = ['creationDate', 'title'];
  if (!field || !availableFields.includes(field as RecipeOrderBy)) {
    return { creationDate: order };
  }

  return { field: order } as Prisma.RecipeOrderByWithRelationInput;
}
