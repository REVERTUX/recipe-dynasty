import { createTRPCRouter } from '@/server/api/trpc';
import { recipeRouter } from './routers/recipe';
import { categoriesRouter } from './routers/categories';
import { favoriteRouter } from './routers/favorite';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  categories: categoriesRouter,
  favorite: favoriteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
