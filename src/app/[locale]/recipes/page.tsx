import dynamic from 'next/dynamic';

import RecipeCard from '@/app/ui/recipes/RecipeCard';
import { api } from '@/trpc/server';
import { getScopedI18n } from '@/app/locales/server';
import { getServerAuthSession } from '@/server/auth';
import FiltersPanel from './_filters-panel/filters-panel';

const Search = dynamic(() => import('@/app/ui/Search'));
const Pagination = dynamic(() => import('@/app/ui/Pagination'));

interface PageProps {
  searchParams?: {
    search?: string;
    page?: string;
    category?: string | string[];
  };
}

const PAGE_ITEMS_COUNT = 5;

function stringToArray(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }
  if (typeof value === 'string') {
    return [value];
  }
  return value;
}

export default async function Page({ searchParams }: PageProps) {
  const categories = stringToArray(searchParams?.category);
  const search = searchParams?.search ?? '';
  const page = Number(searchParams?.page) || 1;
  const skip = (page - 1) * PAGE_ITEMS_COUNT;
  const take = PAGE_ITEMS_COUNT;
  const recipes = await api.recipe.getList.query({
    search,
    take,
    skip,
    categories,
  });
  const session = await getServerAuthSession();

  const t = await getScopedI18n('recipes');

  return (
    <div className="m-auto flex w-full flex-col justify-center gap-2 px-2 pb-2 pt-4 md:flex-row xl:px-0">
      <FiltersPanel />

      {/* <div className='px-2'>
      </div> */}
      <div className="flex max-w-3xl flex-1 flex-col justify-center gap-2">
        <div className="w-full ">
          <Search placeholder={t('search')} />
        </div>
        <div className="flex flex-grow flex-col items-center gap-3 md:gap-6">
          {recipes.data.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              key={recipe.id}
              disableFavorite={!session}
            />
          ))}
        </div>
        <div className="mt-4 flex w-full justify-center">
          <Pagination
            totalPages={Math.ceil(recipes.count / PAGE_ITEMS_COUNT)}
          />
        </div>
      </div>
    </div>
  );
}
