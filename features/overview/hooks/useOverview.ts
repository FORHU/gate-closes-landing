import { useSafeQuery } from "@/shared/query/useSafeQuery"
import { getOverview, getReadiness } from "../api/overview.client"
import { overviewKeys } from "../api/overview.keys"

export function useOverview() {
  return useSafeQuery({ queryKey: overviewKeys.summary(), queryFn: getOverview })
}

/** Polled, so a dependency going down shows up without a reload. */
export function useReadiness() {
  return useSafeQuery({
    queryKey: overviewKeys.readiness(),
    queryFn: getReadiness,
    refetchInterval: 30_000,
    staleTime: 0,
  })
}
