'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Checkbox } from '@/components/ui/checkbox';
import { useScopedI18n } from '@/app/locales/client';

const FAVORITE_DEBOUNCE_MS = 100;
const FAVORITE_SEARCH_PARAM_KEY = 'favorite';

function FavoriteFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useScopedI18n('filter');

  const handleClick = useDebouncedCallback((checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (checked) {
      params.set(FAVORITE_SEARCH_PARAM_KEY, '');
    } else {
      params.delete(FAVORITE_SEARCH_PARAM_KEY);
    }
    void router.replace(`${pathname}?${params.toString()}` as never);
  }, FAVORITE_DEBOUNCE_MS);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        onCheckedChange={handleClick}
        id="favorite"
        defaultChecked={searchParams.get(FAVORITE_SEARCH_PARAM_KEY) !== null}
      />
      <label
        htmlFor="favorite"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {t('favorite')}
      </label>
    </div>
  );
}

export default FavoriteFilter;
