'use client';

import { signOut } from 'next-auth/react';

function SignOut() {
  return <button onClick={() => signOut()}>Sign out</button>;
}

export default SignOut;
