import { z } from "zod"

/** `GET /admin/airports`: airports by code or name, with their radius. */
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

export const AdminAirportsResponseSchema = z.array(AdminAirportSchema)

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
