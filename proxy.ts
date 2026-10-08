import { NextResponse, type NextRequest } from "next/server"

import { ACCESS_COOKIE, REFRESH_COOKIE, tokenCookieOptions } from "@/lib/admin/cookies"
import { ADMIN_LOGIN_PATH } from "@/lib/admin/routes"

/**
 * Optimistic gate for the admin area: redirects visitors with no session to
 * /login and renews an expired access token from the refresh token. It is
 * not the security check. Every admin page calls `requireAdmin()`, which has
 * the API verify the token and the role.
 */
export async function proxy(request: NextRequest) {
  if (request.cookies.has(ACCESS_COOKIE)) return NextResponse.next()

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
  if (!refreshToken) return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url))

  const tokens = await refresh(refreshToken)
  if (!tokens) {
    const response = NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url))
    response.cookies.delete(ACCESS_COOKIE)
    response.cookies.delete(REFRESH_COOKIE)
    return response
  }

  // Send the browser back to the same URL so the retried request carries the
  // fresh cookies.
  const response = NextResponse.redirect(request.url)
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, tokenCookieOptions(tokens.accessToken))
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, tokenCookieOptions(tokens.refreshToken))
  return response
}

async function refresh(refreshToken: string) {
  const baseUrl = process.env.API_URL
  if (!baseUrl) return null
  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as { accessToken: string; refreshToken: string }
  } catch {
    return null
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
