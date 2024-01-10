/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client';

import type { ChangeEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      replace(`${pathname}?${params.toString()}`);
    },
    300
  );

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-400 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={handleSearch}
        defaultValue={searchParams.get('search')?.toString()}
        id="search"
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
