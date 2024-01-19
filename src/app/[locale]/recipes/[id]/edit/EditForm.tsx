'use client';

import { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { type MDXEditorMethods } from '@mdxeditor/editor';

import { editRecipe } from '@/app/lib/recipe/actions';
import { type CreateRecipeState } from '@/app/lib/recipe/shema';
import { type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '@/server/api/root';
import { Button } from '@/components/ui/button';

import BasicInfoForm from '../../_forms/BasicInfoForm';
import Editor from '../../_forms/Editor';
import { useScopedI18n } from '@/app/locales/client';

interface EditFormProps {
  recipe: inferRouterOutputs<AppRouter>['recipe']['getOne'];
  steps: string;
  recipeId: string;
}

function EditForm({ recipe, steps, recipeId }: EditFormProps) {
  const initialState = { message: '', error: {} };
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const t = useScopedI18n('recipe');

  const updateRecipeWithAdditionalInfo = async (
    state: CreateRecipeState,
    formData: FormData
  ) => {
    return editRecipe(
      state,
      formData,
      recipeId,
      editorRef.current?.getMarkdown()
    );
  };

  const [state, dispatch] = useFormState(
    updateRecipeWithAdditionalInfo,
    initialState
  );

  return (
    <form
      action={dispatch}
      className="flex max-w-5xl grow flex-col gap-4 px-2 py-4"
    >
      <h1 className="mb-4 text-4xl font-bold">{t('editTitle')}</h1>
      <BasicInfoForm state={state} recipe={recipe} />
      <Editor markdown={steps} editorRef={editorRef} />
      <p className="py-2 text-red-600">{state.message}</p>
      <SubmitButton content={t('edit')} />
    </form>
  );
}

export default EditForm;

function SubmitButton({ content }: { content: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {content}
    </Button>
  );
}
