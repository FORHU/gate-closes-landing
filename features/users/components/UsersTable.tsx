"use client"

import { useDeferredValue, useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Notice, Panel, Select, formatDate } from "@/shared/components/admin-ui"
import type { AdminUser, RoleOption } from "../contracts/users.contract"
import { useSetUserRole, useUsers } from "../hooks/useUsers"

/**
 * Users, searchable by email/username prefix and filterable by role. With
 * `canChangeRole` each row gets a role picker (never your own row: the API
 * refuses changing your own role).
 */
export function UsersTable({
  roles,
  canChangeRole,
  currentUserId,
}: {
  roles: RoleOption[]
  canChangeRole: boolean
  currentUserId: string
}) {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const q = useDeferredValue(search.trim())
  const { data: users, isPending, error } = useUsers({ q: q || undefined, role: role || undefined })
  const labelOf = (name: string) => roles.find((r) => r.name === name)?.label ?? name

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <Input
          type="search"
          placeholder="Search email or username"
          className="h-8 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="user-role">Role</label>
        <Select id="user-role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All</option>
          {roles.map((r) => (
            <option key={r.name} value={r.name}>
              {r.label}
            </option>
          ))}
        </Select>
      </div>

      {error && <Notice tone="error">{error.message}</Notice>}
      {isPending && <Notice>Loading…</Notice>}
      {users?.length === 0 && <Notice>No users match.</Notice>}

      {users && users.length > 0 && (
        <Panel className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{user.username ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {canChangeRole && user._id !== currentUserId ? (
                      <RolePicker user={user} roles={roles} />
                    ) : (
                      <span>
                        {labelOf(user.role)}
                        {user._id === currentUserId && (
                          <span className="text-muted-foreground"> (you)</span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  )
}

function RolePicker({ user, roles }: { user: AdminUser; roles: RoleOption[] }) {
  const setRole = useSetUserRole()

  function onChange(role: string) {
    const label = roles.find((r) => r.name === role)?.label ?? role
    if (!window.confirm(`Make ${user.email} a ${label}?`)) return
    setRole.mutate(
      { id: user._id, role },
      {
        onSuccess: () => toast.success(`${user.email} is now ${label}.`),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <Select
      aria-label={`Role of ${user.email}`}
      value={user.role}
      disabled={setRole.isPending}
      onChange={(e) => onChange(e.target.value)}
    >
      {roles.map((r) => (
        <option key={r.name} value={r.name}>
          {r.label}
        </option>
      ))}
    </Select>
  )
}
