import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pages publiques qui ne nécessitent pas d'authentification
  const publicPaths = ['/auth/login']

  // Si l'utilisateur essaie d'accéder à une page publique, le laisser passer
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Pour toutes les autres pages, vérifier l'authentification
  const token = request.cookies.get('dashboardToken')?.value

  if (!token) {
    // Rediriger vers la page de connexion si pas de token
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Si token présent, vérifier sa validité (optionnel - peut être fait côté client)
  // Pour l'instant, on fait confiance au token s'il existe

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}