"use client"

import { useState, type ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch, type Control } from "react-hook-form"
import { z } from "zod"
import { Eye, ImagePlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  ALL_AIRPORTS,
  KIND_PRESETS,
  OFFER_STATUSES,
  type OfferPlacement,
  type PrototypeOffer,
} from "./offer-model"
import { OfferSheetPreview, PhoneFrame } from "./offer-sheet-preview"
import { useAdminDark } from "./use-admin-dark"

const IATA = /^[A-Z]{3}$/
const PRESET_KINDS: string[] = KIND_PRESETS.map((k) => k.value)

function parseCodes(text: string) {
  return [...new Set(text.split(/[\s,]+/).map((s) => s.trim().toUpperCase()).filter(Boolean))]
}

const optionalCount = z
  .string()
  .trim()
  .refine((v) => v === "" || (/^\d+$/.test(v) && Number(v) > 0), "Use a whole number above 0, or leave it empty.")

const schema = z
  .object({
    kind: z.string().trim().min(1, "Pick a type or name your own."),
    title: z.string().trim().min(3, "Give the offer a title (at least 3 characters).").max(80, "Keep the title under 80 characters."),
    body: z.string().trim().max(280, "Keep the description under 280 characters."),
    imageUrl: z.string().trim(),
    allAirports: z.boolean(),
    airportCodes: z.string(),
    placements: z.array(z.enum(["pin", "card"])).min(1, "Choose at least one place to show it."),
    status: z.enum(OFFER_STATUSES),
    startsAt: z.string(),
    endsAt: z.string(),
    ctaLabel: z.string().trim().max(24, "Keep the button label under 24 characters."),
    ctaUrl: z.union([z.literal(""), z.url("Enter a full link, starting with https://")]),
    rewardCode: z.string().trim().max(32, "Keep the code under 32 characters."),
    maxClaims: optionalCount,
    maxClaimsPerUser: optionalCount,
  })
  .superRefine((v, ctx) => {
    if (!v.allAirports) {
      const codes = parseCodes(v.airportCodes)
      if (codes.length === 0) ctx.addIssue({ code: "custom", path: ["airportCodes"], message: "Add at least one airport, or choose all airports." })
      else if (!codes.every((c) => IATA.test(c)))
        ctx.addIssue({ code: "custom", path: ["airportCodes"], message: "Use 3-letter airport codes, like SIN, ICN." })
    }
    if (v.startsAt && v.endsAt && v.endsAt < v.startsAt)
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "The end date must be on or after the start date." })
    if (v.ctaUrl && !v.ctaLabel) ctx.addIssue({ code: "custom", path: ["ctaLabel"], message: "Add a label for the button." })
  })

type FormValues = z.infer<typeof schema>

function toValues(offer: PrototypeOffer | null, today: string): FormValues {
  return {
    kind: offer?.kind ?? "voucher",
    title: offer?.title ?? "",
    body: offer?.body ?? "",
    imageUrl: offer?.imageUrl ?? "",
    allAirports: offer?.airports.includes(ALL_AIRPORTS) ?? false,
    airportCodes: offer && !offer.airports.includes(ALL_AIRPORTS) ? offer.airports.join(", ") : "",
    placements: offer?.placements ?? ["pin", "card"],
    status: offer?.status ?? "draft",
    startsAt: offer?.startsAt ?? today,
    endsAt: offer?.endsAt ?? "",
    ctaLabel: offer?.ctaLabel ?? "",
    ctaUrl: offer?.ctaUrl ?? "",
    rewardCode: offer?.rewardCode ?? "",
    maxClaims: offer?.maxClaims != null ? String(offer.maxClaims) : "",
    maxClaimsPerUser: offer?.maxClaimsPerUser != null ? String(offer.maxClaimsPerUser) : "",
  }
}

function toOffer(v: FormValues, id: string): PrototypeOffer {
  const voucher = v.kind === "voucher"
  return {
    id,
    kind: v.kind.trim(),
    title: v.title.trim(),
    body: v.body.trim(),
    imageUrl: v.imageUrl.trim(),
    ctaLabel: v.ctaLabel.trim(),
    ctaUrl: v.ctaUrl.trim(),
    airports: v.allAirports ? [ALL_AIRPORTS] : parseCodes(v.airportCodes),
    placements: v.placements,
    status: v.status,
    startsAt: v.startsAt,
    endsAt: v.endsAt,
    rewardCode: voucher ? v.rewardCode.trim() : "",
    maxClaims: voucher && v.maxClaims ? Number(v.maxClaims) : null,
    maxClaimsPerUser: voucher && v.maxClaimsPerUser ? Number(v.maxClaimsPerUser) : null,
  }
}

const FIELD =
  "h-11 rounded-[12px] border-ink/10 bg-ink/[0.03] px-3.5 text-sm text-ink placeholder:text-ink/35 md:text-sm focus-visible:border-theme/60 focus-visible:ring-4 focus-visible:ring-theme/10"
