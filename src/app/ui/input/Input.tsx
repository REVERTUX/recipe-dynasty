import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InuptProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error?: boolean;
}

function Input(props: InuptProps) {
  const { error, ...inputProps } = props;
  const basicClasses =
    'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500';

  const errorClasses =
    'bg-red-50  border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500';

  return (
    <input
      {...inputProps}
      className={clsx(basicClasses, props.className, error && errorClasses)}
    />
  );
}

export default Input;
