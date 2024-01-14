import FavoriteButton from '@/app/ui/recipes/FavoriteButton';
import { api } from '@/trpc/server';
import Image from 'next/image';
import { BiDish } from 'react-icons/bi';
import { LuClock } from 'react-icons/lu';

interface InformationsProps {
  recipeId: string;
}

async function Informations({ recipeId }: InformationsProps) {
  const {
    calories,
    // categories,
    cookingTime,
    // creationDate,
    description,
    imageUrl,
    nutrients,
    // rating,
    servings,
    title,
  } = await api.recipe.getOne.query({ id: recipeId });

  return (
    <div className="flex flex-col gap-2 py-2">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={'recipe image'}
          width={1000}
          height={500}
          className="rounded-lg"
        />
      )}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-lg">{description}</p>
        </div>
        <div>
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
          <h3 className="mb-1 text-xl font-semibold">Nutrition</h3>
          <ul>
            <li>Protein: {`${nutrients?.protein}g` ?? 'not specified'}</li>
            <li>Carbs: {`${nutrients?.carbs}g` ?? 'not specified'}</li>
            <li>Fat: {`${nutrients?.fat}g` ?? 'not specified'}</li>
            <li>Calories: {`${calories}kcal` ?? 'not specified'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Informations;
