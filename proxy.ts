import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Sends visitors without a login cookie from /admin/* to the login page.
 * Only a first gate: the API checks the session and permissions on every
 * request the admin pages make.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (pathname === "/admin/login") return NextResponse.next()

  const hasSession =
    request.cookies.has("refresh_token") || request.cookies.has("session_token")
  if (hasSession) return NextResponse.next()

  const login = new URL("/admin/login", request.url)
  login.searchParams.set("next", pathname + search)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ["/admin/:path*"],
}
