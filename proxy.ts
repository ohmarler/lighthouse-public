import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/auth (NextAuth routes)
     * - /api/reports/upload (CI upload endpoint - uses HMAC auth)
     * - /auth/* (all auth pages including signin, error, debug)
     * - /_next (Next.js internals)
     * - /favicon.ico, /robots.txt (static files)
     * - /reports (allow public access to Lighthouse HTML reports)
     * - /brand/* (public brand assets: logo, favicon - required on sign-in page)
     */
    '/((?!api/auth|api/reports/upload|auth|_next|favicon.ico|robots.txt|reports|brand).*)',
  ],
};
