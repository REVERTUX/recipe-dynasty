'use client';

import { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { type MDXEditorMethods } from '@mdxeditor/editor';
import { Button } from 'flowbite-react';

import { createRecipe } from '@/app/lib/recipe/actions';
import { type CreateRecipeState } from '@/app/lib/recipe/shema';

import { contetntMarkdown } from './editorContentTemplate';
import BasicInfoForm from './BasicInfoForm';
import Editor from './Editor';

function CreateForm() {
  const initialState = { message: '', error: {} };
  const editorRef = useRef<MDXEditorMethods | null>(null);

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
      className="flex max-w-5xl grow flex-col gap-3 px-2 py-4"
    >
      <h2 className="text-3xl">Create new recipe</h2>
      <BasicInfoForm state={state} />
      <Editor markdown={contetntMarkdown} editorRef={editorRef} />
      <p className="py-2 text-red-600">{state.message}</p>
      <SubmitButton />
    </form>
  );
}

export default CreateForm;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Create Recipe
    </Button>
  );
}
