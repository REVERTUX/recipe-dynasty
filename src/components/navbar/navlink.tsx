'use client';

import clsx from 'clsx';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const navlinkVariants = cva('font-semibold transition-all', {
  variants: { size: { small: 'text-sm', large: 'text-lg' } },
  defaultVariants: { size: 'small' },
});

interface NavlinkProps extends LinkProps, VariantProps<typeof navlinkVariants> {
  className?: string;
  children: React.ReactNode;
}

export default function Navlink({
  children,
  className,
  size,
  ...props
}: NavlinkProps) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={clsx(
        cn(navlinkVariants({ size })),
        className,
        pathname.endsWith(
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          props.href.toString() !== '/' ? props.href.toString() : ''
        )
          ? 'text-gray-900 underline hover:text-black dark:text-gray-100 dark:hover:text-gray-100'
          : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-gray-100'
      )}
    >
      {children}
    </Link>
  );
}
