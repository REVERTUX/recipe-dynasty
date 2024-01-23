'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { MdAdd } from 'react-icons/md';

import Input from '@/app/ui/input/Input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/trpc/react';
import { useI18n } from '@/app/locales/client';
import RowOption from './row-option';
import { CreateDialog } from './dialogs';

const SEARCH_DEBOUNCE = 400;

function CategoriesPanel() {
  const [search, setSearch] = useState<string>('');
  const [take] = useState<number>(5);
  const [skip, setSkip] = useState<number>(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [searchDebounce] = useDebounce(search, SEARCH_DEBOUNCE);
  const { data: categories } = api.categories.getList.useQuery(
    {
      take,
      skip,
      search: searchDebounce,
    },
    { keepPreviousData: true }
  );
  const t = useI18n();

  if (!categories) return null;

  return (
    <Card className="h-[540px] md:h-[500px]">
      <CardContent className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <Input
            onChange={({ target }) => setSearch(target.value)}
            value={search}
            placeholder={`${t('pagination.search')}...`}
            className="max-w-sm"
          />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            {t('categories.add')}
            <MdAdd size={20} />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('navigation.pl')}</TableHead>
              <TableHead>{t('navigation.en')}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.data.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name_pl}</TableCell>
                <TableCell>{category.name_en}</TableCell>
                <TableCell className="text-right">
                  <RowOption category={category} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSkip((prev) => prev - take)}
            disabled={skip - take < 0}
          >
            {t('pagination.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSkip((prev) => prev + take)}
            disabled={skip + take >= categories.count}
          >
            {t('pagination.next')}
          </Button>
        </div>
        <CreateDialog open={isCreateModalOpen} setOpen={setIsCreateModalOpen} />
      </CardContent>
    </Card>
  );
}

export default CategoriesPanel;
