import { z } from 'zod';

export const CategoryShema = z.object({
  id: z.string(),
  name_pl: z.string().trim().min(3),
  name_en: z.string().trim().min(3),
});

export const CreateCategory = CategoryShema.omit({
  id: true,
});

export const EditCategory = CategoryShema;

export const PaginationShema = z.object({
  search: z.string().optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
});

export const RecipePaginationShema = PaginationShema.extend({
  categories: z.string().array().optional(),
});
