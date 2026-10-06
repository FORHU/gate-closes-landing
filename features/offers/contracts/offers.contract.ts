import { z } from "zod"

/** Offers as gate-closes-api returns them (`/admin/offers`). */

export const OFFER_STATUSES = ["draft", "active", "paused", "ended"] as const
export const OfferStatusSchema = z.enum(OFFER_STATUSES)
export type OfferStatus = z.infer<typeof OfferStatusSchema>

export const OfferPlacementSchema = z.enum(["pin", "card"])
export type OfferPlacement = z.infer<typeof OfferPlacementSchema>

const StatsSchema = z.object({
  views: z.number(),
  clicks: z.number(),
  claims: z.number(),
})

export const OfferSchema = z.object({
  _id: z.string(),
  kind: z.string(),
  title: z.string(),
  body: z.string().nullish(),
  imageUrl: z.string().nullish(),
  ctaLabel: z.string().nullish(),
  ctaUrl: z.string().nullish(),
  airports: z.array(z.string()),
  placements: z.array(OfferPlacementSchema),
  status: OfferStatusSchema,
  startsAt: z.string().nullish(),
  endsAt: z.string().nullish(),
  weight: z.number(),
  data: z.record(z.string(), z.unknown()).default({}),
  reward: z.record(z.string(), z.unknown()).default({}),
  limits: z
    .object({
      maxClaims: z.number().nullish(),
      maxClaimsPerUser: z.number().nullish(),
    })
    .default({}),
  stats: StatsSchema.default({ views: 0, clicks: 0, claims: 0 }),
  createdAt: z.string(),
  updatedAt: z.string().nullish(),
})
export type Offer = z.infer<typeof OfferSchema>

export const OffersResponseSchema = z.array(OfferSchema)

export const OfferStatsSchema = z.object({
  totals: StatsSchema,
  daily: z.array(
    z.object({
      day: z.string(),
      type: z.enum(["view", "click", "claim"]),
      count: z.number(),
    })
  ),
})
export type OfferStats = z.infer<typeof OfferStatsSchema>

/** Body of POST /admin/offers and PATCH /admin/offers/:id. */
export type OfferInput = {
  kind: string
  title: string
  body: string | null
  imageUrl: string | null
  ctaLabel: string | null
  ctaUrl: string | null
  airports: string[]
  placements: OfferPlacement[]
  status: OfferStatus
  startsAt: string | null
  endsAt: string | null
  weight: number
  data: Record<string, unknown>
  reward: Record<string, unknown>
  limits: { maxClaims: number | null; maxClaimsPerUser: number | null }
}
