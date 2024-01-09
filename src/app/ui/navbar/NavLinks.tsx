'use client';

import { NavbarLink } from 'flowbite-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Home', href: '/' },
  {
    name: 'Recipes',
    href: '/recipes',
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, name }) => {
        return (
          <NavbarLink
            as={Link}
            key={name}
            href={href}
            active={pathname === href}
          >
            {name}
          </NavbarLink>
        );
      })}
    </>
  );
}
