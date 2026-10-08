import "server-only"

import { cookies } from "next/headers"

import { ACCESS_COOKIE, REFRESH_COOKIE, tokenCookieOptions, type SessionTokens } from "./cookies"

/** Only callable from Server Functions or Route Handlers. */
export async function setSession({ accessToken, refreshToken }: SessionTokens) {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_COOKIE, accessToken, tokenCookieOptions(accessToken))
  cookieStore.set(REFRESH_COOKIE, refreshToken, tokenCookieOptions(refreshToken))
}

/** Only callable from Server Functions or Route Handlers. */
export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_COOKIE)
  cookieStore.delete(REFRESH_COOKIE)
}

export async function readSession() {
  const cookieStore = await cookies()
  return {
    accessToken: cookieStore.get(ACCESS_COOKIE)?.value,
    refreshToken: cookieStore.get(REFRESH_COOKIE)?.value,
  }
}
