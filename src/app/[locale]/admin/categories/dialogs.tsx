'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useI18n } from '@/app/locales/client';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { CreateCategory } from '@/server/api/schema';
import FormInput from '@/app/ui/input/FormInput';
import { type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '@/server/api/root';

interface DeleteDialogProps {
  categoryId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function DeleteDialog({ categoryId, open, setOpen }: DeleteDialogProps) {
  const { mutateAsync, isLoading } = api.categories.delete.useMutation();
  const utils = api.useUtils();
  const t = useI18n();

  const handleDelete = async () => {
    await mutateAsync(
      // TODO handle errors
      { id: categoryId },
      {
        onSuccess() {
          void utils.categories.getList.invalidate();
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent closeIcon={false}>
        <DialogHeader>
          <DialogTitle>{t('categories.delete.title')}</DialogTitle>
        </DialogHeader>
        <div>{t('categories.delete.description')}</div>
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
  );
}

interface EditDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  category: inferRouterOutputs<AppRouter>['categories']['getList']['data'][number];
}

export function EditDialog({ open, setOpen, category }: EditDialogProps) {
  const { mutateAsync, isLoading } = api.categories.update.useMutation();
  const utils = api.useUtils();
  const t = useI18n();

  const onSubmit = async (state: FormData) => {
    const validatedFields = CreateCategory.safeParse({
      name_pl: state.get('text_pl'),
      name_en: state.get('text_en'),
    });

    if (!validatedFields.success) return; // TODO handle errors

    await mutateAsync(
      { ...validatedFields.data, id: category.id },
      {
        onSuccess() {
          void utils.categories.getList.invalidate();
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent closeIcon={false}>
        <DialogHeader>
          <DialogTitle>{t('categories.edit.title')}</DialogTitle>
        </DialogHeader>
        <DialogForm
          onSubmit={onSubmit}
          disabled={isLoading}
          onClose={() => setOpen(false)}
          submitBtnContnet={t('common.update')}
          resetBtnContnet={t('common.cancel')}
          textEnDefault={category.name_en}
          textPlDefault={category.name_pl}
        />
      </DialogContent>
    </Dialog>
  );
}

interface CreateDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function CreateDialog({ open, setOpen }: CreateDialogProps) {
  const { mutateAsync, isLoading } = api.categories.create.useMutation();
  const utils = api.useUtils();
  const t = useI18n();

  const onSubmit = async (state: FormData) => {
    const validatedFields = CreateCategory.safeParse({
      name_pl: state.get('text_pl'),
      name_en: state.get('text_en'),
    });

    if (!validatedFields.success) return; // TODO handle errors

    await mutateAsync(validatedFields.data, {
      onSuccess() {
        void utils.categories.getList.invalidate();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent closeIcon={false}>
        <DialogHeader>
          <DialogTitle>{t('categories.create.title')}</DialogTitle>
        </DialogHeader>
        <DialogForm
          onSubmit={onSubmit}
          disabled={isLoading}
          onClose={() => setOpen(false)}
          submitBtnContnet={t('common.create')}
          resetBtnContnet={t('common.cancel')}
        />
      </DialogContent>
    </Dialog>
  );
}

interface DialogFormProps {
  onSubmit: (state: FormData) => void;
  onClose: () => void;
  disabled: boolean;
  submitBtnContnet: string;
  resetBtnContnet: string;
  textPlDefault?: string;
  textEnDefault?: string;
}

function DialogForm({
  disabled,
  resetBtnContnet,
  submitBtnContnet,
  textEnDefault,
  textPlDefault,
  onSubmit,
  onClose,
}: DialogFormProps) {
  return (
    <form className="flex flex-col gap-2" action={onSubmit}>
      <div>
        <FormInput
          id="text_pl"
          name="text_pl"
          label="polish"
          defaultValue={textPlDefault}
        />
      </div>
      <div>
        <FormInput
          id="text_en"
          name="text_en"
          label="english"
          defaultValue={textEnDefault}
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={disabled}>
          {submitBtnContnet}
        </Button>
        <Button
          variant="secondary"
          type="reset"
          disabled={disabled}
          onClick={onClose}
          autoFocus
        >
          {resetBtnContnet}
        </Button>
      </DialogFooter>
    </form>
  );
}
