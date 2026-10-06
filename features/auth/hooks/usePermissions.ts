import type { Permission } from "@/shared/auth/permissions"
import { useMe } from "./useMe"

/** What the logged-in user may do. The API still checks every request. */
export function usePermissions() {
  const { data } = useMe()
  const permissions = data?.permissions ?? []
  return {
    user: data?.user,
    permissions,
    can: (permission: Permission) => permissions.includes(permission),
  }
}
