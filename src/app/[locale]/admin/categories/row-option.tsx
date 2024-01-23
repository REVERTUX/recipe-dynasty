import { useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type AppRouter } from '@/server/api/root';
import { type inferRouterOutputs } from '@trpc/server';
import { useI18n } from '@/app/locales/client';
import { DeleteDialog, EditDialog } from './dialogs';

interface RowOptionProps {
  category: inferRouterOutputs<AppRouter>['categories']['getList']['data'][number];
}

function RowOption({ category }: RowOptionProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const t = useI18n();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <FiMoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            role="button"
            tabIndex={0}
            onClick={() => setIsEditModalOpen(true)}
          >
            {t('common.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500"
            role="button"
            tabIndex={0}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            {t('common.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        categoryId={category.id}
      />
      <EditDialog
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        category={category}
      />
    </div>
  );
}

export default RowOption;
