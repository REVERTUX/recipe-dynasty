import RecipeCardPlaceholder from '../ui/recipes/RecipeCardPlaceholder';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-2">
      <div className="h-8 w-full max-w-3xl bg-gray-200 dark:bg-gray-700"></div>
      <RecipeCardPlaceholder />
      <RecipeCardPlaceholder />
      <RecipeCardPlaceholder />
      <RecipeCardPlaceholder />
      <RecipeCardPlaceholder />
    </div>
  );
}
