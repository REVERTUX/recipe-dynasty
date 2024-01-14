import clsx from 'clsx';
import { Input as InputComp } from '@/components/ui/input';

interface InuptProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

function Input(props: InuptProps) {
  const { error, ...inputProps } = props;

  const errorClasses =
    'bg-red-50  border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500';

  return (
    <InputComp
      {...inputProps}
      className={clsx(props.className, error && errorClasses)}
    />
  );
}

export default Input;
