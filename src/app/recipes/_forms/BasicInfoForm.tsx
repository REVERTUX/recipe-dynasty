import dynamic from 'next/dynamic';

import FormInput from '@/app/ui/input/FormInput';
import FormTextarea from '@/app/ui/input/FormTextarea';
import { type CreateRecipeState } from '@/app/lib/recipe/shema';
import { type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '@/server/api/root';

const ImageForm = dynamic(() => import('./ImageForm'), { ssr: true });

interface BasicInfoFormProps {
  state: CreateRecipeState;
  recipe?: inferRouterOutputs<AppRouter>['recipe']['getOne'];
}

function BasicInfoForm({ state, recipe }: BasicInfoFormProps) {
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
        defaultValue={recipe?.title}
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
        defaultValue={recipe?.description}
        required
      />
      <ImageForm />
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
          defaultValue={recipe?.cookingTime?.value}
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
          defaultValue={recipe?.servings}
        />
        <FormInput
          label="Calories"
          type="number"
          id="calories"
          name="calories"
          placeholder="Calories..."
          min={0}
          rightAdornment="kcal"
          error={!!state.errors?.calories}
          errorMessage={state.errors?.calories?.join('. ')}
          defaultValue={recipe?.calories ?? undefined}
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
          defaultValue={recipe?.nutrients?.carbs ?? undefined}
        />
        <FormInput
          label="Protein"
          type="number"
          id="protein"
          name="protein"
          placeholder="Protein..."
          min={0}
          defaultValue={recipe?.nutrients?.protein ?? undefined}
        />
        <FormInput
          label="Fat"
          type="number"
          id="fat"
          name="fat"
          placeholder="Fat..."
          min={0}
          defaultValue={recipe?.nutrients?.fat ?? undefined}
        />
      </div>
    </>
  );
}

export default BasicInfoForm;
