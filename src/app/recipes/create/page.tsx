import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import CreateForm from './CreateForm';

export default async function Page() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect('/recipes');
  }

  return <CreateForm />;
}
