import { useQueryClient } from "@tanstack/react-query"
import { useSafeMutation } from "@/shared/query/useSafeMutation"
import { useSafeQuery } from "@/shared/query/useSafeQuery"
import {
  createRole,
  deleteRole,
  getPermissionCatalog,
  getRoles,
  updateRole,
} from "../api/roles.client"
import { rolesKeys } from "../api/roles.keys"
import { SUPER_ADMIN_ROLE, type Role, type RoleInput } from "../contracts/roles.contract"

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

function useInvalidateRoles() {
  const client = useQueryClient()
  return () => client.invalidateQueries({ queryKey: rolesKeys.list() })
}

export function useCreateRole() {
  const onSuccess = useInvalidateRoles()
  return useSafeMutation<Role, RoleInput>({ mutationFn: createRole, onSuccess })
}

export function useUpdateRole() {
  const onSuccess = useInvalidateRoles()
  return useSafeMutation<Role, RoleInput>({
    // The API refuses any permission change on super admin (it always has
    // everything), so its edits send only label and description.
    mutationFn: ({ name, permissions, ...rest }) =>
      updateRole(name, name === SUPER_ADMIN_ROLE ? rest : { ...rest, permissions }),
    onSuccess,
  })
}

export function useDeleteRole() {
  const onSuccess = useInvalidateRoles()
  return useSafeMutation<void, string>({ mutationFn: deleteRole, onSuccess })
}
