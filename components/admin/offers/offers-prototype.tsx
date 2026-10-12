"use client"

import { useReducer, useState } from "react"
import { FlaskConical } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ALL_AIRPORTS, type PrototypeOffer } from "./offer-model"
import { OfferFormSheet } from "./offer-form-sheet"
import { OfferList, type ListFilter } from "./offer-list"
import { OfferSheetPreview, PhoneFrame } from "./offer-sheet-preview"
import { sampleOffers } from "./sample-offers"
import { TravelerView } from "./traveler-view"
import { useAdminDark } from "./use-admin-dark"

type Action =
  | { type: "save"; offer: PrototypeOffer }
  | { type: "remove"; id: string }

// Frontend-only: nothing here calls the API. Swap this reducer for
// /api/admin/offers requests when the real screen is built.
function offersReducer(offers: PrototypeOffer[], action: Action) {
  switch (action.type) {
    case "save":
      return offers.some((o) => o.id === action.offer.id)
        ? offers.map((o) => (o.id === action.offer.id ? action.offer : o))
        : [action.offer, ...offers]
    case "remove":
      return offers.filter((o) => o.id !== action.id)
  }
}

const TABS = [
  { id: "manage", label: "Manage" },
  { id: "traveler", label: "Traveler view" },
] as const

type Editing = { offer: PrototypeOffer | null; key: number } | null

export function OffersPrototype({ today }: { today: string }) {
  const dark = useAdminDark()
  const [offers, dispatch] = useReducer(offersReducer, today, sampleOffers)
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("manage")
  const [filter, setFilter] = useState<ListFilter>("all")
  // A new key per opening gives the form fresh default values each time.
  const [editing, setEditing] = useState<Editing>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [previewing, setPreviewing] = useState<PrototypeOffer | null>(null)
  const [deleting, setDeleting] = useState<PrototypeOffer | null>(null)

  function openForm(offer: PrototypeOffer | null) {
    setEditing((prev) => ({ offer, key: (prev?.key ?? 0) + 1 }))
    setFormOpen(true)
  }

  const previewAirport = previewing && !previewing.airports.includes(ALL_AIRPORTS) ? previewing.airports[0] : "SIN"
  const dialogClass = cn("border-0 bg-panel text-ink ring-1 ring-ink/10", dark && "dark")

  return (
    <>
      <p className="mb-5 flex items-start gap-2.5 rounded-2xl bg-theme/[0.07] px-4 py-3 text-xs text-ink/65 ring-1 ring-theme/20 animate-rise [animation-delay:40ms] motion-reduce:animate-none">
        <FlaskConical strokeWidth={1.5} className="mt-px size-4 shrink-0 text-theme-ink" aria-hidden />
        Prototype for review. Changes stay in this tab and nothing is published or saved to the server.
      </p>

      <div role="tablist" aria-label="Prototype view" className="mb-5 inline-flex rounded-full bg-ink/[0.04] p-1 ring-1 ring-ink/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "h-9 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme",
              tab === t.id ? "bg-panel text-ink shadow-sm ring-1 ring-ink/10" : "text-ink/55 hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="rounded-[1.75rem] bg-ink/[0.03] p-1.5 ring-1 ring-ink/10 animate-rise [animation-delay:80ms] motion-reduce:animate-none">
        <div className="rounded-[calc(1.75rem-0.375rem)] bg-panel p-4 shadow-[inset_0_1px_1px_rgb(255_255_255/0.07)] md:p-6">
          {tab === "manage" ? (
            <OfferList
              offers={offers}
              today={today}
              filter={filter}
              onFilterChange={setFilter}
              onNew={() => openForm(null)}
              onPreview={setPreviewing}
              onEdit={(offer) => openForm(offer)}
              onDelete={setDeleting}
            />
          ) : (
            <TravelerView offers={offers} today={today} />
          )}
        </div>
      </section>

      {editing && (
        <OfferFormSheet
          key={editing.key}
          open={formOpen}
          onOpenChange={setFormOpen}
          offer={editing.offer}
          today={today}
          onSave={(offer) => dispatch({ type: "save", offer })}
        />
      )}

      <Dialog open={previewing !== null} onOpenChange={(open) => !open && setPreviewing(null)}>
        <DialogContent className={cn(dialogClass, "max-w-[22rem] p-5 sm:max-w-[22rem]")}>
          <DialogTitle className="text-base font-medium text-ink">Preview</DialogTitle>
          <DialogDescription className="text-xs text-ink/45">How this offer opens in the app.</DialogDescription>
          {previewing && (
            <div className="mx-auto mt-2 w-[270px]">
              <PhoneFrame map>
                <div className="flex h-full flex-col justify-end">
                  <OfferSheetPreview key={previewing.id} offer={previewing} airport={previewAirport} />
                </div>
              </PhoneFrame>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent showCloseButton={false} className={cn(dialogClass, "max-w-sm p-6 sm:max-w-sm")}>
          <DialogTitle className="text-base font-medium text-ink">Delete this offer?</DialogTitle>
          <DialogDescription className="text-sm text-ink/55">
            &ldquo;{deleting?.title}&rdquo; will be removed from the list. In this prototype you can&apos;t undo it,
            but reloading the page brings the samples back.
          </DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              className="h-10 rounded-full px-5 text-sm text-ink/70 ring-1 ring-ink/10 hover:bg-ink/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleting) dispatch({ type: "remove", id: deleting.id })
                setDeleting(null)
              }}
              className="h-10 rounded-full bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-600/90 active:scale-[0.98]"
            >
              Delete offer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
