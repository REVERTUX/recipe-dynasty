/* eslint-disable jsx-a11y/label-has-associated-control */
import type { DetailedHTMLProps, TextareaHTMLAttributes } from 'react';

import Textarea from './Textarea';

interface FormTextareaProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  error?: boolean;
  errorMessage?: string;
  label: string;
  name: string;
  id: string;
}

function FormTextarea(props: FormTextareaProps) {
  const { error, errorMessage, ...textareaProps } = props;
  return (
    <div className="w-full">
      <label
        htmlFor={props.id}
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        {props.label}
      </label>
      <div className="flex">
        <Textarea {...textareaProps} />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default FormTextarea;
