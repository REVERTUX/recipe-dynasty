import { redirect } from 'next/navigation';
import { getServerAuthSession, userHasRole } from '@/server/auth';
import CreateForm from './CreateForm';

export default async function Page() {
  const session = await getServerAuthSession();

  if (!userHasRole(session, 'MEMBER')) {
    redirect('/recipes');
  }

  return <CreateForm />;
}
