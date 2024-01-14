/* eslint-disable jsx-a11y/label-has-associated-control */
import clsx from 'clsx';
import Input from './Input';
import { Label } from '@/components/ui/label';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
      <Label htmlFor={props.id}>{props.label}</Label>
      <div className="flex">
        <Input
          {...inputProps}
          className={clsx(rightAdornment && 'rounded-none rounded-s-lg')}
        />
        {rightAdornment && (
          <span className="rounded-s-0 inline-flex items-center rounded-e-md border px-3 text-sm">
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
