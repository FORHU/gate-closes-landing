import { useQueryClient } from "@tanstack/react-query"
import { useSafeMutation } from "@/shared/query/useSafeMutation"
import { useSafeQuery } from "@/shared/query/useSafeQuery"
import {
  getAirports,
  setAirportMapVisibility,
  setAirportRadius,
  setAirportTerminal,
} from "../api/airports.client"
import { airportsKeys } from "../api/airports.keys"
import type { AirportsFilter } from "../contracts/airports.contract"

export function useAirports(filter: AirportsFilter) {
  return useSafeQuery({
    queryKey: airportsKeys.list(filter),
    queryFn: () => getAirports(filter),
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

export function useSetAirportTerminal() {
  const client = useQueryClient()
  return useSafeMutation<unknown, { id: string; terminal: { lat: number; lng: number } | null }>({
    mutationFn: ({ id, terminal }) => setAirportTerminal(id, terminal),
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
