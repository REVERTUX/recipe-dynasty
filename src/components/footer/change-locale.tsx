'use client';

import {
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n,
} from '@/app/locales/client';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

function ChangeLocale() {
  const changeLocale = useChangeLocale({ preserveSearchParams: true });
  const locale = useCurrentLocale();
  const t = useScopedI18n('navigation');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">{t(locale)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLocale('en')}>
          {t('en')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale('pl')}>
          {t('pl')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ChangeLocale;
