import Image from 'next/image';
import { BiDish } from 'react-icons/bi';
import { LuClock } from 'react-icons/lu';
import dynamic from 'next/dynamic';

import { getTranslationByLocale } from '@/app/lib/utils';
import { getCurrentLocale, getScopedI18n } from '@/app/locales/server';
import { Badge } from '@/components/ui/badge';
import { api } from '@/trpc/server';

const FavoriteButton = dynamic(() => import('@/app/ui/recipes/FavoriteButton'));

interface InformationsProps {
  recipeId: string;
  disableFavorite: boolean;
}

async function Informations({ recipeId, disableFavorite }: InformationsProps) {
  const {
    calories,
    categories,
    cookingTime,
    // creationDate,
    description,
    imageUrl,
    nutrients,
    // rating,
    servings,
    title,
  } = await api.recipe.getOne.query({ id: recipeId });

  const t = await getScopedI18n('recipe');
  const locale = getCurrentLocale();

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="mr-2">
        <FavoriteButton recipeId={recipeId} disabled={disableFavorite} />
      </div>
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
          <h3 className="mb-1 text-xl font-semibold">{t('nutrients')}</h3>
          <ul>
            <li>
              {t('protein')}: {`${nutrients?.protein}g` ?? 'not specified'}
            </li>
            <li>
              {t('carbs')}: {`${nutrients?.carbs}g` ?? 'not specified'}
            </li>
            <li>
              {t('fat')}: {`${nutrients?.fat}g` ?? 'not specified'}
            </li>
            <li>
              {t('calories')}: {`${calories}kcal` ?? 'not specified'}
            </li>
          </ul>
        </div>
        {categories.length > 0 && (
          <div>
            <h3 className="mb-1 text-xl font-semibold">
              {t('categories.title')}
            </h3>
            <div className="flex flex-wrap gap-1">
              {categories.map(({ category: { id, name_en, name_pl } }) => (
                <Badge key={id} size="big" className="hover:bg-primary">
                  {getTranslationByLocale(locale, name_en, name_pl)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Informations;
