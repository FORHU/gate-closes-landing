import { fetcher } from "@/shared/lib/http"
import { AdminAirportSchema, AdminAirportsResponseSchema } from "../contracts/airports.contract"

export async function getAirports(q: string) {
  const query = new URLSearchParams({ q, limit: "50" })
  return AdminAirportsResponseSchema.parse(await fetcher(`/admin/airports?${query}`))
}

/** A radius in km, or `null` to go back to the default for the airport's type. */
export async function setAirportRadius(id: string, radiusKm: number | null) {
  const data = await fetcher<Record<string, unknown>>(`/admin/airports/${id}/radius`, {
    method: "PATCH",
    body: { radiusKm },
  })
  return AdminAirportSchema.partial().parse(data)
}
