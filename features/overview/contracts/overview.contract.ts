import { z } from "zod"

/** `GET /admin/overview`: echoes in the last 24 hours per airport, sign-ups this week. */
export const OverviewSchema = z.object({
  echoes: z.object({
    since: z.string(),
    total: z.number(),
    /** Busiest first. */
    airports: z.array(
      z.object({
        airportIata: z.string(),
        airportName: z.string().nullable(),
        count: z.number(),
        latestAt: z.string().nullable(),
      })
    ),
  }),
  signups: z.object({ last7d: z.number(), prev7d: z.number() }),
})
export type Overview = z.infer<typeof OverviewSchema>

/** One dependency check; `detail` is e.g. the PostGIS version, or why it failed. */
const CheckSchema = z.object({
  status: z.enum(["up", "down"]),
  latencyMs: z.number(),
  detail: z.string().optional(),
})

/**
 * `GET /admin/system/readiness`: the API's `/readiness` checks plus the
 * socket adapter. "degraded" means only storage (uploads, playback) is down.
 */
export const ReadinessSchema = z.object({
  status: z.enum(["ready", "degraded", "unhealthy"]),
  uptime: z.number(),
  checks: z.object({
    database: CheckSchema,
    postgis: CheckSchema,
    redis: CheckSchema,
    storage: CheckSchema,
  }),
  socketAdapter: z.enum(["redis", "in-memory"]),
  timestamp: z.string(),
})
export type Readiness = z.infer<typeof ReadinessSchema>
