import '@/styles/globals.css';

import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { extractRouterConfig } from 'uploadthing/server';

import { TRPCReactProvider } from '@/trpc/react';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { ourFileRouter } from '@/app/api/uploadthing/core';

import Navbar from './ui/navbar/Navbar';
import 'flowbite';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Recipe Dynasty',
  description:
    'Explore the culinary world with Recipe Dynasty – your ultimate destination for discovering, creating, and sharing exquisite recipes. Unlock a realm of flavors, embark on culinary adventures, and build your own gastronomic legacy with our innovative recipe platform.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Navbar />
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
