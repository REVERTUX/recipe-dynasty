'use client';

import clsx from 'clsx';
import { type MouseEvent } from 'react';
import { LuHeart } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
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
      <Button
        size="icon"
        variant="ghost"
        onClick={handleClick}
        disabled={disabled ?? (isLoading || isLoadingFavorite)}
        aria-label="favorite"
      >
        <LuHeart
          size={24}
          className={clsx('text-red-400 transition-colors', {
            'fill-red-400': favorite,
          })}
        />
      </Button>
    </div>
  );
}

export default FavoriteButton;
