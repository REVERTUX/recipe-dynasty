'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { type AppRouter } from '@/server/api/root';
import { type inferRouterOutputs } from '@trpc/server';
import { Label } from '@/components/ui/label';
import { useCurrentLocale, useI18n, useScopedI18n } from '@/app/locales/client';
import { getTranslationByLocale } from '@/app/lib/utils';
import CategoriesEditDialog from './categoryies-edit-dialog';

export type Categories =
  inferRouterOutputs<AppRouter>['recipe']['getOne']['categories'];

interface CategoriesFormProps {
  categories?: Categories;
}

export interface CategoriesFormRef {
  getValues: () => string[];
}

const CategoriesForm = forwardRef<CategoriesFormRef, CategoriesFormProps>(
  (props, ref) => {
    const [categoriesState, setCategoriesState] = useState<Categories>(
      props.categories ?? []
    );
    const locale = useCurrentLocale();
    const t = useScopedI18n('recipe.categories');

    useImperativeHandle(ref, () => ({
      getValues() {
        return categoriesState.map(({ category: { id } }) => id);
      },
    }));

    return (
      <div className="flex flex-col gap-2">
        <Label>{t('categories')}</Label>
        <div className="flex gap-1">
          {categoriesState?.map(({ category: { name_en, name_pl, id } }) => (
            <Badge key={id} size="big" className="flex gap-1">
              {getTranslationByLocale(locale, name_en, name_pl)}
            </Badge>
          ))}
          <CategoriesEditDialog
            activeCategories={categoriesState}
            setActiveCategories={setCategoriesState}
          />
        </div>
      </div>
    );
  }
);

export default CategoriesForm;
