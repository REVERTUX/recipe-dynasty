import { PrismaAdapter } from '@next-auth/prisma-adapter';
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { env } from '@/env';
import { db } from '@/server/db';
import { type UserRole } from '@prisma/client';
import { getLogger } from '@/utils/logger';

const logger = getLogger();

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      roles: UserRole['role'][];
    } & DefaultSession['user'];
  }

  interface User {
    // ...other properties
    roles: UserRole['role'][];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      const roles = await db?.userRole?.findMany({
        where: { userId: user.id },
        select: { role: true },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          roles: roles.map((role) => role.role),
        },
      };
    },
    signIn(params) {
      logger.info('User logged', {
        userId: params.user.id,
        userEmail: params.profile?.email,
      });
      return true;
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
