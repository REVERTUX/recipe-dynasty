/* eslint-disable @next/next/no-img-element */

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';

import { getServerAuthSession, userHasRole } from '@/server/auth';
import { Button } from '@/components/ui/button';
import {
  SheetTrigger,
  SheetContent,
  Sheet,
  SheetClose,
} from '@/components/ui/sheet';
import { getCurrentLocale, getScopedI18n } from '@/app/locales/server';
import AvatarMenu from './avatar-menu';

const ThemeModeToggle = dynamic(() => import('./theme-mode-toggle'));
const Navlink = dynamic(() => import('./navlink'));

export async function Navbar() {
  const t = await getScopedI18n('navigation');
  const locale = getCurrentLocale();

  return (
    <div className="w-full bg-white shadow-md dark:bg-gray-900">
      <nav className="container mx-auto px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link
            className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100"
            href={`/${locale}`}
          >
            <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="Logo" />
            {t('title')}
          </Link>
          <DesktopNav />
          <MobileNav />
        </div>
      </nav>
    </div>
  );
}

async function DesktopNav() {
  const session = await getServerAuthSession();
  const t = await getScopedI18n('navigation');
  const locale = getCurrentLocale();

  return (
    <div className="hidden items-center space-x-10 md:flex">
      {userHasRole(session, 'ADMIN') && (
        <Navlink href={`/${locale}/admin`}>{t('admin')}</Navlink>
      )}
      <Navlink href={`/${locale}`}> {t('home')}</Navlink>
      <Navlink href={`/${locale}/recipes`}>{t('recipes')}</Navlink>
      {/* <Navlink
              href="#"
            >
              Categories
            </Navlink>
            <Navlink
              href="#"
            >
              Favorites
            </Navlink> */}
      <div className="flex gap-2.5">
        {userHasRole(session, 'MEMBER') && (
          <Link href={`/${locale}/recipes/create`}>
            <Button>{t('createRecipe')}</Button>
          </Link>
        )}
        {session ? (
          <AvatarMenu user={session.user} />
        ) : (
          <Link href="/api/auth/signin">
            <Button>{t('signIn')}</Button>
          </Link>
        )}
        <ThemeModeToggle />
      </div>
    </div>
  );
}

async function MobileNav() {
  const session = await getServerAuthSession();
  const t = await getScopedI18n('navigation');
  const locale = getCurrentLocale();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost">
            <FiMenu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-2 sm:p-6">
          <div className="flex h-full flex-col justify-between pb-4">
            <div className="grid gap-4 p-2 sm:p-4">
              <div className="flex items-center justify-between">
                {session && <AvatarMenu user={session.user} />}
              </div>
              {userHasRole(session, 'ADMIN') && (
                <Navlink
                  href={`/${locale}/admin`}
                  size="large"
                  className="text-center"
                >
                  <SheetClose>{t('admin')}</SheetClose>
                </Navlink>
              )}
              <Navlink href={`/${locale}`} size="large" className="text-center">
                <SheetClose>{t('home')}</SheetClose>
              </Navlink>
              <Navlink
                href={`/${locale}/recipes`}
                size="large"
                className="text-center"
              >
                <SheetClose>{t('recipes')}</SheetClose>
              </Navlink>

              {userHasRole(session, 'MEMBER') && (
                <Link href={`/${locale}/recipes/create`}>
                  <SheetClose className="w-full">
                    <Button fullwidth>{t('createRecipe')}</Button>
                  </SheetClose>
                </Link>
              )}
              {!session && (
                <Link href="/api/auth/signin">
                  <Button className="w-full">{t('signIn')}</Button>
                </Link>
              )}
            </div>
            <div className="text-right">
              <ThemeModeToggle />
            </div>
            {/* <Navlink
                    href="#"
                  >
                    Categories
                  </Navlink>
                  <Navlink
                    className="text-lg font-semibold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-black"
                    href="#"
                  >
                    Favorites
                  </Navlink> */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
