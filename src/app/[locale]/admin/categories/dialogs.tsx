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
import { toast } from 'sonner';

interface DeleteDialogProps {
  categoryId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function DeleteDialog({ categoryId, open, setOpen }: DeleteDialogProps) {
  const { mutate, isLoading } = api.categories.delete.useMutation();
  const utils = api.useUtils();
  const t = useI18n();

  const handleDelete = () => {
    mutate(
      { id: categoryId },
      {
        onSuccess() {
          void utils.categories.getList.invalidate();
          toast.success(t('categories.delete.notification.success'));
        },
        onError() {
          toast.error(t('categories.delete.notification.error'));
        },
        onSettled() {
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
            <Button variant="secondary" disabled={isLoading}>
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
  const { mutate, isLoading } = api.categories.update.useMutation();
  const utils = api.useUtils();
  const t = useI18n();

  const onSubmit = (state: FormData) => {
    const validatedFields = CreateCategory.safeParse({
      name_pl: state.get('text_pl'),
      name_en: state.get('text_en'),
    });

    if (!validatedFields.success) return; // TODO handle errors

    mutate(
      { ...validatedFields.data, id: category.id },
      {
        onSuccess() {
          void utils.categories.getList.invalidate();
          toast.success(t('categories.edit.notification.success'));
        },
        onError() {
          toast.error(t('categories.edit.notification.error'));
        },
        onSettled() {
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
  const { mutate, isLoading } = api.categories.create.useMutation();
  const utils = api.useUtils();
  const t = useI18n();

  const onSubmit = (state: FormData) => {
    const validatedFields = CreateCategory.safeParse({
      name_pl: state.get('text_pl'),
      name_en: state.get('text_en'),
    });

    if (!validatedFields.success) return; // TODO handle errors

    mutate(validatedFields.data, {
      onSuccess() {
        void utils.categories.getList.invalidate();
        toast.success(t('categories.create.notification.success'));
      },
      onError() {
        toast.error(t('categories.create.notification.error'));
      },
      onSettled() {
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
  const t = useI18n();

  return (
    <form className="flex flex-col gap-2" action={onSubmit}>
      <div>
        <FormInput
          id="text_pl"
          name="text_pl"
          label={t('navigation.pl')}
          defaultValue={textPlDefault}
        />
      </div>
      <div>
        <FormInput
          id="text_en"
          name="text_en"
          label={t('navigation.en')}
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
        >
          {resetBtnContnet}
        </Button>
      </DialogFooter>
    </form>
  );
}
