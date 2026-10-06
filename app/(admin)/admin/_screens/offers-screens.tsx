"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Can } from "@/features/auth/components/Can"
import { usePermissions } from "@/features/auth/hooks/usePermissions"
import { OfferEditor } from "@/features/offers/components/OfferEditor"
import { OffersTable } from "@/features/offers/components/OffersTable"
import { PageHeader } from "@/shared/components/admin-ui"

export function OffersListScreen() {
  return (
    <>
      <PageHeader
        title="Offers"
        description="Ads, vouchers and anything else shown to travelers at airports."
        action={
          <Can permission="offers:write">
            <Button
              nativeButton={false}
              render={(props) => <Link href="/admin/offers/new" {...props} />}
              className="h-9 px-3"
            >
              <Plus className="size-4" /> New offer
            </Button>
          </Can>
        }
      />
      <OffersTable />
    </>
  )
}

export function OfferEditorScreen({ id }: { id?: string }) {
  const { can } = usePermissions()
  return <OfferEditor id={id} canWrite={can("offers:write")} />
}
