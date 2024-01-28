'use client';

import { useMemo, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { type MDXEditorMethods } from '@mdxeditor/editor';

import { createRecipe } from '@/app/lib/recipe/actions';
import { type CreateRecipeState } from '@/app/lib/recipe/shema';

import {
  contentMarkdownEn,
  contentMarkdownPl,
} from '../_forms/editorContentTemplate';
import BasicInfoForm from '../_forms/BasicInfoForm';
import Editor from '../_forms/Editor';
import { Button } from '@/components/ui/button';
import { useCurrentLocale, useScopedI18n } from '@/app/locales/client';
import CategoriesForm, {
  type CategoriesFormRef,
} from '../_forms/categories-form';
import { getTranslationByLocale } from '@/app/lib/utils';

function CreateForm() {
  const initialState = { message: '', error: {} };
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const categoriesRef = useRef<CategoriesFormRef | null>(null);

  const t = useScopedI18n('recipe');
  const locale = useCurrentLocale();

  const getMarkdownContent = useMemo(() => {
    return getTranslationByLocale(locale, contentMarkdownEn, contentMarkdownPl);
  }, []);

  const createRecipeWithAdditionalInfo = async (
    state: CreateRecipeState,
    formData: FormData
  ) => {
    return createRecipe(
      state,
      formData,
      editorRef.current?.getMarkdown(),
      categoriesRef.current?.getValues() ?? []
    );
  };

  const [state, dispatch] = useFormState(
    createRecipeWithAdditionalInfo,
    initialState
  );

  return (
    <form
      action={dispatch}
      className="flex max-w-5xl grow flex-col gap-2 px-2 py-4 md:gap-4"
    >
      <h1 className="mb-2 text-3xl font-bold md:mb-4 md:text-4xl">
        {t('createTitle')}
      </h1>
      <BasicInfoForm state={state} />
      <CategoriesForm ref={categoriesRef} />
      <Editor markdown={getMarkdownContent} editorRef={editorRef} />
      <p className="py-2 text-red-600">{state.message}</p>
      <SubmitButton content={t('create')} />
    </form>
  );
}

export default CreateForm;

function SubmitButton({ content }: { content: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {content}
    </Button>
  );
}
