"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { apiFetch } from "@/lib/admin/api"
import { AIRPORTS_PERMISSION, requireAdmin } from "@/lib/admin/dal"

// Server Functions are reachable by direct POST, so each one checks the
// session and the permission again; the API checks both as well.

const PATH = "/admin/airports"

type Fail = { ok: false; error: string }

async function token(): Promise<string | Fail> {
  const admin = await requireAdmin()
  if (!admin.permissions.includes(AIRPORTS_PERMISSION)) {
    return { ok: false, error: "Your role can't manage airports." }
  }
  return admin.accessToken
}

async function readError(res: Response, fallback: string) {
  try {
    const body = (await res.json()) as { message?: string }
    return body.message || fallback
  } catch {
    return fallback
  }
}

const radiusInput = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i),
  radiusKm: z.number().min(0.5).max(30).nullable(),
})

/** Sets one airport's radius in km, or `null` to go back to its type's default. */
export async function setAirportRadius(id: string, radiusKm: number | null): Promise<{ ok: true; radiusKm: number } | Fail> {
  const parsed = radiusInput.safeParse({ id, radiusKm })
  if (!parsed.success) return { ok: false, error: "Enter a radius between 0.5 and 30 km." }
  const auth = await token()
  if (typeof auth !== "string") return auth

  try {
    const res = await apiFetch(`/api/admin/airports/${parsed.data.id}/radius`, {
      method: "PATCH",
      body: { radiusKm: parsed.data.radiusKm },
      token: auth,
    })
    if (!res.ok) return { ok: false, error: await readError(res, `Couldn't save (HTTP ${res.status}).`) }
    const { data } = (await res.json()) as { data: { radiusKm: number } }
    revalidatePath(PATH)
    return { ok: true, radiusKm: data.radiusKm }
  } catch {
    return { ok: false, error: "Can't reach the server." }
  }
}

export type CrawlResult = {
  insertedCount: number
  skippedAlreadyStored: number
  skippedOutOfScope: number
  skippedNoBoundary: number
}

/** Adds missing airline airports from the API's bundled file. Never overwrites. */
export async function runAirportCrawl(): Promise<{ ok: true; result: CrawlResult } | Fail> {
  const auth = await token()
  if (typeof auth !== "string") return auth
  try {
    const res = await apiFetch("/api/airport/crawl", { method: "POST", body: {}, token: auth })
    if (!res.ok) return { ok: false, error: await readError(res, `Import failed (HTTP ${res.status}).`) }
    const { data } = (await res.json()) as { data: CrawlResult }
    revalidatePath(PATH)
    return { ok: true, result: data }
  } catch {
    return { ok: false, error: "Can't reach the server." }
  }
}

export type SyncResult = { updatedCount: number; skippedCount: number; total: number }

/** Redraws airport circles from their radius; `force` redraws ones that already have one. */
export async function syncAirportBoundaries(force: boolean): Promise<{ ok: true; result: SyncResult } | Fail> {
  const auth = await token()
  if (typeof auth !== "string") return auth
  try {
    const res = await apiFetch("/api/airport/boundary/sync", {
      method: "POST",
      body: { force: force === true },
      token: auth,
    })
    if (!res.ok) return { ok: false, error: await readError(res, `Redraw failed (HTTP ${res.status}).`) }
    const { data } = (await res.json()) as { data: SyncResult }
    revalidatePath(PATH)
    return { ok: true, result: data }
  } catch {
    return { ok: false, error: "Can't reach the server." }
  }
}
