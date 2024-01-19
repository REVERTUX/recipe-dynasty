'use client';

import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';

interface SignOutProps {
  title: string;
}

function SignOut({ title }: SignOutProps) {
  return (
    <Button variant={'link'} size={'sm'} onClick={() => signOut()}>
      {title}
    </Button>
  );
}

export default SignOut;
