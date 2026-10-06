"use client"

import type { ReactNode } from "react"
import type { Permission } from "@/shared/auth/permissions"
import { usePermissions } from "../hooks/usePermissions"

/** Renders children only when the role has [permission]. */
export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}) {
  const { can } = usePermissions()
  return <>{can(permission) ? children : fallback}</>
}
