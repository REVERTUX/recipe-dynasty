/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet';
import { getServerAuthSession } from '@/server/auth';
import AvatarMenu from './avatar-menu';

const ThemeModeToggle = dynamic(() => import('./theme-mode-toggle'));
const Navlink = dynamic(() => import('./navlink'));

export async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow-md dark:bg-gray-900">
      <nav className="container mx-auto px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link
            className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100"
            href="/"
          >
            <img src="/logo.svg" className="mr-3 h-6 sm:h-9" alt="Logo" />
            Recipe Dynasty
          </Link>
          <div className="hidden items-center space-x-10 md:flex">
            <Navlink href="/">Home</Navlink>
            <Navlink href="/recipes">Recipes</Navlink>
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
              {session ? (
                <>
                  <Link href="/recipes/create">
                    <Button>Create Recipe</Button>
                  </Link>
                  <AvatarMenu user={session.user} />
                </>
              ) : (
                <Link href="/api/auth/signin">
                  <Button>Sign In</Button>
                </Link>
              )}
              <ThemeModeToggle />
            </div>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className='flex flex-col h-full justify-between'>
                  <div className="grid gap-4 p-4">
                    <div className="flex items-center justify-between">
                      {session ? (
                        <>
                          <AvatarMenu user={session.user} />
                        </>
                      ) : (
                        <Link href="/api/auth/signin">
                          <Button>Sign In</Button>
                        </Link>
                      )}
                    </div>
                    <Navlink href="/" size="large" className="text-center">
                      Home
                    </Navlink>
                    <Navlink
                      href="/recipes"
                      size="large"
                      className="text-center"
                    >
                      Recipes
                    </Navlink>
                    {session && (
                      <Link href="/recipes/create">
                        <Button fullwidth>Create Recipe</Button>
                      </Link>
                    )}
                  </div>
                  <div className='text-right'>

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
        </div>
      </nav>
    </div>
  );
}

function MenuIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
