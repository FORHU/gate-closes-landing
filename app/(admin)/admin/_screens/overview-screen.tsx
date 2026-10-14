"use client"

import { Can } from "@/features/auth/components/Can"
import { usePermissions } from "@/features/auth/hooks/usePermissions"
import { OffersSummary } from "@/features/offers/components/OffersSummary"
import { EchoesTodayCard } from "@/features/overview/components/EchoesTodayCard"
import { HealthCard } from "@/features/overview/components/HealthCard"
import { SignupsCard } from "@/features/overview/components/SignupsCard"
import { Notice, PageHeader } from "@/shared/components/admin-ui"

/** Is GateCloses healthy today? Each card shows only for roles that may see it. */
export function OverviewScreen() {
  const { can } = usePermissions()
  const any = can("users:read") || can("offers:read") || can("system:read")

  return (
    <>
      <PageHeader title="Overview" description="Whether GateCloses is healthy today." />
      {!any && <Notice>Nothing on the overview for your role. Use the menu to get started.</Notice>}
      <div className="grid gap-4 md:grid-cols-2">
        <Can permission="users:read">
          <SignupsCard />
        </Can>
        <Can permission="system:read">
          <HealthCard />
        </Can>
        <Can permission="offers:read">
          <div className="md:col-span-full">
            <OffersSummary />
          </div>
        </Can>
        <Can permission="users:read">
          <div className="md:col-span-full">
            <EchoesTodayCard />
          </div>
        </Can>
      </div>
    </>
  )
}
