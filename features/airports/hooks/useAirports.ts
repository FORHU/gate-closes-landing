import { useQueryClient } from "@tanstack/react-query"
import { useSafeMutation } from "@/shared/query/useSafeMutation"
import { useSafeQuery } from "@/shared/query/useSafeQuery"
import { getAirports, setAirportMapVisibility, setAirportRadius } from "../api/airports.client"
import { airportsKeys } from "../api/airports.keys"

export function useAirports(q: string) {
  return useSafeQuery({
    queryKey: airportsKeys.list(q),
    queryFn: () => getAirports(q),
    placeholderData: (previous) => previous,
  })
}

export function useSetAirportRadius() {
  const client = useQueryClient()
  return useSafeMutation<unknown, { id: string; radiusKm: number | null }>({
    mutationFn: ({ id, radiusKm }) => setAirportRadius(id, radiusKm),
    onSuccess: () => client.invalidateQueries({ queryKey: airportsKeys.lists() }),
  })
}

export function useSetAirportMapVisibility() {
  const client = useQueryClient()
  return useSafeMutation<unknown, { id: string; showOnMap: boolean | null }>({
    mutationFn: ({ id, showOnMap }) => setAirportMapVisibility(id, showOnMap),
    onSuccess: () => client.invalidateQueries({ queryKey: airportsKeys.lists() }),
  })
}
