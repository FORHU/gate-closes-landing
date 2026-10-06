"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Notice, PageHeader, Panel, Select } from "@/shared/components/admin-ui"
import { OFFER_STATUSES, type OfferStatus, type OfferStats } from "../contracts/offers.contract"
import { useDeleteOffer, useOffer, useOfferStats, useSaveOffer } from "../hooks/useOffers"
import {
  EMPTY_OFFER_FORM,
  formToOfferInput,
  offerToForm,
  type OfferFormState,
} from "../lib/offer-form"

/** Kinds offered as suggestions; any lowercase word is accepted. */
const KIND_SUGGESTIONS = ["ad", "voucher", "lounge_pass", "service"]

const backLink = (
  <Link
    href="/admin/offers"
    className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
  >
    <ArrowLeft className="size-4" /> Offers
  </Link>
)

/**
 * Create (no `id`) or edit an offer, with its stats. `canWrite` comes from
 * the page (auth is another feature); without it everything is read-only.
 */
export function OfferEditor({ id, canWrite }: { id?: string; canWrite: boolean }) {
  if (!id) {
    return (
      <>
        {backLink}
        <PageHeader title="New offer" />
        <OfferForm initial={EMPTY_OFFER_FORM} canWrite={canWrite} />
      </>
    )
  }
  return <ExistingOffer id={id} canWrite={canWrite} />
}

function ExistingOffer({ id, canWrite }: { id: string; canWrite: boolean }) {
  const router = useRouter()
  const offer = useOffer(id)
  const stats = useOfferStats(id)
  const remove = useDeleteOffer()

  function onDelete() {
    if (!window.confirm("Delete this offer? Its stats are deleted too.")) return
    remove.mutate(id, {
      onSuccess: () => {
        toast.success("Offer deleted.")
        router.replace("/admin/offers")
      },
    })
  }

  if (!offer.data) {
    return (
      <>
        {backLink}
        {offer.error ? (
          <Notice tone="error">{offer.error.message}</Notice>
        ) : (
          <Notice>Loading…</Notice>
        )}
      </>
    )
  }

  return (
    <>
      {backLink}
      <PageHeader
        title={offer.data.title}
        description={canWrite ? undefined : "You can view offers but not change them."}
        action={
          canWrite && (
            <Button
              variant="outline"
              className="h-9 px-3 text-destructive"
              disabled={remove.isPending}
              onClick={onDelete}
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          )
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Remounts with fresh values after each save. */}
        <OfferForm
          key={offer.data.updatedAt ?? offer.data.createdAt}
          id={id}
          initial={offerToForm(offer.data)}
          canWrite={canWrite}
        />
        <OfferStatsPanel stats={stats.data} />
      </div>
    </>
  )
}

