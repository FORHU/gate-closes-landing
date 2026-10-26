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

/**
 * Centres the airport on its terminal (circle, "at the airport" check,
 * offer spots), or `null` to go back to the dataset's point.
 */
export async function setAirportTerminal(id: string, terminal: { lat: number; lng: number } | null) {
  const data = await fetcher<Record<string, unknown>>(`/admin/airports/${id}/terminal`, {
    method: "PATCH",
    body: { terminal },
  })
  return AdminAirportSchema.partial().parse(data)
}

/** `true` always shows the airport on the map, `false` hides it, `null` = auto. */
export async function setAirportMapVisibility(id: string, showOnMap: boolean | null) {
  const data = await fetcher<Record<string, unknown>>(`/admin/airports/${id}/map`, {
    method: "PATCH",
    body: { showOnMap },
  })
  return AdminAirportSchema.partial().parse(data)
}
