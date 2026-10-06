import { fetcher } from "@/shared/lib/http"
import { MeSchema, type LoginInput } from "../contracts/auth.contract"

export async function getMe() {
  return MeSchema.parse(await fetcher("/auth/me"))
}

/** Sets the session cookies (web client); the response body isn't needed. */
export async function login(input: LoginInput) {
  await fetcher("/auth/login", { method: "POST", body: input })
}

export async function logout() {
  await fetcher("/auth/logout", { method: "POST" }).catch(() => undefined)
}
