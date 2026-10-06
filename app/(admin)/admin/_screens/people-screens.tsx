"use client"

import { usePermissions } from "@/features/auth/hooks/usePermissions"
import { RolesManager } from "@/features/roles/components/RolesManager"
import { useRoles } from "@/features/roles/hooks/useRoles"
import { UsersTable } from "@/features/users/components/UsersTable"
import { Notice, PageHeader } from "@/shared/components/admin-ui"

/** Users page: the roles feature supplies the role choices to the users table. */
export function UsersScreen() {
  const { user, can } = usePermissions()
  const roles = useRoles()

  return (
    <>
      <PageHeader title="Users" description="Everyone with a GateCloses account, newest first." />
      {roles.error && <Notice tone="error">{roles.error.message}</Notice>}
      <UsersTable
        roles={(roles.data ?? []).map((r) => ({ name: r.name, label: r.label }))}
        canChangeRole={can("users:role")}
        currentUserId={user?._id ?? ""}
      />
    </>
  )
}

export function RolesScreen() {
  const { can } = usePermissions()
  return (
    <>
      <PageHeader
        title="Roles"
        description="What each role may do. A user has one role; plain app users are “User”."
      />
      <RolesManager canManage={can("roles:manage")} />
    </>
  )
}
