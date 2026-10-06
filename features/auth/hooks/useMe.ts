import { useSafeQuery } from "@/shared/query/useSafeQuery"
import { getMe } from "../api/auth.client"
import { authKeys } from "../api/auth.keys"

export function useMe() {
  return useSafeQuery({ queryKey: authKeys.me(), queryFn: getMe, staleTime: 5 * 60_000 })
}
