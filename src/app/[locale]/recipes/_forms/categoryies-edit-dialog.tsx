'use client';

import { type Dispatch, type SetStateAction } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCurrentLocale, useI18n } from '@/app/locales/client';
import { api } from '@/trpc/react';
import { getTranslationByLocale } from '@/app/lib/utils';
import { type Categories } from './categories-form';

interface CategoriesEditDialog {
  activeCategories: Categories;
  setActiveCategories: Dispatch<SetStateAction<Categories>>;
}

function CategoriesEditDialog({
  activeCategories,
  setActiveCategories,
}: CategoriesEditDialog) {
  const { data: categories, isLoading } = api.categories.getList.useQuery({});
  const t = useI18n();
  const locale = useCurrentLocale();

  const handleCategoryClick = (
    id: string,
    name_en: string,
    name_pl: string
  ) => {
    const category = activeCategories?.find(
      ({ category }) => category.id === id
    );
    if (category) {
      setActiveCategories((prevState) =>
        prevState.filter(({ category }) => category.id !== id)
      );
    } else {
      setActiveCategories((prevState) =>
        prevState.concat({ category: { name_en, name_pl, id } })
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button type="button" disabled={isLoading}>
          <Badge size="big" variant="secondary" className="flex gap-1">
            {t('recipe.categories.addRemove')}
          </Badge>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('recipe.delete.title')}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-1">
          {categories?.data.map(({ name_en, name_pl, id }) => (
            <button
              type="button"
              key={id}
              onClick={() => handleCategoryClick(id, name_en, name_pl)}
            >
              <Badge
                size="big"
                variant={
                  activeCategories.findIndex(
                    ({ category }) => category.id === id
                  ) !== -1
                    ? 'default'
                    : 'secondary'
                }
              >
                {getTranslationByLocale(locale, name_en, name_pl)}
              </Badge>
            </button>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>{t('common.close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CategoriesEditDialog;
