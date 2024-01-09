'use client';

import { Suspense, useRef } from 'react';
import { useFormState } from 'react-dom';
import dynamic from 'next/dynamic';
import { type MDXEditorMethods } from '@mdxeditor/editor';

import { createRecipe } from '@/app/lib/recipe/actions';
import { type CreateRecipeState } from '@/app/lib/recipe/shema';

import BasicInfoForm from './BasicInfoForm';
import { contetntMarkdown } from './editorContentTemplate';
import { Button } from 'flowbite-react';

const Editor = dynamic(() => import('./Editor'), { ssr: false });

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
      <Suspense fallback={null}>
        <Editor markdown={contetntMarkdown} editorRef={editorRef} />
      </Suspense>
      <p className="py-2 text-red-600">{state.message}</p>
      <Button type="submit">Create Recipe</Button>
    </form>
  );
}

export default CreateForm;
