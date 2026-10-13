"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { STAFF_PERMISSIONS } from "@/shared/auth/permissions"
import { CenteredMessage } from "@/shared/components/admin-ui"
import { useMe } from "../hooks/useMe"
import { useLogout } from "../hooks/useLogout"

/**
 * Shows the admin area only to staff. An ended session is handled globally
 * (toast + AuthListener → login); this covers loading, other errors, and
 * logged-in users whose role has no admin permission.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { data, error, isPending } = useMe()
  const logout = useLogout()

  if (isPending) return <CenteredMessage title="Loading…" />
  if (error) return <CenteredMessage title="Couldn't load your account" body={error.message} />

  if (!data.permissions.some((p) => STAFF_PERMISSIONS.includes(p))) {
    return (
      <CenteredMessage
        title="No access"
        body={`${data.user.email} doesn't have access to the admin area. Ask a super admin for a staff role.`}
      >
        <Button variant="outline" onClick={logout}>
          Log out
        </Button>
      </CenteredMessage>
    )
  }
  return <>{children}</>
}
