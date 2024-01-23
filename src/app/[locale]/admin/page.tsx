import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

import { getCurrentLocale } from '@/app/locales/server';
import { getServerAuthSession, userHasRole } from '@/server/auth';

const CategoriesPanel = dynamic(() => import('./categories/categories-panel'));

export default async function Page() {
  const session = await getServerAuthSession();
  const locale = getCurrentLocale();

  if (!userHasRole(session, 'ADMIN')) {
    return redirect(`/${locale}`);
  }

  return (
    <>
      <CategoriesPanel />
    </>
  );
}
