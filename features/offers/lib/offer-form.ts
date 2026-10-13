import type {
  Offer,
  OfferInput,
  OfferPlacement,
  OfferStatus,
} from "../contracts/offers.contract"

/** The offer form's text-only state; turned into the API's shape on save. */
export type OfferFormState = {
  kind: string
  title: string
  body: string
  imageUrl: string
  ctaLabel: string
  ctaUrl: string
  airports: string
  placements: OfferPlacement[]
  status: OfferStatus
  startsAt: string
  endsAt: string
  weight: string
  data: string
  reward: string
  maxClaims: string
  maxClaimsPerUser: string
}

export const EMPTY_OFFER_FORM: OfferFormState = {
  kind: "ad",
  title: "",
  body: "",
  imageUrl: "",
  ctaLabel: "",
  ctaUrl: "",
  airports: "",
  placements: ["pin", "card"],
  status: "draft",
  startsAt: "",
  endsAt: "",
  weight: "1",
  data: "{}",
  reward: "{}",
  maxClaims: "",
  maxClaimsPerUser: "",
}

/** ISO date → value for <input type="datetime-local"> (local time). */
function toLocalInput(iso: string | null | undefined) {
  if (!iso) return ""
  const date = new Date(iso)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

export function offerToForm(offer: Offer): OfferFormState {
  return {
    kind: offer.kind,
    title: offer.title,
    body: offer.body ?? "",
    imageUrl: offer.imageUrl ?? "",
    ctaLabel: offer.ctaLabel ?? "",
    ctaUrl: offer.ctaUrl ?? "",
    airports: offer.airports.join(", "),
    placements: offer.placements,
    status: offer.status,
    startsAt: toLocalInput(offer.startsAt),
    endsAt: toLocalInput(offer.endsAt),
    weight: String(offer.weight),
    data: JSON.stringify(offer.data, null, 2),
    reward: JSON.stringify(offer.reward, null, 2),
    maxClaims: offer.limits.maxClaims?.toString() ?? "",
    maxClaimsPerUser: offer.limits.maxClaimsPerUser?.toString() ?? "",
  }
}

/** Form → API body. Throws a readable message for input the API would refuse. */
export function formToOfferInput(form: OfferFormState): OfferInput {
  const parseJson = (label: string, text: string) => {
    try {
      const value = JSON.parse(text || "{}")
      if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error()
      return value as Record<string, unknown>
    } catch {
      throw new Error(`${label} must be a JSON object, like {"code": "GATE20"}.`)
    }
  }
  const optionalInt = (text: string) => (text.trim() === "" ? null : Number(text))
  const airports = form.airports
    .split(/[\s,]+/)
    .map((a) => a.trim().toUpperCase())
    .filter(Boolean)
  if (airports.length === 0) throw new Error('Add at least one airport code, or "*" for all.')
  if (form.placements.length === 0) throw new Error("Pick at least one placement.")

  return {
    kind: form.kind.trim().toLowerCase(),
    title: form.title.trim(),
    body: form.body.trim() || null,
    imageUrl: form.imageUrl.trim() || null,
    ctaLabel: form.ctaLabel.trim() || null,
    ctaUrl: form.ctaUrl.trim() || null,
    airports,
    placements: form.placements,
    status: form.status,
    startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
    endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
    weight: Number(form.weight || 1),
    data: parseJson("Public details", form.data),
    reward: parseJson("Reward", form.reward),
    limits: {
      maxClaims: optionalInt(form.maxClaims),
      maxClaimsPerUser: optionalInt(form.maxClaimsPerUser),
    },
  }
}
