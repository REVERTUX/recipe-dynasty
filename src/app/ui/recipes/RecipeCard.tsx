/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import Link from 'next/link';

import FavoriteButton from './FavoriteButton';
import ShortInfo from './ShortInfo';
import { CookingTime, Recipe } from '@prisma/client';
import { type AppRouter } from '@/server/api/root';
import { type inferRouterOutputs } from '@trpc/server';

interface RecipeCardProps {
  recipe: inferRouterOutputs<AppRouter>['recipe']['getList']['data'][number];
}

function RecipeCard({
  recipe: { cookingTime, description, id, rating, servings, title, imageUrl },
}: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${id}`}
      key={id}
      prefetch
      className="bg-white-500 flex w-full max-w-3xl cursor-pointer flex-col justify-center rounded-md text-gray-700 shadow-xl transition-shadow hover:shadow-2xl"
    >
      {imageUrl && (
        <div className="relative h-96 w-full">
          <Image src={imageUrl} alt={title} className="rounded-t-md" fill />
        </div>
      )}
      <div className="p-3">
        <FavoriteButton favorite={false} recipeId={id} /> {/* TODO */}
        <h1 className="text-2xl font-medium">{title}</h1>
        <p className="mb-1 text-base">{description}</p>
        {/* <ShortInfo
          cookingTime={cookingTime}
          rating={rating}
          servings={servings}
        /> */}
      </div>
    </Link>
  );
}

export default RecipeCard;
