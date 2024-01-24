import dynamic from 'next/dynamic';
import { MdFilterList } from 'react-icons/md';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getScopedI18n } from '@/app/locales/server';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const CategoriesFilter = dynamic(() => import('./categories-filter'));

async function FiltersPanel() {
  const t = await getScopedI18n('filter');

  return (
    <div>
      <Card className="hidden min-h-80 w-80 flex-1 md:block">
        <CardHeader className="p-2 md:px-5 md:py-3">
          <CardTitle className="text-2xl">{t('filters')}</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:px-5 md:py-3 md:pr-1">
          <CategoriesFilter />
        </CardContent>
      </Card>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <MdFilterList className="h-6 w-6" />
              <span className="sr-only">Toggle filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold tracking-tight">
              {t('filters')}
            </h3>
            <CategoriesFilter />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default FiltersPanel;
