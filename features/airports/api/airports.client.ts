import { fetchPayload, fetcher } from "@/shared/lib/http"
import {
  AIRPORTS_PAGE_SIZE,
  AdminAirportSchema,
  AdminAirportsPageSchema,
  type AirportsFilter,
} from "../contracts/airports.contract"

/** One page of airports matching the search and filters, with totals. */
export async function getAirports(filter: AirportsFilter) {
  const query = new URLSearchParams({
    q: filter.q,
    page: String(filter.page),
    limit: String(AIRPORTS_PAGE_SIZE),
  })
  if (filter.country) query.set("country", filter.country)
  if (filter.source) query.set("source", filter.source)
  if (filter.map) query.set("map", filter.map)
  return AdminAirportsPageSchema.parse(await fetchPayload(`/admin/airports?${query}`))
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
