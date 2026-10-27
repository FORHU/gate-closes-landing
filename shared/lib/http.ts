import { ApiError, categorize } from "@/shared/errors/api-error"

/**
 * Client for gate-closes-api-v2, through this site's /backend/* rewrite
 * (next.config.ts). Better Auth keeps the session in an httpOnly cookie on
 * this domain: no token is ever readable by JavaScript (unlike a
 * localStorage token, it can't be stolen by XSS). Sessions slide on the
 * server and there is no refresh: a 401 means the session is over.
 */

const HEADERS = { "content-type": "application/json" }

async function send(path: string, init: RequestInit) {
  try {
    return await fetch(`/backend${path}`, { ...init, headers: { ...HEADERS, ...init.headers } })
  } catch {
    throw new ApiError("Can't reach the server.", "NETWORK")
  }
}

/** Calls the API and returns its payload (`data` unwrapped when present). */
export async function fetcher<T = unknown>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown } = {}
): Promise<T> {
  const payload = await fetchPayload(path, init)
  const unwrapped = payload && typeof payload === "object" && "data" in payload
  return (unwrapped ? (payload as { data: unknown }).data : payload) as T
}

/**
 * Like `fetcher`, but returns the whole payload: for pages, whose
 * `pagination` sits next to `data`.
 */
export async function fetchPayload(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown } = {}
): Promise<unknown> {
  const request: RequestInit = {
    ...init,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  }
  const res = await send(path, request)
  if (res.status === 204) return undefined

  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(
      payload?.message ?? `Request failed (${res.status}).`,
      categorize(res.status),
      res.status
    )
  }
  return payload
}
