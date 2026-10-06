import { ApiError, categorize } from "@/shared/errors/api-error"

/**
 * Client for gate-closes-api, through this site's /backend/* rewrite
 * (next.config.ts). Logs in as a web client, so the API keeps the session
 * in httpOnly cookies on this domain: no token is ever readable by
 * JavaScript (unlike a localStorage token, it can't be stolen by XSS).
 */

const HEADERS = { "content-type": "application/json", "x-client-type": "web" }

/**
 * One refresh at a time, shared by every request that hit an expired
 * session: the API treats a refresh token used twice as stolen and ends
 * the whole session.
 */
let refreshing: Promise<boolean> | null = null
function refreshSession() {
  refreshing ??= fetch("/backend/auth/refresh", { method: "POST", headers: HEADERS })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

async function send(path: string, init: RequestInit) {
  try {
    return await fetch(`/backend${path}`, { ...init, headers: { ...HEADERS, ...init.headers } })
  } catch {
    throw new ApiError("Can't reach the server.", "NETWORK")
  }
}

/**
 * Calls the API and returns its payload (`data` unwrapped when present).
 * On an expired session it refreshes once and retries.
 */
export async function fetcher<T = unknown>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown } = {}
): Promise<T> {
  const request: RequestInit = {
    ...init,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  }
  let res = await send(path, request)
  if (res.status === 401 && !path.startsWith("/auth/")) {
    if (await refreshSession()) res = await send(path, request)
  }
  if (res.status === 204) return undefined as T

  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(
      payload?.message ?? `Request failed (${res.status}).`,
      categorize(res.status),
      res.status
    )
  }
  const unwrapped = payload && typeof payload === "object" && "data" in payload
  return (unwrapped ? payload.data : payload) as T
}
