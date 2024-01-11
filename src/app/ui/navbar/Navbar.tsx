/* eslint-disable @next/next/no-img-element */
import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from 'flowbite-react';
import Link from 'next/link';

import { getServerAuthSession } from '@/server/auth';
import NavLinks from './NavLinks';
import SignOut from './SignOut';

async function NavbarComponent() {
  const session = await getServerAuthSession();

  return (
    <Navbar fluid rounded className="shadow-md">
      <NavbarBrand as={Link} href="/">
        <img src="/logo.svg" className="mr-3 h-6 sm:h-9" alt="Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Recipe Dynasty
        </span>
      </NavbarBrand>
      <div className="flex gap-2 md:order-2">
        {session ? (
          <>
            <Link href={'/recipes/create'}>
              <Button>Create Recipe</Button>
            </Link>
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="User settings" rounded />}
            >
              <DropdownHeader>
                <span className="block text-sm">{session.user.name}</span>
                <span className="block truncate text-sm font-medium">
                  {session.user.email}
                </span>
              </DropdownHeader>
              <DropdownItem>Settings</DropdownItem>
              <DropdownDivider />
              <DropdownItem>
                <SignOut />
              </DropdownItem>
            </Dropdown>
          </>
        ) : (
          <Button>
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavLinks />
      </NavbarCollapse>
    </Navbar>
  );
}

export default NavbarComponent;
