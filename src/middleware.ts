import { type NextRequest } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'pl'],
  defaultLocale: 'pl',
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (['/manifest.json', '/favicon.ico', '/logo.png'].includes(pathname))
    return;

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self' *.google.com 'unsafe-inline' 'unsafe-eval';
    script-src 'self' ${
      process.env.NODE_ENV === 'production'
        ? `'strict-dynamic' 'nonce-${nonce}'`
        : "'unsafe-inline' 'unsafe-eval'"
    };
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    connect-src 'self' https://uploadthing-prod.s3.us-west-2.amazonaws.com https://uploadthing.com;
    object-src 'none';
    base-uri 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  const response = I18nMiddleware(request);

  response.headers.set('x-nonce', nonce);

  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
