import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import FormInput from '@/app/ui/input/FormInput';
import FormTextarea from '@/app/ui/input/FormTextarea';
import { type CreateRecipeState } from '@/app/lib/recipe/shema';

const ImageForm = dynamic(() => import('./ImageForm'), { ssr: true });

interface BasicInfoFormProps {
  state: CreateRecipeState;
}

function BasicInfoForm({ state }: BasicInfoFormProps) {
  return (
    <>
      <FormInput
        label="Title"
        type="text"
        id="title"
        name="title"
        placeholder="Title..."
        error={!!state.errors?.title}
        errorMessage={state.errors?.title?.join('. ')}
        required
      />
      <FormTextarea
        label="Description"
        id="description"
        name="description"
        placeholder="Description..."
        error={!!state.errors?.description}
        errorMessage={state.errors?.description?.join('. ')}
        rows={4}
        required
      />
      <Suspense fallback={null}>
        <ImageForm />
      </Suspense>
      <div className="flex flex-col gap-2 md:flex-row">
        <FormInput
          label="Time"
          type="number"
          id="time"
          name="time"
          placeholder="Time..."
          min={0}
          rightAdornment="hour(s)"
          error={!!state.errors?.cookingTime}
          errorMessage={state.errors?.cookingTime?.join('. ')}
        />
        <FormInput
          label="Servings"
          type="number"
          id="servings"
          name="servings"
          placeholder="Servings..."
          min={0}
          required
          error={!!state.errors?.servings}
          errorMessage={state.errors?.servings?.join('. ')}
        />
        <FormInput
          label="Calories"
          type="number"
          id="calories"
          name="calories"
          className="block w-full min-w-0 flex-1 rounded-none rounded-s-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Calories..."
          min={0}
          rightAdornment="kcal"
          error={!!state.errors?.calories}
          errorMessage={state.errors?.calories?.join('. ')}
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <FormInput
          label="Carbs"
          type="number"
          id="carbs"
          name="carbs"
          placeholder="Carbs..."
          min={0}
        />
        <FormInput
          label="Protein"
          type="number"
          id="protein"
          name="protein"
          placeholder="Protein..."
          min={0}
        />
        <FormInput
          label="Fat"
          type="number"
          id="fat"
          name="fat"
          placeholder="Fat..."
          min={0}
        />
      </div>
    </>
  );
}

export default BasicInfoForm;
