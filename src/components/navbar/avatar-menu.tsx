import { type Session } from 'next-auth';
import dynamic from 'next/dynamic';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getScopedI18n } from '@/app/locales/server';

const SignOut = dynamic(() => import('./sign-out'));

interface AvatarMenuProps {
  user: Session['user'];
}

async function AvatarMenu({ user: { name, email } }: AvatarMenuProps) {
  const t = await getScopedI18n('navigation');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage />
          <AvatarFallback>{getShortName(name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <span className="block text-sm">{name}</span>
          <span className="block truncate text-sm font-medium">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOut title={t('signOut')} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getShortName(name: string | undefined | null) {
  return name
    ?.split(' ')
    .splice(0, 2)
    .map((l) => l[0]?.toLocaleUpperCase() ?? '');
}

export default AvatarMenu;
