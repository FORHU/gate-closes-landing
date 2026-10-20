import { useSafeMutation } from "@/shared/query/useSafeMutation"
import { login } from "../api/auth.client"
import type { LoginInput } from "../contracts/auth.contract"

export function useLogin() {
  // Wrong credentials are shown under the form, not as "session ended".
  return useSafeMutation<void, LoginInput>({ mutationFn: login, meta: { localErrors: true } })
}
