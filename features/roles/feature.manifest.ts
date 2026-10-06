export const featureManifest = {
  name: "roles",
  dependsOn: [] as const,
  exposes: ["RolesManager", "useRoles"] as const,
} as const

export type RolesManifest = typeof featureManifest
