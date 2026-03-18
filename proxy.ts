import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/database/proxy';

export async function proxy(request: NextRequest) {
  // By default, all routes are protected.
  // (Except specific paths defined in the matcher)
  // Defines the public routes here to unleash the restriction.
  // ❌ REMARK: Locale prefixes is not supported.
  const publicRoutes = ['/'];
  return await updateSession(request, publicRoutes);
}

export const config = {
  // Filters Proxy to run on specific path.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (api routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)',
  ],
};
