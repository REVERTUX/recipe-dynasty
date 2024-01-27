import clsx from 'clsx';
import { TbStarHalfFilled, TbStar } from 'react-icons/tb';

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

      const isHalfStar =
        active &&
        value !== _value &&
        Math.ceil(value) === _value &&
        value <= _value + 0.5;

      const Icon = isHalfStar ? TbStarHalfFilled : TbStar;

      return (
        <Icon
          key={_value}
          height={24}
          width={24}
          className={clsx('transition-colors', {
            'fill-yellow-500 text-yellow-500': active,
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

  return <div className="flex items-center">{renderIcons()}</div>;
}

export default Rating;
