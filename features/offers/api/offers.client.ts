import { fetcher } from "@/shared/lib/http"
import {
  OfferSchema,
  OfferStatsSchema,
  OffersResponseSchema,
  type OfferInput,
  type OfferStatus,
} from "../contracts/offers.contract"

export async function getOffers(status?: OfferStatus) {
  const query = status ? `?status=${status}` : ""
  return OffersResponseSchema.parse(await fetcher(`/admin/offers${query}`))
}

export async function getOffer(id: string) {
  return OfferSchema.parse(await fetcher(`/admin/offers/${id}`))
}

export async function getOfferStats(id: string) {
  return OfferStatsSchema.parse(await fetcher(`/admin/offers/${id}/stats`))
}

export async function createOffer(input: OfferInput) {
  return OfferSchema.parse(await fetcher("/admin/offers", { method: "POST", body: input }))
}

export async function updateOffer(id: string, input: OfferInput) {
  return OfferSchema.parse(
    await fetcher(`/admin/offers/${id}`, { method: "PATCH", body: input })
  )
}

export async function deleteOffer(id: string) {
  await fetcher(`/admin/offers/${id}`, { method: "DELETE" })
}
