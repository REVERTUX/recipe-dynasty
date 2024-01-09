/* eslint-disable jsx-a11y/label-has-associated-control */
import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import Input from './Input';

interface FormInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error?: boolean;
  errorMessage?: string;
  label: string;
  name: string;
  id: string;
  rightAdornment?: string | React.ReactNode;
}

function FormInput(props: FormInputProps) {
  const { rightAdornment, errorMessage, ...inputProps } = props;
  return (
    <div className="w-full">
      <label
        htmlFor={props.id}
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        {props.label}
      </label>
      <div className="flex">
        <Input
          {...inputProps}
          className={clsx(rightAdornment && 'rounded-none rounded-s-lg')}
        />
        {rightAdornment && (
          <span className="rounded-s-0 inline-flex items-center rounded-e-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900">
            {rightAdornment}
          </span>
        )}
      </div>
      {props.error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default FormInput;
