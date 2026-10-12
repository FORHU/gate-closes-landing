"use client"

import { useState } from "react"
import { TicketPercent, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { displayStatus, formatDay, kindLabel, servesAirport, type DisplayStatus, type PrototypeOffer } from "./offer-model"
import { APP, OfferImage, OfferSheetPreview, PhoneFrame } from "./offer-sheet-preview"

const AIRPORTS = ["SIN", "ICN"] as const

// Drafts and paused offers are never shown to travelers.
const FILTERS = [
  { id: "now", label: "Available now", statuses: ["live"] },
  { id: "soon", label: "Coming up", statuses: ["scheduled"] },
  { id: "past", label: "Expired", statuses: ["expired", "ended"] },
] as const satisfies readonly { id: string; label: string; statuses: readonly DisplayStatus[] }[]

type FilterId = (typeof FILTERS)[number]["id"]

function validity(offer: PrototypeOffer, status: DisplayStatus) {
  if (status === "scheduled") return `Starts ${formatDay(offer.startsAt)}`
  if (status === "expired") return `Ended ${formatDay(offer.endsAt)}`
  if (status === "ended") return "Ended"
  return offer.endsAt ? `Until ${formatDay(offer.endsAt)}` : "No end date"
}

/**
 * What a traveler at one airport would see. Today the app only receives live
 * offers (GET /api/offers); "Coming up" and "Expired" are here so the team
 * can decide whether travelers should see them at all.
 */
export function TravelerView({ offers, today }: { offers: PrototypeOffer[]; today: string }) {
  const [airport, setAirport] = useState<(typeof AIRPORTS)[number]>("SIN")
  const [filter, setFilter] = useState<FilterId>("now")
  const [openId, setOpenId] = useState<string | null>(null)

  const statuses: readonly DisplayStatus[] = FILTERS.find((f) => f.id === filter)!.statuses
  const visible = offers
    .filter((o) => servesAirport(o, airport))
    .map((o) => ({ offer: o, status: displayStatus(o, today) }))
    .filter(({ status }) => statuses.includes(status))
  const open = offers.find((o) => o.id === openId)

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex max-w-md flex-col gap-4 lg:pt-4">
        <h2 className="text-xl font-medium tracking-[-0.02em]">What travelers see</h2>
        <p className="text-sm text-ink/55">
          Offers show up for the airport a traveler is at, plus anything targeted at all airports. Tap a card
          to open it the way the app does, and claim a voucher to see its code.
        </p>
        <p className="rounded-2xl bg-ink/[0.03] px-4 py-3 text-xs text-ink/55 ring-1 ring-ink/10">
          The app currently shows only offers that are live. The Coming up and Expired tabs are a proposal
          for the team to review.
        </p>
      </div>

      <div className="mx-auto w-full max-w-[340px]">
        <PhoneFrame>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 pt-10 pb-3">
              <div>
                <p className="text-[11px]" style={{ color: APP.textMuted }}>
                  You&apos;re at
                </p>
                <p className="text-[17px] font-bold">Offers at {airport}</p>
              </div>
              <div className="flex rounded-full p-0.5" style={{ background: APP.surface }}>
                {AIRPORTS.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setAirport(code)
                      setOpenId(null)
                    }}
                    aria-pressed={airport === code}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                      airport === code ? "bg-white text-black" : "text-white/60"
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div role="tablist" aria-label="Offer timing" className="flex gap-1.5 px-4 pb-3">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors",
                    filter === f.id ? "text-black" : "text-white/65"
                  )}
                  style={{ background: filter === f.id ? APP.offer : APP.surface }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-6 [scrollbar-width:none]">
              {visible.length === 0 && (
                <li className="mt-10 flex flex-col items-center gap-2 text-center" style={{ color: APP.textMuted }}>
                  <TicketPercent strokeWidth={1.5} className="size-7" aria-hidden />
                  <span className="text-[13px]">Nothing here at {airport} right now.</span>
                </li>
              )}
              {visible.map(({ offer, status }) => (
                <li key={offer.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(offer.id)}
                    className={cn(
                      "flex w-full flex-col gap-2.5 rounded-[16px] p-2.5 text-left transition-transform active:scale-[0.98]",
                      status !== "live" && "opacity-70"
                    )}
                    style={{ background: APP.surface }}
                  >
                    <OfferImage offer={offer} className={cn(status === "expired" || status === "ended" ? "grayscale" : "")} />
                    <span className="flex flex-col gap-0.5 px-1">
                      <span className="text-[11px] font-semibold" style={{ color: APP.offer }}>
                        {kindLabel(offer.kind)}
                      </span>
                      <span className="text-[14px] leading-snug font-semibold">{offer.title}</span>
                      <span className="text-[11px]" style={{ color: APP.textMuted }}>
                        {validity(offer, status)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {open && (
            <div className="absolute inset-0 z-10 flex flex-col justify-end">
              <button
                type="button"
                aria-label="Close offer"
                onClick={() => setOpenId(null)}
                className="absolute inset-0 bg-black/55"
              />
              <div className="relative max-h-[86%] overflow-y-auto [scrollbar-width:none]">
                <button
                  type="button"
                  aria-label="Close offer"
                  onClick={() => setOpenId(null)}
                  className="absolute top-4 right-4 z-10 grid size-8 place-items-center rounded-full bg-black/50 text-white"
                >
                  <X className="size-4" />
                </button>
                <OfferSheetPreview key={open.id} offer={open} airport={airport} />
              </div>
            </div>
          )}
        </PhoneFrame>
      </div>
    </div>
  )
}