const LABEL = "text-xs font-medium text-ink/70"
const HINT = "text-xs text-ink/45"

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-3.5 text-xs font-medium ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme",
        selected ? "bg-theme/10 text-theme-ink ring-theme/30" : "text-ink/60 ring-ink/10 hover:bg-ink/5 hover:text-ink"
      )}
    >
      {children}
    </button>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-ink/[0.08] pt-6 first:border-0 first:pt-0">
      <h3 className="text-sm font-medium text-ink">{title}</h3>
      {children}
    </section>
  )
}

/** The phone preview, fed from the form's current (unsaved) values. */
function LivePreview({ control, id }: { control: Control<FormValues>; id: string }) {
  const values = useWatch({ control }) as FormValues
  const offer = toOffer(values, id)
  const airport = offer.airports[0] === ALL_AIRPORTS || !offer.airports[0] ? "SIN" : offer.airports[0]
  return (
    <PhoneFrame map>
      <div className="flex h-full flex-col justify-end">
        <OfferSheetPreview key={`${offer.rewardCode}|${offer.kind}`} offer={offer} airport={airport} />
      </div>
    </PhoneFrame>
  )
}

export function OfferFormSheet({
  open,
  onOpenChange,
  offer,
  today,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The offer being edited, or null for a new one. */
  offer: PrototypeOffer | null
  today: string
  onSave: (offer: PrototypeOffer) => void
}) {
  const dark = useAdminDark()
  const [id] = useState(() => offer?.id ?? `local-${Math.random().toString(36).slice(2, 9)}`)
  const [showPreview, setShowPreview] = useState(false)
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: toValues(offer, today), mode: "onTouched" })
  const kind = useWatch({ control: form.control, name: "kind" })
  const allAirports = useWatch({ control: form.control, name: "allAirports" })
  const [customKind, setCustomKind] = useState(() => !PRESET_KINDS.includes(kind))

  function onSubmit(values: FormValues) {
    onSave(toOffer(values, id))
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className={cn(
          "gap-0 border-ink/10 bg-panel p-0 text-sm text-ink data-[side=right]:w-full data-[side=right]:sm:max-w-[min(62rem,100vw)]",
          dark && "dark"
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink/[0.08] px-5 py-4 md:px-7">
          <div>
            <SheetTitle className="text-lg font-medium tracking-[-0.02em] text-ink">{offer ? "Edit offer" : "New offer"}</SheetTitle>
            <SheetDescription className="mt-1 text-xs text-ink/45">
              Prototype form. Saving updates the list in this tab only.
            </SheetDescription>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              aria-pressed={showPreview}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-ink/70 ring-1 ring-ink/10 lg:hidden"
            >
              <Eye strokeWidth={1.5} className="size-4" aria-hidden />
              Preview
            </button>
            <SheetClose
              aria-label="Close"
              className="grid size-9 place-items-center rounded-full text-ink/60 ring-1 ring-ink/10 hover:bg-ink/5 hover:text-ink"
            >
              <X strokeWidth={1.5} className="size-4" />
            </SheetClose>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_320px]">
              {showPreview && (
                <div className="border-b border-ink/[0.08] bg-ink/[0.02] px-5 py-6 lg:hidden">
                  <div className="mx-auto w-[260px]">
                    <LivePreview control={form.control} id={id} />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-7 px-5 py-6 md:px-7">
                <Section title="Content">
                  <FormField
                    control={form.control}
                    name="kind"
                    render={({ field }) => (
                      <FormItem className="gap-2">
                        <FormLabel className={LABEL}>Type</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {KIND_PRESETS.map((preset) => (
                            <Chip
                              key={preset.value}
                              selected={!customKind && field.value === preset.value}
                              onClick={() => {
                                setCustomKind(false)
                                field.onChange(preset.value)
                              }}
                            >
                              {preset.label}
                            </Chip>
                          ))}
                          <Chip
                            selected={customKind}
                            onClick={() => {
                              setCustomKind(true)
                              field.onChange("")
                            }}
                          >
                            Other
                          </Chip>
                        </div>
                        {customKind && (
                          <FormControl>
                            <Input {...field} placeholder="e.g. spa_discount" aria-label="Custom type" className={FIELD} />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="gap-2">
                        <FormLabel className={LABEL}>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="15% off coffee at the Terminal 3 café" className={FIELD} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem className="gap-2">
                        <FormLabel className={LABEL}>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="What travelers get, and how to use it." className={cn(FIELD, "h-auto min-h-24 py-3")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem className="gap-2">
                        <FormLabel className={LABEL}>Image</FormLabel>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-xs font-medium text-ink/75 ring-1 ring-ink/10 hover:bg-ink/5 focus-within:outline-2 focus-within:outline-theme">
                            <ImagePlus strokeWidth={1.5} className="size-4" aria-hidden />
                            Choose image
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                // Local preview only: the file never leaves the browser.
                                if (file) field.onChange(URL.createObjectURL(file))
                              }}
                            />
                          </label>
                          <span className={HINT}>or paste a link</span>
                        </div>
                        <FormControl>
                          <Input
                            value={field.value.startsWith("blob:") ? "" : field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder={field.value.startsWith("blob:") ? "Using the image you chose" : "https://"}
                            aria-label="Image link"
                            className={FIELD}
                          />
                        </FormControl>
                        <p className={HINT}>Shown at 16:9 in the app.</p>
                      </FormItem>
                    )}
                  />
                </Section>

                <Section title="Where and when">
                  <FormField
                    control={form.control}
                    name="airportCodes"
                    render={({ field }) => (
                      <FormItem className="gap-2">
                        <FormLabel className={LABEL}>Airports</FormLabel>
                        <label className="flex items-center gap-2.5 text-sm text-ink/80">
                          <input
                            type="checkbox"
                            checked={allAirports}
                            onChange={(e) => form.setValue("allAirports", e.target.checked, { shouldValidate: true })}
                            className="size-4 accent-(--theme-color)"
                          />
                          All airports
                        </label>
                        {!allAirports && (
                          <>
                            <FormControl>
                              <Input {...field} placeholder="SIN, ICN" className={cn(FIELD, "uppercase placeholder:normal-case")} />
                            </FormControl>
                            <FormMessage />
                          </>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="placements"
                    render={({ field }) => (
                      <FormItem className="gap-2">
                        <FormLabel className={LABEL}>Show as</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {(
                            [
                              ["pin", "Map pin"],
                              ["card", "Card"],
                            ] as [OfferPlacement, string][]
                          ).map(([value, label]) => (
                            <Chip
                              key={value}
                              selected={field.value.includes(value)}
                              onClick={() =>
                                field.onChange(
                                  field.value.includes(value) ? field.value.filter((p) => p !== value) : [...field.value, value]
                                )
                              }
                            >
                              {label}
                            </Chip>
                          ))}
                        </div>
                        <p className={HINT}>A pin sits inside the airport circle on the map. A card shows in the airport sheet.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(["startsAt", "endsAt"] as const).map((name) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem className="gap-2">
                            <FormLabel className={LABEL}>{name === "startsAt" ? "Starts" : "Ends"}</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} className={cn(FIELD, "dark:[color-scheme:dark]")} />
                            </FormControl>
                            {name === "endsAt" && <p className={HINT}>Leave empty to keep it running.</p>}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="gap-2">
                        <FormLabel className={LABEL}>Status</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {OFFER_STATUSES.map((s) => (
                            <Chip key={s} selected={field.value === s} onClick={() => field.onChange(s)}>
                              {s[0].toUpperCase() + s.slice(1)}
                            </Chip>
                          ))}
                        </div>
                        <p className={HINT}>Active offers go live between the start and end dates. Before the start they show as Scheduled.</p>
                      </FormItem>
                    )}
                  />
                </Section>

                <Section title="Button">
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                    <FormField
                      control={form.control}
                      name="ctaLabel"
                      render={({ field }) => (
                        <FormItem className="gap-2">
                          <FormLabel className={LABEL}>Label</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="See lounge hours" className={FIELD} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ctaUrl"
                      render={({ field }) => (
                        <FormItem className="gap-2">
                          <FormLabel className={LABEL}>Link</FormLabel>
                          <FormControl>
                            <Input {...field} type="url" placeholder="https://" className={FIELD} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className={HINT}>Optional. Leave both empty for no button.</p>
                </Section>

                {kind === "voucher" && (
                  <Section title="Voucher">
                    <FormField
                      control={form.control}
                      name="rewardCode"
                      render={({ field }) => (
                        <FormItem className="gap-2">
                          <FormLabel className={LABEL}>Code</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="T3COFFEE15" className={cn(FIELD, "uppercase placeholder:normal-case")} />
                          </FormControl>
                          <p className={HINT}>Only shown to travelers after they tap Claim.</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(
                        [
                          ["maxClaims", "Total claims"],
                          ["maxClaimsPerUser", "Claims per traveler"],
                        ] as const
                      ).map(([name, label]) => (
                        <FormField
                          key={name}
                          control={form.control}
                          name={name}
                          render={({ field }) => (
                            <FormItem className="gap-2">
                              <FormLabel className={LABEL}>{label}</FormLabel>
                              <FormControl>
                                <Input {...field} inputMode="numeric" placeholder="No limit" className={FIELD} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </Section>
                )}
              </div>

              <aside aria-label="Preview" className="hidden border-l border-ink/[0.08] bg-ink/[0.02] px-6 py-6 lg:block">
                <div className="sticky top-0 flex flex-col gap-3">
                  <p className="text-xs font-medium text-ink/55">How it looks in the app</p>
                  <LivePreview control={form.control} id={id} />
                </div>
              </aside>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-ink/[0.08] px-5 py-4 md:px-7">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-10 rounded-full px-5 text-sm text-ink/70 hover:bg-ink/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 rounded-full bg-theme px-6 text-sm font-semibold text-black hover:bg-theme/90 active:scale-[0.98]"
              >
                {offer ? "Save changes" : "Add offer"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
