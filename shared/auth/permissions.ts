/**
 * Permissions as gate-closes-api defines them (src/domain/access/permissions.ts).
 * Roles are data in the API; the UI only ever checks permissions.
 */
export const PERMISSIONS = [
  "premium",
  "offers:read",
  "offers:write",
  "users:read",
  "users:role",
  "roles:manage",
  "airports:manage",
] as const

export type Permission = (typeof PERMISSIONS)[number]

/** Any of these opens the admin area; plain app users have none. */
export const STAFF_PERMISSIONS: readonly Permission[] = [
  "offers:read",
  "users:read",
  "roles:manage",
  "airports:manage",
]
