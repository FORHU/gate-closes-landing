"use client"

import { Notice, Panel, Pill } from "@/shared/components/admin-ui"
import { usePermissionCatalog, useRoles } from "../hooks/useRoles"

/**
 * Every role with its permissions, read-only: roles are defined in the
 * API's code and change with a deploy (gate-closes-api-v2 decision 13).
 * Hovering a permission shows what it allows.
 */
export function RolesManager() {
  const roles = useRoles()
  const catalog = usePermissionCatalog()

  if (roles.error || catalog.error) {
    return <Notice tone="error">{(roles.error ?? catalog.error)!.message}</Notice>
  }
  if (!roles.data || !catalog.data) return <Notice>Loading…</Notice>

  const describe = new Map(catalog.data.map((p) => [p.name, p.description]))

  return (
    <div className="space-y-4">
      {roles.data.map((role) => (
        <Panel key={role.name} className="p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">{role.label}</h2>
            <Pill>{role.name}</Pill>
          </div>
          {role.description && (
            <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {role.permissions.length === 0 ? (
              <span className="text-sm text-muted-foreground">No permissions.</span>
            ) : (
              role.permissions.map((p) => (
                <span key={p} title={describe.get(p)}>
                  <Pill>{p}</Pill>
                </span>
              ))
            )}
          </div>
        </Panel>
      ))}
    </div>
  )
}
