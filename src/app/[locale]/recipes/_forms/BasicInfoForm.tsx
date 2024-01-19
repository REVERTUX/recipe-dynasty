import dynamic from 'next/dynamic';

import FormInput from '@/app/ui/input/FormInput';
import FormTextarea from '@/app/ui/input/FormTextarea';
import { type CreateRecipeState } from '@/app/lib/recipe/shema';
import { type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '@/server/api/root';
import { useScopedI18n } from '@/app/locales/client';

const ImageForm = dynamic(() => import('./ImageForm'), { ssr: true });

interface BasicInfoFormProps {
  state: CreateRecipeState;
  recipe?: inferRouterOutputs<AppRouter>['recipe']['getOne'];
}

function BasicInfoForm({ state, recipe }: BasicInfoFormProps) {
  const t = useScopedI18n('recipe');

  return (
    <>
      <FormInput
        label={t('title')}
        type="text"
        id="title"
        name="title"
        placeholder={`${t('title')}...`}
        error={!!state.errors?.title}
        errorMessage={state.errors?.title?.join('. ')}
        defaultValue={recipe?.title}
        required
      />
      <FormTextarea
        label={t('description')}
        id="description"
        name="description"
        placeholder={`${t('description')}...`}
        error={!!state.errors?.description}
        errorMessage={state.errors?.description?.join('. ')}
        rows={4}
        defaultValue={recipe?.description}
        required
      />
      <ImageForm />
      <div className="flex flex-col gap-2 md:flex-row">
        <FormInput
          label={t('time')}
          type="number"
          id="time"
          name="time"
          placeholder={`${t('time')}...`}
          min={0}
          rightAdornment={t('hours')}
          error={!!state.errors?.cookingTime}
          errorMessage={state.errors?.cookingTime?.join('. ')}
          defaultValue={recipe?.cookingTime?.value}
        />
        <FormInput
          label={t('servings')}
          type="number"
          id="servings"
          name="servings"
          placeholder={`${t('servings')}...`}
          min={0}
          required
          error={!!state.errors?.servings}
          errorMessage={state.errors?.servings?.join('. ')}
          defaultValue={recipe?.servings}
        />
        <FormInput
          label={t('calories')}
          type="number"
          id="calories"
          name="calories"
          placeholder={`${t('calories')}...`}
          min={0}
          rightAdornment="kcal"
          error={!!state.errors?.calories}
          errorMessage={state.errors?.calories?.join('. ')}
          defaultValue={recipe?.calories ?? undefined}
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <FormInput
          label={t('carbs')}
          type="number"
          id="carbs"
          name="carbs"
          placeholder={`${t('carbs')}...`}
          min={0}
          defaultValue={recipe?.nutrients?.carbs ?? undefined}
        />
        <FormInput
          label={t('protein')}
          type="number"
          id="protein"
          name="protein"
          placeholder={`${t('protein')}...`}
          min={0}
          defaultValue={recipe?.nutrients?.protein ?? undefined}
        />
        <FormInput
          label={t('fat')}
          type="number"
          id="fat"
          name="fat"
          placeholder={`${t('fat')}...`}
          min={0}
          defaultValue={recipe?.nutrients?.fat ?? undefined}
        />
      </div>
    </>
  );
}

export default BasicInfoForm;
