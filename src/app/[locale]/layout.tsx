import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { extractRouterConfig } from 'uploadthing/server';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { AxiomWebVitals } from 'next-axiom';

import { TRPCReactProvider } from '@/trpc/react';
import { ourFileRouter } from '@/app/api/uploadthing/core';
import { Navbar } from '@/components/navbar/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nProviderClient } from '@/app/locales/client';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export const metadata = {
  title: 'Recipe Dynasty',
  description:
    'Explore the culinary world with Recipe Dynasty – your ultimate destination for discovering, creating, and sharing exquisite recipes. Unlock a realm of flavors, embark on culinary adventures, and build your own gastronomic legacy with our innovative recipe platform.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children, params: { locale } }: Props) {
  return (
    <html lang={locale}>
      <body
        className={`font-sans ${inter.variable} bg-gradient-to-br dark:from-slate-900 dark:to-gray-700`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProviderClient locale={locale}>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <AxiomWebVitals />
            <Navbar />
            <TRPCReactProvider cookies={cookies().toString()}>
              {children}
            </TRPCReactProvider>
          </I18nProviderClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
