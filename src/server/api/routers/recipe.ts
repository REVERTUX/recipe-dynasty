import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { listSchema } from './recipe.schema';
import { CreateRecipe } from '@/app/lib/recipe/shema';
import { z } from 'zod';

export const recipeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateRecipe)
    .mutation(async ({ ctx, input }) => {
      const { nutrients, cookingTime } = input;

      return ctx.db.recipe.create({
        data: {
          title: input.title,
          description: input.description,
          calories: input.calories,
          servings: input.servings,
          imageUrl: input.imageUrl,
          userId: ctx.session.user.id,
          categories: {
            createMany: {
              data: input.categories.map((category) => ({
                categoryName: category,
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
    }),

  getList: publicProcedure
    .input(listSchema)
    .query(async ({ ctx, input: { search, skip, take } }) => {
      const data = await ctx.db.recipe.findMany({
        skip,
        take,
        orderBy: { creationDate: 'desc' },
        where: { title: { contains: search } },
        include: {
          categories: true,
          nutrients: true,
          cookingTime: true,
          favorite: true,
        },
      });

      const count = await ctx.db.recipe.count({
        where: { title: { contains: search } },
      });

      return { data, count };
    }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return ctx.db.recipe.findFirstOrThrow({
        where: { id: { equals: id } },
        include: {
          categories: true,
          nutrients: true,
          cookingTime: true,
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
