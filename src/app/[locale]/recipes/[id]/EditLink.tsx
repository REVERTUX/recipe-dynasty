import Link from 'next/link';
import { MdEdit } from 'react-icons/md';

import { getServerAuthSession, userHasRole } from '@/server/auth';
import { db } from '@/server/db';
import { Button } from '@/components/ui/button';
import { getCurrentLocale } from '@/app/locales/server';

interface EditLinkProps {
  recipeId: string;
}

async function EditLink({ recipeId }: EditLinkProps) {
  const session = await getServerAuthSession();
  const locale = getCurrentLocale();

  const recipe = await db.recipe.findFirst({
    where: { id: { equals: recipeId } },
    select: { userId: true },
  });

  const haveRights = () => {
    if (!recipe) {
      return false;
    }

    if (userHasRole(session, 'ADMIN')) {
      return true;
    }

    return session?.user.id === recipe.userId;
  };

  if (!haveRights()) {
    return null;
  }

  return (
    <Link href={`/${locale}/recipes/${recipeId}/edit`}>
      <Button variant="ghost" size="icon" className="hover:dark:bg-slate-700">
        <MdEdit size={24} />
      </Button>
    </Link>
  );
}

export default EditLink;
