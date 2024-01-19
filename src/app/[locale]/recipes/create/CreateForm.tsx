'use client';

import { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { type MDXEditorMethods } from '@mdxeditor/editor';

import { createRecipe } from '@/app/lib/recipe/actions';
import { type CreateRecipeState } from '@/app/lib/recipe/shema';

import { contetntMarkdown } from '../_forms/editorContentTemplate';
import BasicInfoForm from '../_forms/BasicInfoForm';
import Editor from '../_forms/Editor';
import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/app/locales/client';

function CreateForm() {
  const initialState = { message: '', error: {} };
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const t = useScopedI18n('recipe');

  const createRecipeWithAdditionalInfo = async (
    state: CreateRecipeState,
    formData: FormData
  ) => {
    return createRecipe(state, formData, editorRef.current?.getMarkdown());
  };

  const [state, dispatch] = useFormState(
    createRecipeWithAdditionalInfo,
    initialState
  );

  return (
    <form
      action={dispatch}
      className="flex max-w-5xl grow flex-col gap-4 px-2 py-4"
    >
      <h1 className="mb-4 text-4xl font-bold">{t('createTitle')}</h1>
      <BasicInfoForm state={state} />
      <Editor markdown={contetntMarkdown} editorRef={editorRef} />
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
