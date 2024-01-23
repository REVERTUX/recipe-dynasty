import { z } from 'zod';

export type CreateRecipeState = {
  errors?: {
    title?: string[];
    description?: string[];
    imageUrl?: string[];
    cookingTime?: string[];
    servings?: string[];
    nutrients?: string[];
    calories?: string[];
    categories?: string[];
    steps?: string[];
  };
  message?: string | null;
};

export const RecipeShema = z.object({
  id: z.string(),
  title: z
    .string({
      invalid_type_error: 'Please provide recipe title.',
    })
    .min(3, { message: 'Title must be longer than 3 letters' }),
  description: z
    .string({
      invalid_type_error: 'Please provide recipe description.',
    })
    .min(20, { message: 'Description must be longer than 20 letters' }),
  imageUrl: z.string().optional(),
  cookingTime: z.object({
    value: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0' }),
    unit: z.string(),
  }),
  servings: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0' }),
  nutrients: z.object({
    fat: z.coerce.number().optional(),
    protein: z.coerce.number().optional(),
    carbs: z.coerce.number().optional(),
  }),
  rating: z.coerce.number(),
  calories: z.coerce.number().optional(),
  categories: z.string().array(),
  favorite: z.boolean(),
});

export const CreateRecipe = RecipeShema.omit({
  id: true,
  favorite: true,
  rating: true,
}).extend({ steps: z.string() });

export const EditRecipe = RecipeShema.omit({
  rating: true,
  favorite: true,
}).extend({ steps: z.string() });
