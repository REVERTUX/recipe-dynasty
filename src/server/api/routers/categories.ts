import { z } from 'zod';
import { type Prisma } from '@prisma/client';
import { getLogger } from '@/utils/logger';
import { userHasRole } from '@/server/auth';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { CreateCategory, EditCategory, PaginationShema } from '../schema';

const logger = getLogger();

export const categoriesRouter = createTRPCRouter({
  getList: publicProcedure
    .input(PaginationShema)
    .query(async ({ ctx, input: { search, skip, take } }) => {
      const where: Prisma.CategoryWhereInput = {
        OR: [
          { name_en: { contains: search ?? '', mode: 'insensitive' } },
          { name_pl: { contains: search ?? '', mode: 'insensitive' } },
        ],
      };

      const data = await ctx.db.category.findMany({
        skip,
        take,
        select: { name_pl: true, name_en: true, id: true },
        where,
      });

      const count = await ctx.db.category.count({
        where,
      });

      return { data, count };
    }),

  create: protectedProcedure
    .input(CreateCategory)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { name_en, name_pl } = input;

      if (!userHasRole(ctx.session, 'ADMIN')) {
        logger.error('User tried to create category without rights to', {
          userId,
        });
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      logger.info('Creating category', {
        userId,
      });

      try {
        const category = await ctx.db.category.create({
          data: { name_en, name_pl },
        });
        logger.info('Created category', {
          userId,
          categoryId: category.id,
        });

        return category;
      } catch (error) {
        throw new TRPCError({ code: 'CONFLICT' });
      }
    }),

  update: protectedProcedure
    .input(EditCategory)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, name_en, name_pl } = input;

      if (!userHasRole(ctx.session, 'ADMIN')) {
        logger.error('User tried to update category without rights to', {
          userId,
        });
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const categoryExists = await ctx.db.category.findFirst({ where: { id } });

      if (!categoryExists) {
        logger.error('Category does not exists', { userId });
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      logger.info('Updating category', {
        userId,
        categoryId: id,
      });

      const category = await ctx.db.category.update({
        data: { name_en, name_pl },
        where: { id },
      });

      logger.info('Updated category', {
        userId,
        categoryId: id,
      });

      return category;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id } = input;

      if (!userHasRole(ctx.session, 'ADMIN')) {
        logger.error('User tried to delete category without rights to', {
          userId,
        });
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const categoryExists = await ctx.db.category.findFirst({ where: { id } });

      if (!categoryExists) {
        logger.error('Category does not exists', { userId });
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      logger.info('Deleting category', {
        userId,
        categoryId: id,
      });

      const recipeCategory = ctx.db.recipeCategory.deleteMany({
        where: { categoryId: id },
      });

      const category = ctx.db.category.delete({
        where: { id },
      });

      try {
        await ctx.db.$transaction([recipeCategory, category]);
        logger.info('Deleted category', {
          userId,
          categoryId: id,
        });
      } catch (error) {
        logger.error('Failed to delete category', {
          userId,
          categoryId: id,
        });

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete category',
        });
      }
    }),
});
