import { api } from '@/trpc/server';
import EditForm from './EditForm';
import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params: { id } }: PageProps) {
  const session = await getServerAuthSession();
  const recipe = await api.recipe.getOne.query({ id });
  const { steps } = await api.recipe.getStep.query({ id });

  if (session?.user.id !== recipe.userId) {
    redirect(`/recipes/${id}`);
  }

  return (
    <EditForm
      recipeId={id}
      recipe={{
        ...recipe,
      }}
      steps={steps}
    />
  );
}
