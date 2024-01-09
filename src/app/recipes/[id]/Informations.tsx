import { api } from '@/trpc/server';
import Image from 'next/image';

interface InformationsProps {
  recipeId: string;
}

async function Informations({ recipeId }: InformationsProps) {
  const {
    // calories,
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
      <div className="max-w-full">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={'recipe image'}
            width={1000}
            height={500}
            className="rounded-lg"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p>{description}</p>
        <span>Servings: {servings}</span>
        <span>
          <span>Cooking time:</span>
          <span>
            {cookingTime ? (
              <>
                {cookingTime.value}
                {cookingTime.unit}
              </>
            ) : (
              'none'
            )}
          </span>
        </span>
        {nutrients && (
          <div className="flex flex-col gap-0.5">
            <span>Protein {nutrients.protein ?? 'none'}</span>
            <span>Carbs {nutrients.carbs ?? 'none'}</span>
            <span>Fat {nutrients.fat ?? 'none'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Informations;
