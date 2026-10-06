import { z } from "zod"
import { PERMISSIONS } from "@/shared/auth/permissions"

const PermissionSchema = z.enum(PERMISSIONS)

/** `GET /admin/roles`: system roles first; super_admin always has everything. */
export const RoleSchema = z.object({
  _id: z.string(),
  name: z.string(),
  label: z.string(),
  description: z.string().nullish(),
  // Permissions this site doesn't know yet are dropped, not fatal.
  permissions: z
    .array(z.string())
    .transform((list) => list.filter((p) => PermissionSchema.safeParse(p).success))
    .pipe(z.array(PermissionSchema)),
  isSystem: z.boolean(),
})
export type Role = z.infer<typeof RoleSchema>
export const RolesResponseSchema = z.array(RoleSchema)

/** `GET /admin/permissions`: every permission with what it allows. */
export const PermissionInfoSchema = z.object({
  name: PermissionSchema,
  description: z.string(),
})
export type PermissionInfo = z.infer<typeof PermissionInfoSchema>
export const PermissionCatalogSchema = z.array(PermissionInfoSchema)

export type RoleInput = {
  name: string
  label: string
  description: string | null
  permissions: Role["permissions"]
}

/** Matches the API: lowercase letters, digits or _, starting with a letter. */
export const ROLE_NAME_PATTERN = /^[a-z][a-z0-9_]{1,31}$/
export const SUPER_ADMIN_ROLE = "super_admin"
