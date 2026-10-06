export const featureManifest = {
  name: "auth",
  dependsOn: [] as const,
  exposes: ["AuthGuard", "AuthListener", "Can", "LoginForm", "useMe", "usePermissions", "useLogout"] as const,
} as const

export type AuthManifest = typeof featureManifest
