export const featureManifest = {
  name: "users",
  dependsOn: [] as const,
  exposes: ["UsersTable"] as const,
} as const

export type UsersManifest = typeof featureManifest
