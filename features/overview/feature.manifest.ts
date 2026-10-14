export const featureManifest = {
  name: "overview",
  dependsOn: [] as const,
  exposes: ["EchoesTodayCard", "SignupsCard", "HealthCard"] as const,
} as const

export type OverviewManifest = typeof featureManifest
