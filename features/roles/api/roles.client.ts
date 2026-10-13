import { fetcher } from "@/shared/lib/http"
import { PermissionCatalogSchema, RolesResponseSchema } from "../contracts/roles.contract"

/** Read-only: the API defines roles in code and refuses changes (405). */
export async function getRoles() {
  return RolesResponseSchema.parse(await fetcher("/admin/roles"))
}

export async function getPermissionCatalog() {
  return PermissionCatalogSchema.parse(await fetcher("/admin/permissions"))
}