function OfferForm({
  id,
  initial,
  canWrite,
}: {
  id?: string
  initial: OfferFormState
  canWrite: boolean
}) {
  const router = useRouter()
  const save = useSaveOffer(id)
  const [form, setForm] = useState(initial)
  const [inputError, setInputError] = useState<string | null>(null)

  const set = <K extends keyof OfferFormState>(key: K, value: OfferFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setInputError(null)
    let input
    try {
      input = formToOfferInput(form)
    } catch (err) {
      setInputError((err as Error).message)
      return
    }
    save.mutate(input, {
      onSuccess: (offer) => {
        toast.success(id ? "Offer saved." : "Offer created.")
        if (!id) router.replace(`/admin/offers/${offer._id}`)
      },
    })
  }

  const error = inputError ?? save.error?.message

  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={!canWrite || save.isPending} className="space-y-6">
        <Section title="What travelers see">
          <Row>
            <Field label="Kind" hint="ad, voucher, or a new kind of your own">
              <Input
                list="offer-kinds"
                required
                pattern="[a-zA-Z][a-zA-Z0-9_\-]{0,31}"
                value={form.kind}
                onChange={(e) => set("kind", e.target.value)}
              />
              <datalist id="offer-kinds">
                {KIND_SUGGESTIONS.map((k) => (
                  <option key={k} value={k} />
                ))}
              </datalist>
            </Field>
            <Field label="Title">
              <Input
                required
                maxLength={120}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </Field>
          </Row>
          <Field label="Text">
            <Textarea
              rows={3}
              maxLength={2000}
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
            />
          </Field>
          <Field label="Image URL">
            <Input
              type="url"
              placeholder="https://…"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
            />
          </Field>
          <Row>
            <Field label="Button label">
              <Input
                maxLength={40}
                placeholder="Get the deal"
                value={form.ctaLabel}
                onChange={(e) => set("ctaLabel", e.target.value)}
              />
            </Field>
            <Field label="Button link">
              <Input
                type="url"
                placeholder="https://…"
                value={form.ctaUrl}
                onChange={(e) => set("ctaUrl", e.target.value)}
              />
            </Field>
          </Row>
        </Section>

        <Section title="Where and when">
          <Field label="Airports" hint='IATA codes, e.g. "MNL, BAG", or "*" for every airport'>
            <Input
              required
              className="font-mono uppercase"
              value={form.airports}
              onChange={(e) => set("airports", e.target.value)}
            />
          </Field>
          <Field
            label="Placement"
            hint="Map pin: a marker at a random spot inside the airport. Card: the airport sheet's offer slot."
          >
            <div className="flex gap-4 text-sm">
              {(["pin", "card"] as const).map((placement) => (
                <label key={placement} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.placements.includes(placement)}
                    onChange={(e) =>
                      set(
                        "placements",
                        e.target.checked
                          ? [...form.placements, placement]
                          : form.placements.filter((p) => p !== placement)
                      )
                    }
                  />
                  {placement === "pin" ? "Map pin" : "Card"}
                </label>
              ))}
            </div>
          </Field>
          <Row>
            <Field label="Status" hint="Only active offers are shown">
              <Select
                className="w-full"
                value={form.status}
                onChange={(e) => set("status", e.target.value as OfferStatus)}
              >
                {OFFER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Weight" hint="Higher shows up more often than other offers">
              <Input
                type="number"
                min={0}
                max={1000}
                step="any"
                value={form.weight}
                onChange={(e) => set("weight", e.target.value)}
              />
            </Field>
          </Row>
          <Row>
            <Field label="Starts" hint="Empty: right away">
              <Input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => set("startsAt", e.target.value)}
              />
            </Field>
            <Field label="Ends" hint="Empty: no end">
              <Input
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => set("endsAt", e.target.value)}
              />
            </Field>
          </Row>
        </Section>

        <Section title="Details, reward and limits">
          <Field label="Public details (JSON)" hint='Shown to everyone, e.g. {"discount": "20%"}'>
            <Textarea
              rows={3}
              className="font-mono text-xs"
              value={form.data}
              onChange={(e) => set("data", e.target.value)}
            />
          </Field>
          <Field label="Reward (JSON)" hint='Shown only to whoever claims it, e.g. {"code": "GATE20"}'>
            <Textarea
              rows={3}
              className="font-mono text-xs"
              value={form.reward}
              onChange={(e) => set("reward", e.target.value)}
            />
          </Field>
          <Row>
            <Field label="Max claims in total" hint="Empty: unlimited">
              <Input
                type="number"
                min={0}
                step={1}
                value={form.maxClaims}
                onChange={(e) => set("maxClaims", e.target.value)}
              />
            </Field>
            <Field label="Max claims per traveler" hint="Empty: unlimited">
              <Input
                type="number"
                min={0}
                step={1}
                value={form.maxClaimsPerUser}
                onChange={(e) => set("maxClaimsPerUser", e.target.value)}
              />
            </Field>
          </Row>
        </Section>

        {error && <Notice tone="error">{error}</Notice>}
        {canWrite && (
          <Button type="submit" className="h-10 px-5">
            {save.isPending ? "Saving…" : id ? "Save changes" : "Create offer"}
          </Button>
        )}
      </fieldset>
    </form>
  )
}

function OfferStatsPanel({ stats }: { stats: OfferStats | undefined }) {
  // One row per day with views/clicks/claims side by side, newest first.
  const days = new Map<string, { view: number; click: number; claim: number }>()
  for (const row of stats?.daily ?? []) {
    const day = days.get(row.day) ?? { view: 0, click: 0, claim: 0 }
    day[row.type] = row.count
    days.set(row.day, day)
  }

  return (
    <Panel className="h-fit p-4">
      <h2 className="font-semibold">Stats</h2>
      {!stats ? (
        <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {(["views", "clicks", "claims"] as const).map((key) => (
              <div key={key} className="rounded-lg bg-muted/60 p-2">
                <div className="text-lg font-semibold tabular-nums">{stats.totals[key]}</div>
                <div className="text-xs text-muted-foreground">{key}</div>
              </div>
            ))}
          </div>
          <h3 className="mt-4 text-xs font-medium text-muted-foreground">Last 30 days</h3>
          {days.size === 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <table className="mt-1 w-full text-xs tabular-nums">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-1 text-left font-normal">Day</th>
                  <th className="py-1 text-right font-normal">Views</th>
                  <th className="py-1 text-right font-normal">Clicks</th>
                  <th className="py-1 text-right font-normal">Claims</th>
                </tr>
              </thead>
              <tbody>
                {[...days].reverse().map(([day, counts]) => (
                  <tr key={day} className="border-t">
                    <td className="py-1">{day}</td>
                    <td className="py-1 text-right">{counts.view}</td>
                    <td className="py-1 text-right">{counts.click}</td>
                    <td className="py-1 text-right">{counts.claim}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </Panel>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel className="space-y-4 p-4 sm:p-5">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </Panel>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
