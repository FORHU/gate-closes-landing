import { fetcher } from "@/shared/lib/http"
import { MeSchema, type LoginInput } from "../contracts/auth.contract"

export async function getMe() {
  return MeSchema.parse(await fetcher("/auth/me"))
}

/** Better Auth sets the session cookie; the response body isn't needed. */
export async function login(input: LoginInput) {
  await fetcher("/auth/sign-in/email", { method: "POST", body: input })
}

export async function logout() {
  await fetcher("/auth/sign-out", { method: "POST", body: {} }).catch(() => undefined)
}
