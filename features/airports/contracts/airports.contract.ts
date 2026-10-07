import { z } from "zod"

/** `GET /admin/airports`: airports by code or name, with their radius. */
export const AdminAirportSchema = z.object({
  _id: z.string(),
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
})
export type AdminAirport = z.infer<typeof AdminAirportSchema>

export const AdminAirportsResponseSchema = z.array(AdminAirportSchema)

/** Matches the API's limits (admin.airport.controller.ts). */
export const RADIUS_LIMITS_KM = { min: 0.5, max: 30 } as const
