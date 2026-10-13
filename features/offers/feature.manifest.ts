export const featureManifest = {
  name: "offers",
  dependsOn: [] as const,
  exposes: ["OffersTable", "OfferEditor", "useOffers"] as const,
} as const

export type OffersManifest = typeof featureManifest
