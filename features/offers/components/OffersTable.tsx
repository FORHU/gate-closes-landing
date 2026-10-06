"use client"

import Link from "next/link"
import { useState } from "react"
import { Notice, Panel, Pill, Select, StatusPill, formatDate } from "@/shared/components/admin-ui"
import { OFFER_STATUSES, type OfferStatus } from "../contracts/offers.contract"
import { useOffers } from "../hooks/useOffers"

/** Every offer with its status, airports, schedule and totals. */
export function OffersTable() {
  const [status, setStatus] = useState<OfferStatus | "">("")
  const { data: offers, isPending, error } = useOffers(status || undefined)

  return (
    <>
      <div className="mb-4 flex items-center gap-2 text-sm">
        <label htmlFor="offer-status">Status</label>
        <Select
          id="offer-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as OfferStatus | "")}
        >
          <option value="">All</option>
          {OFFER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {error && <Notice tone="error">{error.message}</Notice>}
      {isPending && <Notice>Loading…</Notice>}
      {offers?.length === 0 && <Notice>No offers yet.</Notice>}

      {offers && offers.length > 0 && (
        <Panel className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Offer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Airports</th>
                <th className="px-4 py-3 font-medium">Runs</th>
                <th className="px-4 py-3 text-right font-medium">Views</th>
                <th className="px-4 py-3 text-right font-medium">Clicks</th>
                <th className="px-4 py-3 text-right font-medium">Claims</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer._id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/offers/${offer._id}`}
                      className="font-medium hover:underline"
                    >
                      {offer.title}
                    </Link>
                    <div className="mt-0.5 flex gap-1 text-xs text-muted-foreground">
                      <Pill>{offer.kind}</Pill>
                      {offer.placements.map((p) => (
                        <Pill key={p}>{p}</Pill>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={offer.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {offer.airports.includes("*") ? "All" : offer.airports.join(", ")}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap text-muted-foreground">
                    {formatDate(offer.startsAt)} → {formatDate(offer.endsAt)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{offer.stats.views}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{offer.stats.clicks}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {offer.stats.claims}
                    {offer.limits.maxClaims != null && (
                      <span className="text-muted-foreground"> / {offer.limits.maxClaims}</span>
                    )}
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
