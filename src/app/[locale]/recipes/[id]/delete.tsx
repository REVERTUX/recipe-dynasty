'use client';

import { FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

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
import { api } from '@/trpc/react';
import { useCurrentLocale, useI18n } from '@/app/locales/client';
import { invalidatePathAndRedirect } from '@/app/lib/recipe/actions';

interface DeleteRecipeProps {
  recipeId: string;
}

function DeleteRecipe({ recipeId }: DeleteRecipeProps) {
  const { isLoading, mutateAsync } = api.recipe.delete.useMutation();
  const router = useRouter();
  const locale = useCurrentLocale();
  const t = useI18n();

  const handleDelete = async () => {
    try {
      await mutateAsync({ id: recipeId });
      invalidatePathAndRedirect();
      router.replace(`/${locale}/recipes`);
    } catch (error) {
      // TODO toast
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="hover:dark:bg-slate-700"
          >
            <FiTrash2 size={24} className="text-red-500" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('recipe.delete.title')}</DialogTitle>
          </DialogHeader>
          <div>{t('recipe.delete.description')}</div>
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={handleDelete}
            >
              {t('common.delete')}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary" disabled={isLoading} autoFocus>
                {t('common.cancel')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DeleteRecipe;
