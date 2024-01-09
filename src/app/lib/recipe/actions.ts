'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { type CreateRecipeState, CreateRecipe } from './shema';
import { api } from '@/trpc/server';

export async function createRecipe(
  prevState: CreateRecipeState,
  formData: FormData,
  markdown: string | undefined
): Promise<CreateRecipeState> {
  const validatedFields = CreateRecipe.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl') ?? undefined,
    servings: formData.get('servings'),
    calories: formData.get('calories'),
    cookingTime: { value: formData.get('time'), unit: 'h' },
    nutrients: {
      fat: formData.get('fat'),
      protein: formData.get('protein'),
      carbs: formData.get('carbs'),
    },
    categories: [],
    steps: markdown,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to create recipe',
    };
  }

  try {
    await api.recipe.create.mutate(validatedFields.data);
  } catch (error: unknown) {
    return {
      message: 'Database Error: Failed to Create recipe',
    };
  }

  revalidatePath('/recipes');
  redirect('/recipes');
}
