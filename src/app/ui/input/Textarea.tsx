import clsx from 'clsx';
import { Textarea as TextareaComp } from '@/components/ui/textarea';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

function Textarea(props: TextareaProps) {
  const { error, ...textareaProps } = props;

  const errorClasses =
    'bg-red-50  border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500';

  return (
    <TextareaComp
      {...textareaProps}
      className={clsx(props.className, error && errorClasses)}
    />
  );
}

export default Textarea;
