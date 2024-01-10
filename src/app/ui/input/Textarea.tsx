import type { DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextareaProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  error?: boolean;
}

function Textarea(props: TextareaProps) {
  const { error, ...textareaProps } = props;
  const basicClasses =
    'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500';

  const errorClasses =
    'bg-red-50  border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500';

  return (
    <textarea
      {...textareaProps}
      className={clsx(basicClasses, props.className, error && errorClasses)}
    />
  );
}

export default Textarea;
