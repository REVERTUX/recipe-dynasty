import dynamic from 'next/dynamic';

import RecipeCard from '@/app/ui/recipes/RecipeCard';
import { api } from '@/trpc/server';
import { getScopedI18n } from '@/app/locales/server';

const Search = dynamic(() => import('@/app/ui/Search'));
const Pagination = dynamic(() => import('@/app/ui/Pagination'));

interface PageProps {
  searchParams?: {
    search?: string;
    page?: string;
  };
}

const PAGE_ITEMS_COUNT = 5;

export default async function Page({ searchParams }: PageProps) {
  const search = searchParams?.search ?? '';
  const page = Number(searchParams?.page) || 1;
  const skip = (page - 1) * PAGE_ITEMS_COUNT;
  const take = PAGE_ITEMS_COUNT;
  const recipes = await api.recipe.getList.query({ search, take, skip });

  const t = await getScopedI18n('recipes');

  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-center p-2 align-middle">
        <div className="w-full max-w-3xl">
          <Search placeholder={t('search')} />
        </div>
      </div>
      <div className="max-w-xs flex-shrink"></div>
      <div className="flex flex-grow flex-col items-center gap-6 p-2">
        {recipes.data.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
        <div className="mt-5 flex w-full justify-center">
          <Pagination
            totalPages={Math.ceil(recipes.count / PAGE_ITEMS_COUNT)}
          />
        </div>
      </div>
    </div>
  );
}
