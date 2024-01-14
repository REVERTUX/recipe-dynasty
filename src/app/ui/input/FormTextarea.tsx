/* eslint-disable jsx-a11y/label-has-associated-control */

import { Label } from '@/components/ui/label';
import Textarea from './Textarea';

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
      <Label htmlFor={props.id}>{props.label}</Label>
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
