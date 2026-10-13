import { useSafeQuery } from "@/shared/query/useSafeQuery"
import { getPermissionCatalog, getRoles } from "../api/roles.client"
import { rolesKeys } from "../api/roles.keys"

export function useRoles() {
  return useSafeQuery({ queryKey: rolesKeys.list(), queryFn: getRoles })
}

export function usePermissionCatalog() {
  return useSafeQuery({
    queryKey: rolesKeys.permissions(),
    queryFn: getPermissionCatalog,
    staleTime: Infinity,
  })
}
