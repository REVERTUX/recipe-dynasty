import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { LuClock } from 'react-icons/lu';
import { BiDish } from 'react-icons/bi';

import { type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '@/server/api/root';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Rating from '../Rating';

const FavoriteButton = dynamic(() => import('./FavoriteButton'));

interface RecipeCardProps {
  recipe: inferRouterOutputs<AppRouter>['recipe']['getList']['data'][number];
  disableFavorite: boolean;
}

async function RecipeCard({
  recipe: { cookingTime, description, id, rating, servings, title, imageUrl },
  disableFavorite,
}: RecipeCardProps) {
  return (
    <Card className="flex w-full max-w-3xl cursor-pointer flex-col justify-center shadow-md transition-shadow hover:shadow-2xl">
      <Link href={`recipes/${id}`}>
        {imageUrl && (
          <div className="relative h-96 w-full">
            <Image src={imageUrl} alt={title} className="rounded-t-md" fill />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-3xl">
            {title}
            <FavoriteButton recipeId={id} disabled={disableFavorite} />
          </CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <RecipeMeta
            cookingTime={cookingTime}
            servings={servings}
            rating={rating}
          />
        </CardContent>
      </Link>
    </Card>
  );
}

export default RecipeCard;

type RecipeMetaProps = Pick<
  RecipeCardProps['recipe'],
  'cookingTime' | 'servings' | 'rating'
>;

function RecipeMeta({ cookingTime, servings, rating }: RecipeMetaProps) {
  return (
    <div className="flex flex-col gap-2 text-lg">
      <div className="flex gap-4">
        <div className="flex items-center gap-1">
          <LuClock size={24} />
          <span>
            {cookingTime?.value}
            {cookingTime?.unit}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <BiDish size={24} />
          <span>{servings}</span>
        </div>
      </div>
      <div>
        <Rating max={5} value={rating ?? 0} />
      </div>
    </div>
  );
}
