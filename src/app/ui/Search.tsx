'use client';

import type { ChangeEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

import { Input } from '@/components/ui/input';

const SEARCH_DEBOUNCE_MS = 300;

interface SearchProps {
  placeholder: string;
  className?: string;
}

export default function Search({ placeholder, className }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');

      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      router.replace(`${pathname}?${params.toString()}` as never);
    },
    SEARCH_DEBOUNCE_MS
  );

  return (
    <div className={clsx('relative flex flex-1 flex-shrink-0', className)}>
      <label htmlFor="search" className="sr-only">
        {placeholder}
      </label>
      <Input
        className="peer block w-full rounded-md border border-gray-400 py-[9px] pl-10 text-sm outline-2"
        placeholder={placeholder}
        onChange={handleSearch}
        defaultValue={searchParams.get('search')?.toString()}
        id="search"
      />
      <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
    </div>
  );
}
