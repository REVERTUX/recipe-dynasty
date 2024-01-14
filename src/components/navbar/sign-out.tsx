'use client';

import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';

function SignOut() {
  return (
    <Button variant={'link'} size={'sm'} onClick={() => signOut()}>
      Sign out
    </Button>
  );
}

export default SignOut;
