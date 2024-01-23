'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { type CreateRecipeState, CreateRecipe, EditRecipe } from './shema';
import { api } from '@/trpc/server';
import { getCurrentLocale } from '@/app/locales/server';

export async function createRecipe(
  prevState: CreateRecipeState,
  formData: FormData,
  markdown: string | undefined,
  categories: string[]
): Promise<CreateRecipeState> {
  const validatedFields = CreateRecipe.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl') ?? undefined,
    servings: formData.get('servings'),
    calories: formData.get('calories'),
    cookingTime: { value: formData.get('time'), unit: 'h' },
    catergories: formData.get('categories') ?? [],
    nutrients: {
      fat: formData.get('fat'),
      protein: formData.get('protein'),
      carbs: formData.get('carbs'),
    },
    categories,
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
      message: 'Database Error: Failed to create recipe',
    };
  }
  const locale = getCurrentLocale();

  revalidatePath(`/${locale}/recipes`);
  redirect(`/${locale}/recipes`);
}

export async function editRecipe(
  prevState: CreateRecipeState,
  formData: FormData,
  id: string,
  markdown: string | undefined,
  categories: string[]
): Promise<CreateRecipeState> {
  const validatedFields = EditRecipe.safeParse({
    id,
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
    categories,
    steps: markdown,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to edit recipe',
    };
  }

  try {
    await api.recipe.update.mutate(validatedFields.data);
  } catch (error: unknown) {
    return {
      message: 'Database Error: Failed to edit recipe',
    };
  }
  const locale = getCurrentLocale();

  revalidatePath(`/${locale}/recipes`);
  redirect(`/${locale}/recipes`);
}

export const invalidatePathAndRedirect = () => {
  const locale = getCurrentLocale();

  revalidatePath(`/${locale}/recipes`);
  redirect(`/${locale}/recipes`);
};
