'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import profilePicture from '@/assets/profile.webp';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<null | HTMLDivElement>(null);
  const handleToggle = () => {
    setOpen((prevState) => !prevState);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !open &&
        !menuRef.current.contains(event.target as HTMLElement)
      ) {
        setOpen(() => false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, open]);

  return (
    <div className="relative ml-3">
      <div>
        <button
          type="button"
          onClick={handleToggle}
          className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          id="user-menu-button"
          aria-expanded="false"
          aria-haspopup={open}
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <Image
            className="h-8 w-8 rounded-full"
            src={profilePicture}
            alt="profile"
          />
        </button>
      </div>
      <div
        className={clsx(
          'absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity delay-100 focus:outline-none',
          { 'invisible opacity-0': !open }
        )}
        ref={menuRef}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
        tabIndex={-1}
      >
        <Link
          href="/profile"
          className="block px-4 py-2 text-sm text-gray-700"
          role="menuitem"
          tabIndex={-1}
          id="user-menu-item-0"
        >
          Your Profile
        </Link>
        <Link
          href="/sign-out"
          className="block px-4 py-2 text-sm text-gray-700"
          role="menuitem"
          tabIndex={-1}
          id="user-menu-item-2"
        >
          Sign out
        </Link>
      </div>
    </div>
  );
}
