"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Lock, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Notice, Panel, Pill } from "@/shared/components/admin-ui"
import {
  ROLE_NAME_PATTERN,
  SUPER_ADMIN_ROLE,
  type PermissionInfo,
  type Role,
  type RoleInput,
} from "../contracts/roles.contract"
import {
  useCreateRole,
  useDeleteRole,
  usePermissionCatalog,
  useRoles,
  useUpdateRole,
} from "../hooks/useRoles"

/**
 * Every role with its permissions. With `canManage` (roles:manage) roles
 * can be created, edited and deleted. The API's rules show here too: super
 * admin always has everything, system roles can't be deleted, and a role
 * still given to users can't be deleted (the API says how many).
 */
export function RolesManager({ canManage }: { canManage: boolean }) {
  const roles = useRoles()
  const catalog = usePermissionCatalog()
  const [creating, setCreating] = useState(false)

  if (roles.error || catalog.error) {
    return <Notice tone="error">{(roles.error ?? catalog.error)!.message}</Notice>
  }
  if (!roles.data || !catalog.data) return <Notice>Loading…</Notice>

  return (
    <div className="space-y-4">
      {canManage && !creating && (
        <Button className="h-9 px-3" onClick={() => setCreating(true)}>
          <Plus className="size-4" /> New role
        </Button>
      )}
      {creating && (
        <RoleCard catalog={catalog.data} canManage onDone={() => setCreating(false)} />
      )}
      {roles.data.map((role) => (
        <RoleCard key={role.name} role={role} catalog={catalog.data} canManage={canManage} />
      ))}
    </div>
  )
}

/** One role: read view, or its edit form. Without `role` it creates one. */
function RoleCard({
  role,
  catalog,
  canManage,
  onDone,
}: {
  role?: Role
  catalog: PermissionInfo[]
  canManage: boolean
  onDone?: () => void
}) {
  const isNew = !role
  const isSuperAdmin = role?.name === SUPER_ADMIN_ROLE
  const [editing, setEditing] = useState(isNew)
  const [form, setForm] = useState<RoleInput>({
    name: role?.name ?? "",
    label: role?.label ?? "",
    description: role?.description ?? "",
    permissions: role?.permissions ?? [],
  })
  const create = useCreateRole()
  const update = useUpdateRole()
  const remove = useDeleteRole()
  const saving = create.isPending || update.isPending
  const error = (create.error ?? update.error ?? remove.error)?.message

  function close() {
    setEditing(false)
    onDone?.()
  }

  function onSave(event: React.FormEvent) {
    event.preventDefault()
    const input = { ...form, description: form.description?.trim() || null }
    if (isNew) {
      create.mutate(input, {
        onSuccess: (created) => {
          toast.success(`Role "${created.label}" created.`)
          close()
        },
      })
    } else {
      update.mutate(input, {
        onSuccess: () => {
          toast.success(`Role "${form.label}" saved.`)
          close()
        },
      })
    }
  }

  function onDelete() {
    if (!role || !window.confirm(`Delete the role "${role.label}"?`)) return
    remove.mutate(role.name, {
      onSuccess: () => toast.success(`Role "${role.label}" deleted.`),
    })
  }

  function toggle(name: PermissionInfo["name"], on: boolean) {
    setForm((f) => ({
      ...f,
      permissions: on ? [...f.permissions, name] : f.permissions.filter((p) => p !== name),
    }))
  }

  if (!editing && role) {
    return (
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">{role.label}</h2>
              <Pill>{role.name}</Pill>
              {role.isSystem && (
                <span className="text-xs text-muted-foreground">system role</span>
              )}
            </div>
            {role.description && (
              <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
            )}
          </div>
          {canManage && (
            <div className="flex gap-2">
              <Button variant="outline" className="h-8 px-3" onClick={() => setEditing(true)}>
                Edit
              </Button>
              {!role.isSystem && (
                <Button
                  variant="outline"
                  className="h-8 px-2 text-destructive"
                  aria-label={`Delete ${role.label}`}
                  disabled={remove.isPending}
                  onClick={onDelete}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {role.permissions.length === 0 ? (
            <span className="text-sm text-muted-foreground">No permissions.</span>
          ) : (
            role.permissions.map((p) => <Pill key={p}>{p}</Pill>)
          )}
        </div>
        {error && (
          <div className="mt-3">
            <Notice tone="error">{error}</Notice>
          </div>
        )}
      </Panel>
    )
  }

  return (
    <Panel className="p-4 sm:p-5">
      <form onSubmit={onSave} className="space-y-4">
        <h2 className="font-semibold">{isNew ? "New role" : `Edit ${role?.label}`}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`label-${form.name || "new"}`}>Label</Label>
            <Input
              id={`label-${form.name || "new"}`}
              required
              maxLength={60}
              placeholder="Voucher manager"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`name-${form.name || "new"}`}>Name</Label>
            <Input
              id={`name-${form.name || "new"}`}
              required
              disabled={!isNew}
              pattern={ROLE_NAME_PATTERN.source}
              placeholder="voucher_manager"
              className="font-mono"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value.toLowerCase() }))}
            />
            <p className="text-xs text-muted-foreground">
              {isNew ? "Lowercase, digits or _. Can't be changed later." : "Can't be changed."}
            </p>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`description-${form.name || "new"}`}>Description</Label>
          <Input
            id={`description-${form.name || "new"}`}
            maxLength={300}
            value={form.description ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Permissions</legend>
          {isSuperAdmin && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5" /> Super admin always has every permission.
            </p>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            {catalog.map((permission) => (
              <label
                key={permission.name}
                className="flex items-start gap-2.5 rounded-lg border p-3 text-sm"
              >
                <input
                  type="checkbox"
                  className="mt-0.5"
                  disabled={isSuperAdmin}
                  checked={isSuperAdmin || form.permissions.includes(permission.name)}
                  onChange={(e) => toggle(permission.name, e.target.checked)}
                />
                <span>
                  <span className="font-mono text-xs">{permission.name}</span>
                  <span className="block text-muted-foreground">{permission.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {error && <Notice tone="error">{error}</Notice>}
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="h-9 px-4">
            {saving ? "Saving…" : isNew ? "Create role" : "Save"}
          </Button>
          <Button type="button" variant="outline" className="h-9 px-4" onClick={close}>
            Cancel
          </Button>
        </div>
      </form>
    </Panel>
  )
}
