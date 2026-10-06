import { useQueryClient } from "@tanstack/react-query"
import { useSafeMutation } from "@/shared/query/useSafeMutation"
import { useSafeQuery } from "@/shared/query/useSafeQuery"
import {
  createOffer,
  deleteOffer,
  getOffer,
  getOfferStats,
  getOffers,
  updateOffer,
} from "../api/offers.client"
import { offersKeys } from "../api/offers.keys"
import type { Offer, OfferInput, OfferStatus } from "../contracts/offers.contract"

export function useOffers(status?: OfferStatus) {
  return useSafeQuery({
    queryKey: offersKeys.list(status ?? "all"),
    queryFn: () => getOffers(status),
  })
}

export function useOffer(id: string) {
  return useSafeQuery({ queryKey: offersKeys.detail(id), queryFn: () => getOffer(id) })
}

export function useOfferStats(id: string) {
  return useSafeQuery({
    queryKey: offersKeys.stats(id),
    queryFn: () => getOfferStats(id),
    staleTime: 30_000,
  })
}

/** Creates without an id, updates with one; keeps lists and detail fresh. */
export function useSaveOffer(id?: string) {
  const client = useQueryClient()
  return useSafeMutation<Offer, OfferInput>({
    mutationFn: (input) => (id ? updateOffer(id, input) : createOffer(input)),
    onSuccess: (offer) => {
      client.setQueryData(offersKeys.detail(offer._id), offer)
      client.invalidateQueries({ queryKey: offersKeys.lists() })
    },
  })
}

export function useDeleteOffer() {
  const client = useQueryClient()
  return useSafeMutation<void, string>({
    mutationFn: deleteOffer,
    onSuccess: (_, id) => {
      client.removeQueries({ queryKey: offersKeys.detail(id) })
      client.invalidateQueries({ queryKey: offersKeys.lists() })
    },
  })
}
