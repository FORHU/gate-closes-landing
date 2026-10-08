import "server-only"

type ApiFetchOptions = {
  method?: "GET" | "POST"
  body?: unknown
  token?: string
}

/**
 * Server-side call to gate-closes-api. The browser never talks to the API
 * directly for the admin area; tokens stay in httpOnly cookies on this site.
 */
export async function apiFetch(path: string, { method = "GET", body, token }: ApiFetchOptions = {}) {
  const baseUrl = process.env.API_URL
  if (!baseUrl) throw new Error("API_URL is not set")

  const headers: Record<string, string> = { Accept: "application/json" }
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (token) headers.Authorization = `Bearer ${token}`

  return fetch(`${baseUrl.replace(/\/+$/, "")}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  })
}
