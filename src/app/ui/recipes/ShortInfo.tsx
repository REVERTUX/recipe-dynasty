import { ClockIcon } from '@heroicons/react/24/solid';
import { type CookingTime } from '@prisma/client';
import Rating from '../Rating';

interface ShortInfoProps {
  cookingTime: CookingTime;
  servings: number;
  rating?: number;
}

function ShortInfo({ cookingTime, rating, servings }: ShortInfoProps) {
  return (
    <div className="flex flex-col gap-1 text-lg">
      <div className="flex gap-1">
        <ClockIcon height={24} width={24} />
        {cookingTime.value}
        {cookingTime.unit}
      </div>
      <div className="flex gap-1">Servings: {servings}</div>
      <Rating value={rating ?? 0} max={5} />
    </div>
  );
}

export default ShortInfo;
