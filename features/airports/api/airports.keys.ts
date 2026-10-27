import type { AirportsFilter } from "../contracts/airports.contract"

export const airportsKeys = {
  all: ["airports"] as const,
  lists: () => [...airportsKeys.all, "list"] as const,
  list: (filter: AirportsFilter) => [...airportsKeys.lists(), filter] as const,
}
