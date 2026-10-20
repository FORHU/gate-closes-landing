import { fetcher } from "@/shared/lib/http"
import { OverviewSchema, ReadinessSchema } from "../contracts/overview.contract"

export async function getOverview() {
  return OverviewSchema.parse(await fetcher("/admin/overview"))
}

export async function getReadiness() {
  return ReadinessSchema.parse(await fetcher("/admin/system/readiness"))
}
