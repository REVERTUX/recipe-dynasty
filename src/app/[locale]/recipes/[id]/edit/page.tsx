import { redirect } from 'next/navigation';
import { api } from '@/trpc/server';
import EditForm from './EditForm';
import { getServerAuthSession, userHasRole } from '@/server/auth';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params: { id } }: PageProps) {
  const session = await getServerAuthSession();
  const recipe = await api.recipe.getOne.query({ id });
  const { steps } = await api.recipe.getStep.query({ id });

  const haveRights = () => {
    if (userHasRole(session, 'ADMIN')) {
      return true;
    }
    return session?.user.id === recipe.userId;
  };

  if (!haveRights()) {
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
