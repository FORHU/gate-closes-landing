import { fetcher } from "@/shared/lib/http"
import { AdminUsersResponseSchema, type UsersFilter } from "../contracts/users.contract"

export async function getUsers(filter: UsersFilter) {
  const params = new URLSearchParams()
  if (filter.q) params.set("q", filter.q)
  if (filter.role) params.set("role", filter.role)
  const query = params.size ? `?${params}` : ""
  return AdminUsersResponseSchema.parse(await fetcher(`/admin/users${query}`))
}

export async function setUserRole(id: string, role: string) {
  await fetcher(`/admin/users/${id}/role`, { method: "PATCH", body: { role } })
}
