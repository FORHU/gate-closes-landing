export const featureManifest = {
  name: "airports",
  dependsOn: [] as const,
  exposes: ["AirportsTable"] as const,
} as const

export type AirportsManifest = typeof featureManifest
