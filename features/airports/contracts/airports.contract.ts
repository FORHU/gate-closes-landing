import { z } from "zod"

/** One airport of `GET /admin/airports`, with its radius. */
export const AdminAirportSchema = z.object({
  id: z.string(),
  iata: z.string().nullish(),
  icao: z.string().nullish(),
  airport: z.string().nullish(),
  countryCode: z.string().nullish(),
  type: z.string().nullish(),
  radiusKm: z.number().nullish(),
  /** Set by an admin; imports and the airport cleanup keep it. */
  radiusManual: z.boolean(),
  /** What "Reset" goes back to: the size for its type. */
  defaultRadiusKm: z.number().nullable(),
  /** Set by an admin: `true` always on the map, `false` never, null/absent = auto. */
  showOnMap: z.boolean().nullish(),
  /** On the map automatically: large, or with echoes or a live offer. */
  busy: z.boolean().optional(),
  /** The airport's centre ([lng, lat]): its terminal once known, else the dataset's point. */
  location: z.object({ coordinates: z.tuple([z.number(), z.number()]) }).nullish(),
  /** Where `location` comes from: "osm", "admin", or null/absent = the dataset's point. */
  locationSource: z.enum(["osm", "admin"]).nullish(),
})
export type AdminAirport = z.infer<typeof AdminAirportSchema>

/** `GET /admin/airports`: one page of airports plus totals. */
export const AdminAirportsPageSchema = z.object({
  data: z.array(AdminAirportSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})
export type AdminAirportsPage = z.infer<typeof AdminAirportsPageSchema>

/** Where an airport's centre comes from; "runway" = the dataset's point. */
export type TerminalSourceFilter = "osm" | "admin" | "runway"
/** The airport's map setting: auto (busy rule), always shown, never shown. */
export type MapSettingFilter = "auto" | "show" | "hide"

/** Search, filters and page of the admin airport list. */
export type AirportsFilter = {
  q: string
  country?: string
  source?: TerminalSourceFilter
  map?: MapSettingFilter
  page: number
}

/** Airports per page. */
export const AIRPORTS_PAGE_SIZE = 50

/**
 * "lat, lng" as copied from Google Maps (e.g. "16.375738, 120.613162"),
 * or null when it isn't one.
 */
export function parseLatLng(text: string): { lat: number; lng: number } | null {
  const match = text.trim().match(/^(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)$/)
  if (!match) return null
  const lat = Number(match[1])
  const lng = Number(match[2])
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
  return { lat, lng }
}

/** Matches the API's limits (admin.airport.controller.ts). */
export const RADIUS_LIMITS_KM = { min: 0.5, max: 30 } as const
