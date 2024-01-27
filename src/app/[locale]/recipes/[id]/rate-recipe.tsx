'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { TbStar } from 'react-icons/tb';
import { toast } from 'sonner';

import { api } from '@/trpc/react';
import { useScopedI18n } from '@/app/locales/client';

interface RateRecipeProps {
  recipeId: string;
}

const MAX_VALUE = 5;

function RateRecipe({ recipeId }: RateRecipeProps) {
  const [mouseRating, setMouseRating] = useState<number>(0);
  const utils = api.useUtils();
  const { data } = api.rating.getRecipePersonal.useQuery({ recipeId });
  const { mutate, isLoading } = api.rating.set.useMutation();
  const t = useScopedI18n('reviews');

  const handleStarClick = (score: number) => {
    if (isLoading) return;
    setMouseRating(score);
    mutate(
      { recipeId, score },
      {
        onSuccess(data) {
          void utils.rating.getRecipeAvg.invalidate({ recipeId });
          void utils.rating.getRecipePersonal.invalidate({ recipeId });
          toast.success(t('notification.success', { rating: data }));
        },
        onError() {
          toast.error(t('notification.error'));
        },
      }
    );
  };

  const handleStarMouseOver = (score: number) => {
    setMouseRating(score);
  };

  const renderIcons = (value: number) => {
    if (value > MAX_VALUE) {
      throw Error('value cannot exceed max');
    }

    const getStar = (_value: number) => {
      const active =
        (_value <= Math.round(value) && mouseRating === 0) ||
        _value <= Math.round(mouseRating);

      return (
        <TbStar
          key={_value}
          onMouseOver={() => handleStarMouseOver(_value)}
          onClick={() => handleStarClick(_value)}
          className={clsx('h-6 w-6 cursor-pointer transition-colors', {
            'fill-yellow-500 text-yellow-500': active,
          })}
        />
      );
    };

    const arr = [];

    for (let index = 1; index <= Math.ceil(MAX_VALUE); index += 1) {
      arr.push(getStar(index));
    }

    return arr;
  };

  if (!data) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h5 className="text-xl font-medium">{t('rate')}</h5>
      <div className="flex gap-1" onMouseLeave={() => setMouseRating(0)}>
        {renderIcons(data.value)}
      </div>
    </div>
  );
}

export default RateRecipe;
