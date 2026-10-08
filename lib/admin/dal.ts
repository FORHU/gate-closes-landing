import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { apiFetch } from "./api"
import { ADMIN_LOGIN_PATH } from "./routes"
import { readSession } from "./session"

export const ADMIN_ROLES = ["admin", "super_admin"] as const

export type AdminUser = {
  _id: string
  email: string
  username?: string
  picture?: string
  role: string
}

export type Admin = {
  user: AdminUser
  permissions: string[]
  accessToken: string
}

export function isAdminRole(role: unknown): boolean {
  return typeof role === "string" && (ADMIN_ROLES as readonly string[]).includes(role)
}

/** Fetches the current user from `/api/auth/me` with an access token; null if the API rejects it. */
export async function fetchMe(accessToken: string) {
  const res = await apiFetch("/api/auth/me", { token: accessToken })
  if (!res.ok) return null
  return (await res.json()) as { user: AdminUser; permissions: string[] }
}

/**
 * The signed-in admin, or null. The API verifies the token and reads the
 * role from the database on every call, so a demoted admin loses access on
 * their next request. Memoized for one render pass.
 */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const { accessToken } = await readSession()
  if (!accessToken) return null

  try {
    const me = await fetchMe(accessToken)
    if (!me || !isAdminRole(me.user.role)) return null
    return { ...me, accessToken }
  } catch {
    return null
  }
})

export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin()
  if (!admin) redirect(ADMIN_LOGIN_PATH)
  return admin
}
