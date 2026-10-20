"use client"

import Link from "next/link"
import { Notice, Panel, Stat } from "@/shared/components/admin-ui"
import { useOffers } from "../hooks/useOffers"

/** Views, clicks and claims summed over every offer, plus the top live offers. */
export function OffersSummary() {
  const { data: offers, isPending, error } = useOffers()

  const totals = (offers ?? []).reduce(
    (sum, o) => ({
      views: sum.views + o.stats.views,
      clicks: sum.clicks + o.stats.clicks,
      claims: sum.claims + o.stats.claims,
    }),
    { views: 0, clicks: 0, claims: 0 }
  )
  const live = (offers ?? []).filter((o) => o.status === "active")
  const top = [...live]
    .sort((a, b) => b.stats.claims - a.stats.claims || b.stats.views - a.stats.views)
    .slice(0, 5)
  const show = (n: number) => (offers ? n.toLocaleString() : "—")

  return (
    <Panel className="p-5">
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Offer views" value={show(totals.views)} />
        <Stat label="Clicks" value={show(totals.clicks)} />
        <Stat label="Claims" value={show(totals.claims)} />
      </div>
      {offers && (
        <p className="mt-2 text-xs text-muted-foreground">
          All time, across {offers.length} offers ({live.length} live).
        </p>
      )}

      {(error || isPending || offers?.length === 0) && (
        <div className="mt-4">
          {error && <Notice tone="error">{error.message}</Notice>}
          {isPending && <Notice>Loading…</Notice>}
          {offers?.length === 0 && <Notice>No offers yet.</Notice>}
        </div>
      )}

      {top.length > 0 && (
        <ul className="mt-4 divide-y border-t text-sm">
          {top.map((o) => (
            <li key={o.id} className="flex items-baseline justify-between gap-3 py-2">
              <Link href={`/admin/offers/${o.id}`} className="truncate font-medium hover:underline">
                {o.title}
              </Link>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {o.stats.views} views · {o.stats.clicks} clicks · {o.stats.claims} claims
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
