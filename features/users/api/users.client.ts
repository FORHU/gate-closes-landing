import { fetcher } from "@/shared/lib/http"
import { AdminUsersResponseSchema, type UsersFilter } from "../contracts/users.contract"

/** The API pages `/admin/users` (10 by default); ask for its maximum in one page. */
const USERS_LIMIT = "100"

export async function getUsers(filter: UsersFilter) {
  const params = new URLSearchParams({ limit: USERS_LIMIT })
  if (filter.q) params.set("q", filter.q)
  if (filter.role) params.set("role", filter.role)
  return AdminUsersResponseSchema.parse(await fetcher(`/admin/users?${params}`))
}

export async function setUserRole(id: string, role: string) {
  await fetcher(`/admin/users/${id}/role`, { method: "PATCH", body: { role } })
}
