import { fetcher } from "@/shared/lib/http"
import {
  PermissionCatalogSchema,
  RoleSchema,
  RolesResponseSchema,
  type RoleInput,
} from "../contracts/roles.contract"

export async function getRoles() {
  return RolesResponseSchema.parse(await fetcher("/admin/roles"))
}

export async function getPermissionCatalog() {
  return PermissionCatalogSchema.parse(await fetcher("/admin/permissions"))
}

export async function createRole(input: RoleInput) {
  return RoleSchema.parse(await fetcher("/admin/roles", { method: "POST", body: input }))
}

/** The name never changes; only label, description and permissions. */
export async function updateRole(name: string, input: Partial<Omit<RoleInput, "name">>) {
  return RoleSchema.parse(
    await fetcher(`/admin/roles/${name}`, { method: "PATCH", body: input })
  )
}

export async function deleteRole(name: string) {
  await fetcher(`/admin/roles/${name}`, { method: "DELETE" })
}
