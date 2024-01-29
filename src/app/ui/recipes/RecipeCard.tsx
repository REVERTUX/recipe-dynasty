import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { LuClock } from 'react-icons/lu';
import { BiDish } from 'react-icons/bi';

import { type RouterOutputs } from '@/trpc/shared';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RecipeRating from './recipe-rating';

const FavoriteButton = dynamic(() => import('./FavoriteButton'));

interface RecipeCardProps {
  recipe: RouterOutputs['recipe']['getList']['data'][number];
  disableFavorite: boolean;
}

async function RecipeCard({
  recipe: { cookingTime, description, id, servings, title, imageUrl },
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
          <CardTitle className="flex justify-between align-top text-3xl">
            {title}
            <FavoriteButton recipeId={id} disabled={disableFavorite} />
          </CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <RecipeMeta cookingTime={cookingTime} servings={servings} id={id} />
        </CardContent>
      </Link>
    </Card>
  );
}

export default RecipeCard;

type RecipeMetaProps = Pick<
  RecipeCardProps['recipe'],
  'cookingTime' | 'servings' | 'id'
>;

async function RecipeMeta({ cookingTime, servings, id }: RecipeMetaProps) {
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
      <RecipeRating id={id} />
    </div>
  );
}
