"use client"

import Image from "next/image"
import { Eye, ImageOff, MapPin, Pencil, Plus, TicketPercent, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  airportsLabel,
  displayStatus,
  formatDay,
  kindLabel,
  STATUS_META,
  type DisplayStatus,
  type PrototypeOffer,
} from "./offer-model"

export const LIST_FILTERS = [
  { id: "all", label: "All", statuses: null },
  { id: "live", label: "Live", statuses: ["live"] },
  { id: "scheduled", label: "Scheduled", statuses: ["scheduled"] },
  { id: "draft", label: "Drafts", statuses: ["draft", "paused"] },
  { id: "past", label: "Ended", statuses: ["ended", "expired"] },
] as const satisfies readonly { id: string; label: string; statuses: readonly DisplayStatus[] | null }[]

export type ListFilter = (typeof LIST_FILTERS)[number]["id"]

function dateRange(offer: PrototypeOffer) {
  if (!offer.startsAt && !offer.endsAt) return "No dates"
  if (!offer.endsAt) return `From ${formatDay(offer.startsAt)}`
  if (!offer.startsAt) return `Until ${formatDay(offer.endsAt)}`
  return `${formatDay(offer.startsAt)} to ${formatDay(offer.endsAt)}`
}

const ACTION =
  "grid size-9 place-items-center rounded-full text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme"

function Thumb({ offer }: { offer: PrototypeOffer }) {
  return (
    <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-[10px] bg-ink/[0.05] ring-1 ring-ink/10">
      {offer.imageUrl ? (
        <Image src={offer.imageUrl} alt="" fill unoptimized sizes="96px" className="object-cover" />
      ) : (
        <div className="grid size-full place-items-center text-ink/30">
          <ImageOff strokeWidth={1.5} className="size-4" aria-hidden />
        </div>
      )}
    </div>
  )
}

export function OfferList({
  offers,
  today,
  filter,
  onFilterChange,
  onNew,
  onPreview,
  onEdit,
  onDelete,
}: {
  offers: PrototypeOffer[]
  today: string
  filter: ListFilter
  onFilterChange: (filter: ListFilter) => void
  onNew: () => void
  onPreview: (offer: PrototypeOffer) => void
  onEdit: (offer: PrototypeOffer) => void
  onDelete: (offer: PrototypeOffer) => void
}) {
  const rows = offers.map((offer) => ({ offer, status: displayStatus(offer, today) }))
  const statuses: readonly DisplayStatus[] | null = LIST_FILTERS.find((f) => f.id === filter)!.statuses
  const visible = statuses ? rows.filter((r) => statuses.includes(r.status)) : rows
  const count = (s: readonly DisplayStatus[] | null) => (s ? rows.filter((r) => s.includes(r.status)).length : rows.length)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filter offers" className="flex flex-wrap gap-1.5">
          {LIST_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => onFilterChange(f.id)}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme",
                filter === f.id ? "bg-theme/10 text-theme-ink ring-1 ring-theme/30" : "text-ink/55 ring-1 ring-ink/10 hover:bg-ink/5 hover:text-ink"
              )}
            >
              {f.label}
              <span className="text-[10px] text-current/60 tabular-nums">{count(f.statuses)}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onNew}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-theme px-5 text-sm font-semibold text-black transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-theme/90 active:scale-[0.98]"
        >
          <Plus strokeWidth={2} className="size-4" aria-hidden />
          New offer
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 px-6 py-14 text-center">
          <TicketPercent strokeWidth={1.5} className="size-7 text-ink/30" aria-hidden />
          <p className="text-sm font-medium text-ink/80">{offers.length === 0 ? "No offers yet" : "Nothing in this view"}</p>
          <p className="max-w-xs text-xs text-ink/45">
            {offers.length === 0
              ? "Create a voucher, announcement or ad and it shows up here."
              : "Try another filter, or add a new offer."}
          </p>
          <button type="button" onClick={onNew} className="mt-1 text-xs font-semibold text-theme-ink hover:underline">
            New offer
          </button>
        </div>
      ) : (
        <ul className="flex flex-col">
          {visible.map(({ offer, status }) => (
            <li
              key={offer.id}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-ink/[0.06] py-3.5 last:border-0 md:grid-cols-[auto_minmax(0,1fr)_9rem_8.5rem_auto]"
            >
              <Thumb offer={offer} />
              <div className="min-w-0">
                <p className="line-clamp-2 font-medium text-ink/90 md:truncate" title={offer.title}>
                  {offer.title}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/45">
                  <span>{kindLabel(offer.kind)}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin strokeWidth={1.5} className="size-3" aria-hidden />
                    {airportsLabel(offer.airports)}
                  </span>
                  <span className="md:hidden">{dateRange(offer)}</span>
                </p>
              </div>
              <div className="col-start-2 md:col-start-auto">
                <Badge variant="outline" className={STATUS_META[status].className}>
                  {STATUS_META[status].label}
                </Badge>
              </div>
              <p className="hidden text-xs text-ink/50 tabular-nums md:block">{dateRange(offer)}</p>
              <div className="col-span-2 -mt-1 flex justify-end gap-0.5 md:col-span-1 md:mt-0">
                <button type="button" onClick={() => onPreview(offer)} className={ACTION} aria-label={`Preview ${offer.title}`} title="Preview">
                  <Eye strokeWidth={1.5} className="size-4" />
                </button>
                <button type="button" onClick={() => onEdit(offer)} className={ACTION} aria-label={`Edit ${offer.title}`} title="Edit">
                  <Pencil strokeWidth={1.5} className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(offer)}
                  className={cn(ACTION, "hover:bg-destructive/10 hover:text-red-600 dark:hover:text-red-300")}
                  aria-label={`Delete ${offer.title}`}
                  title="Delete"
                >
                  <Trash2 strokeWidth={1.5} className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
