import { Skeleton } from '@/components/ui/skeleton';
import RecipeCardPlaceholder from '../../ui/recipes/RecipeCardPlaceholder';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-2">
      <Skeleton className="h-10 w-full max-w-3xl" />
      <RecipeCardPlaceholder />
      <RecipeCardPlaceholder />
      <RecipeCardPlaceholder />
      <RecipeCardPlaceholder />
      <RecipeCardPlaceholder />
    </div>
  );
}
