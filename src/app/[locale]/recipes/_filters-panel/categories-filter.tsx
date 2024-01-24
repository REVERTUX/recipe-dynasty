'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/ui/badge';
import { api } from '@/trpc/react';
import { useCurrentLocale, useScopedI18n } from '@/app/locales/client';
import { getTranslationByLocale } from '@/app/lib/utils';

const SELECT_DEBOUNCE_MS = 500;
const CATEGORY_SEARCH_PARAM_KEY = 'category';

function CategoriesFilter() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>(
    searchParams.getAll(CATEGORY_SEARCH_PARAM_KEY) || []
  );
  const [debouncedCategories] = useDebounce(selected, SELECT_DEBOUNCE_MS);
  const { data: categories } = api.categories.getList.useQuery({});

  const firstLoad = useRef(false);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useCurrentLocale();
  const t = useScopedI18n('filter');

  const handleClick = (id: string) => {
    setSelected((prevState) => {
      if (selected.includes(id)) {
        return prevState.filter((sele) => sele !== id);
      }
      return prevState.concat(id);
    });
  };

  useEffect(() => {
    if (!firstLoad.current) {
      firstLoad.current = true;
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    params.delete(CATEGORY_SEARCH_PARAM_KEY);
    if (debouncedCategories.length) {
      debouncedCategories.forEach((id) => {
        params.append(CATEGORY_SEARCH_PARAM_KEY, id);
      });
    } else {
    }
    router.replace(`${pathname}?${params.toString()}` as never);
  }, [debouncedCategories]);

  if (!categories) return null;

  return (
    <div>
      <h4 className="pb-1 text-xl">{t('categories')}</h4>
      <ul className="flex flex-wrap gap-1">
        {categories.data.map(({ id, name_en, name_pl }) => (
          <li key={id}>
            <Badge
              role="button"
              tabIndex={0}
              onClick={() => handleClick(id)}
              variant={selected.includes(id) ? 'default' : 'secondary'}
            >
              {getTranslationByLocale(locale, name_en, name_pl)}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesFilter;
