"use client"

import { KeyRound, Megaphone, Plane, Users } from "lucide-react"
import { AuthGuard } from "@/features/auth/components/AuthGuard"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { usePermissions } from "@/features/auth/hooks/usePermissions"
import type { Permission } from "@/shared/auth/permissions"
import type { AdminTheme } from "@/shared/lib/admin-prefs"
import { AdminShell, type NavItem } from "@/shared/components/layout/AdminShell"

const NAV: (NavItem & { permission: Permission })[] = [
  { href: "/admin/offers", label: "Offers", icon: Megaphone, permission: "offers:read" },
  { href: "/admin/users", label: "Users", icon: Users, permission: "users:read" },
  { href: "/admin/roles", label: "Roles", icon: KeyRound, permission: "users:read" },
  { href: "/admin/airports", label: "Airports", icon: Plane, permission: "airports:manage" },
]

type Prefs = { initialCollapsed: boolean; initialTheme: AdminTheme }

/** Staff-only frame: the sidebar shows only what the role can open. */
export function PanelShell({ children, ...prefs }: Prefs & { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Shell {...prefs}>{children}</Shell>
    </AuthGuard>
  )
}

function Shell({ children, ...prefs }: Prefs & { children: React.ReactNode }) {
  const { user, can } = usePermissions()
  const logout = useLogout()
  return (
    <AdminShell
      items={NAV.filter((item) => can(item.permission))}
      user={{ email: user?.email ?? "", role: user?.role ?? "" }}
      onLogout={logout}
      {...prefs}
    >
      {children}
    </AdminShell>
  )
}
