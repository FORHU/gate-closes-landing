// Cookie names and options for the admin session. Kept free of `next/headers`
// so both Server Functions and `proxy.ts` can use them.
//
// The names differ from the API's own `session_token` / `refresh_token`
// because cookies are shared across ports on localhost.

export const ACCESS_COOKIE = "gc_admin_at"
export const REFRESH_COOKIE = "gc_admin_rt"
/** UI preference only: "collapsed" when the dashboard sidebar is minimized. */
export const SIDEBAR_COOKIE = "gc_admin_sidebar"
/** UI preference only: "light" or "dark" (default) for the admin dashboard. */
export const THEME_COOKIE = "gc_admin_theme"

const EXPIRY_MARGIN_SECONDS = 30

export type SessionTokens = { accessToken: string; refreshToken: string }

/**
 * Seconds until the JWT's `exp`, minus a small margin so the cookie is gone
 * before the API would reject the token. The payload is only read, never
 * trusted: the API verifies every token it receives.
 */
function secondsUntilExpiry(jwt: string): number {
  try {
    const payload = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const { exp } = JSON.parse(atob(payload)) as { exp?: number }
    if (!exp) return 0
    return Math.max(0, exp - Math.floor(Date.now() / 1000) - EXPIRY_MARGIN_SECONDS)
  } catch {
    return 0
  }
}

export function tokenCookieOptions(jwt: string) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: secondsUntilExpiry(jwt),
  }
}
