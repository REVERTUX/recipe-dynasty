import { getScopedI18n } from '@/app/locales/server';
import { api } from '@/trpc/server';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import Rating from '../Rating';

interface RecipeRatingProps {
  id: string;
}

async function RecipeRating({ id }: RecipeRatingProps) {
  const rating = await api.rating.getRecipeAvg.query({ recipeId: id });
  const t = await getScopedI18n('reviews');

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-1">
            <Rating max={5} value={rating.value} />
            <span>{rating.value.toPrecision(3)} / 5</span>
          </TooltipTrigger>
          <TooltipContent>
            {rating.count} {t('reviews', { count: rating.count })}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default RecipeRating;
