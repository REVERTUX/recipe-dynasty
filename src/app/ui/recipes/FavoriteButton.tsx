'use client';

import { type MouseEvent } from 'react';
import { HiOutlineStar } from 'react-icons/hi2';
import clsx from 'clsx';
import { api } from '@/trpc/react';

interface FavoriteButtonProps {
  recipeId: string;
  disabled?: boolean;
}

function FavoriteButton({ recipeId, disabled }: FavoriteButtonProps) {
  const { data: favorite, isLoading: isLoadingFavorite } =
    api.favorite.getOne.useQuery({ recipeId });

  const utils = api.useUtils();
  const { mutate, isLoading } = api.favorite.set.useMutation({
    onSuccess() {
      void utils.favorite.getOne.invalidate({ recipeId });
    },
  });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLoading) return;
    mutate({ id: recipeId, favorite: !favorite });
  };

  return (
    <div className="float-right">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled ?? (isLoading || isLoadingFavorite)}
        aria-label="favorite"
      >
        <HiOutlineStar
          size={24}
          className={clsx('transition-colors', {
            'fill-yellow-400 text-yellow-400': favorite,
          })}
        />
      </button>
    </div>
  );
}

export default FavoriteButton;
