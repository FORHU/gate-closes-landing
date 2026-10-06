"use client"

import { KeyRound, Megaphone, Users } from "lucide-react"
import { AuthGuard } from "@/features/auth/components/AuthGuard"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { usePermissions } from "@/features/auth/hooks/usePermissions"
import type { Permission } from "@/shared/auth/permissions"
import { AdminShell, type NavItem } from "@/shared/components/layout/AdminShell"

const NAV: (NavItem & { permission: Permission })[] = [
  { href: "/admin/offers", label: "Offers", icon: Megaphone, permission: "offers:read" },
  { href: "/admin/users", label: "Users", icon: Users, permission: "users:read" },
  { href: "/admin/roles", label: "Roles", icon: KeyRound, permission: "users:read" },
]

/** Staff-only frame: the sidebar shows only what the role can open. */
export function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Shell>{children}</Shell>
    </AuthGuard>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  const { user, can } = usePermissions()
  const logout = useLogout()
  return (
    <AdminShell
      items={NAV.filter((item) => can(item.permission))}
      user={{ email: user?.email ?? "", role: user?.role ?? "" }}
      onLogout={logout}
    >
      {children}
    </AdminShell>
  )
}
