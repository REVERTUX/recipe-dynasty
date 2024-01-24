'use client';

import { type MouseEvent, useState } from 'react';
import { HiOutlineStar } from 'react-icons/hi2';
import clsx from 'clsx';
import { api } from '@/trpc/react';

interface FavoriteButtonProps {
  favorite: boolean;
  recipeId: string;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FavoriteButton({ favorite, recipeId, disabled }: FavoriteButtonProps) {
  const [active, setActive] = useState<boolean>(favorite);
  const { mutate, isLoading } = api.recipe.favorite.useMutation({
    onSuccess(data) {
      setActive(data);
    },
  });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLoading) return;
    mutate({ id: recipeId, favorite: !active });
  };

  return (
    <div className="float-right">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled ?? isLoading}
        aria-label="favorite"
      >
        <HiOutlineStar
          size={24}
          className={clsx('transition-colors', {
            'fill-yellow-400 text-yellow-400': active,
          })}
        />
      </button>
    </div>
  );
}

export default FavoriteButton;
