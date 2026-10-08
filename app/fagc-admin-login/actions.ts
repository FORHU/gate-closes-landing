"use server"

import { redirect } from "next/navigation"

import { apiFetch } from "@/lib/admin/api"
import { fetchMe, isAdminRole } from "@/lib/admin/dal"
import { adminLoginSchema } from "@/lib/admin/login-schema"
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from "@/lib/admin/routes"
import { clearSession, readSession, setSession } from "@/lib/admin/session"

export type LoginResult = { error: string }

const INVALID_CREDENTIALS = "Invalid email or password."

/**
 * Signs in through the API's normal login endpoint, then admits the account
 * only if its role is an admin role. Non-admin sessions are revoked straight
 * away and no cookies are set.
 */
export async function login(values: unknown): Promise<LoginResult> {
  const parsed = adminLoginSchema.safeParse(values)
  if (!parsed.success) return { error: INVALID_CREDENTIALS }

  let tokens: { accessToken: string; refreshToken: string }
  try {
    const res = await apiFetch("/api/auth/login", { method: "POST", body: parsed.data })
    if (res.status === 400 || res.status === 401) return { error: INVALID_CREDENTIALS }
    if (res.status === 429) return { error: "Too many sign-in attempts. Try again later." }
    if (!res.ok) return { error: "Something went wrong. Try again." }
    tokens = await res.json()

    const me = await fetchMe(tokens.accessToken)
    if (!me || !isAdminRole(me.user.role)) {
      await apiFetch("/api/auth/logout", {
        method: "POST",
        body: { refreshToken: tokens.refreshToken },
      }).catch(() => {})
      return { error: "This account doesn't have admin access." }
    }
  } catch {
    return { error: "Can't reach the server. Try again." }
  }

  await setSession(tokens)
  redirect(ADMIN_HOME_PATH)
}

export async function logout() {
  const { refreshToken } = await readSession()
  if (refreshToken) {
    await apiFetch("/api/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {})
  }
  await clearSession()
  redirect(ADMIN_LOGIN_PATH)
}
