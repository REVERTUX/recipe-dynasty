import clsx from 'clsx';
import { StarIcon } from '@heroicons/react/24/outline';

interface RatingProps {
  value: number;
  max: number;
}

function Rating({ value, max }: RatingProps) {
  const renderIcons = () => {
    if (value > max) {
      throw Error('value cannot exceed max');
    }

    const getStar = (_value: number) => {
      const active = _value <= Math.round(value);

      return (
        <StarIcon
          key={_value}
          height={24}
          width={24}
          className={clsx('transition-colors', {
            'fill-yellow-400 text-yellow-400': active,
          })}
        />
      );
    };

    const arr = [];

    for (let index = 1; index <= Math.ceil(max); index += 1) {
      arr.push(getStar(index));
    }

    return arr;
  };

  return (
    <div className="flex items-center">
      {renderIcons()}
      <p className="ms-1 text-base font-medium text-gray-600">
        {value} out of {max}
      </p>
    </div>
  );
}

export default Rating;
