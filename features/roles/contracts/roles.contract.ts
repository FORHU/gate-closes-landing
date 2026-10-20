import { z } from "zod"
import { PERMISSIONS } from "@/shared/auth/permissions"

const PermissionSchema = z.enum(PERMISSIONS)

/** `GET /admin/roles`: the roles defined in the API's code, in order. */
export const RoleSchema = z.object({
  name: z.string(),
  label: z.string(),
  description: z.string().nullish(),
  // Permissions this site doesn't know yet are dropped, not fatal.
  permissions: z
    .array(z.string())
    .transform((list) => list.filter((p) => PermissionSchema.safeParse(p).success))
    .pipe(z.array(PermissionSchema)),
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
