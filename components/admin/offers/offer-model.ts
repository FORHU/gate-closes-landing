// Prototype-only shape of an offer. It mirrors the API's TOffer
// (gate-closes-api/src/models/offer.model.ts) so wiring this screen to
// /api/admin/offers later is a field-for-field swap:
//   rewardCode       -> reward.code
//   maxClaims        -> limits.maxClaims
//   maxClaimsPerUser -> limits.maxClaimsPerUser
//   startsAt/endsAt  -> Date (here: "YYYY-MM-DD" strings, local day)
// Fields the API has but this draft leaves out: weight, data, stats.

export const OFFER_STATUSES = ["draft", "active", "paused", "ended"] as const
export type OfferStatus = (typeof OFFER_STATUSES)[number]

export const OFFER_PLACEMENTS = ["pin", "card"] as const
export type OfferPlacement = (typeof OFFER_PLACEMENTS)[number]

/** Every airport, instead of a list of codes (same sentinel as the API). */
export const ALL_AIRPORTS = "*"

export type PrototypeOffer = {
  id: string
  kind: string
  title: string
  body: string
  /** A remote URL, or a blob: URL for an image picked in this tab. */
  imageUrl: string
  ctaLabel: string
  ctaUrl: string
  /** Uppercase IATA codes, or ["*"] for every airport. */
  airports: string[]
  placements: OfferPlacement[]
  status: OfferStatus
  startsAt: string
  endsAt: string
  rewardCode: string
  maxClaims: number | null
  maxClaimsPerUser: number | null
}

/** Suggested kinds. `kind` stays free text, like the API, so admins can type their own. */
export const KIND_PRESETS = [
  { value: "voucher", label: "Voucher" },
  { value: "lounge_pass", label: "Lounge pass" },
  { value: "announcement", label: "Announcement" },
  { value: "advertisement", label: "Advertisement" },
] as const

/** "voucher" -> "Voucher", "lounge_pass" -> "Lounge pass". Port of OfferSheet.kindLabel in the app. */
export function kindLabel(kind: string) {
  const words = kind.replace(/[_-]+/g, " ").trim()
  if (!words) return "Offer"
  return words[0].toUpperCase() + words.slice(1)
}

/**
 * What an admin (or traveler) sees: the stored status plus the date window.
 * Only "active" offers inside their window are live in the app.
 */
export type DisplayStatus = "live" | "scheduled" | "expired" | "draft" | "paused" | "ended"

export function displayStatus(offer: Pick<PrototypeOffer, "status" | "startsAt" | "endsAt">, today: string): DisplayStatus {
  if (offer.status !== "active") return offer.status
  if (offer.startsAt && offer.startsAt > today) return "scheduled"
  if (offer.endsAt && offer.endsAt < today) return "expired"
  return "live"
}

export const STATUS_META: Record<DisplayStatus, { label: string; className: string }> = {
  live: { label: "Live", className: "border-theme/30 bg-theme/10 text-theme-ink" },
  scheduled: { label: "Scheduled", className: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  draft: { label: "Draft", className: "border-ink/10 bg-ink/[0.03] text-ink/60" },
  paused: { label: "Paused", className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  expired: { label: "Expired", className: "border-ink/10 bg-ink/[0.03] text-ink/40" },
  ended: { label: "Ended", className: "border-ink/10 bg-ink/[0.03] text-ink/40" },
}

/** "2026-10-24" -> "Oct 24". Parsed as a local day so it never shifts by timezone. */
export function formatDay(iso: string) {
  if (!iso) return ""
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(y, m - 1, d + days)
  return toISODay(date)
}

export function toISODay(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function airportsLabel(airports: string[]) {
  return airports.includes(ALL_AIRPORTS) ? "All airports" : airports.join(", ")
}

/** A traveler at `airport` sees offers targeted at it or at every airport. */
export function servesAirport(offer: PrototypeOffer, airport: string) {
  return offer.airports.includes(ALL_AIRPORTS) || offer.airports.includes(airport)
}
