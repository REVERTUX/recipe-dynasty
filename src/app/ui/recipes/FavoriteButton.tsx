'use client';

import { type MouseEvent, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface FavoriteButtonProps {
  favorite: boolean;
  recipeId: string;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FavoriteButton({ favorite, recipeId, disabled }: FavoriteButtonProps) {
  const [active, setActive] = useState<boolean>(favorite);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setActive((prev) => !prev);
  };

  return (
    <div className="float-right">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label="favorite"
      >
        <StarIcon
          width={24}
          height={24}
          className={clsx('transition-colors', {
            'fill-yellow-400 text-yellow-400': active,
          })}
        />
      </button>
    </div>
  );
}

export default FavoriteButton;
