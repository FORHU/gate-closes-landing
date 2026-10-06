import { z } from "zod"

/** `GET /admin/users`: newest first, role already resolved ("user" when none). */
export const AdminUserSchema = z.object({
  _id: z.string(),
  email: z.string(),
  username: z.string().nullish(),
  picture: z.string().nullish(),
  role: z.string(),
  createdAt: z.string().nullish(),
})
export type AdminUser = z.infer<typeof AdminUserSchema>

export const AdminUsersResponseSchema = z.array(AdminUserSchema)

export type UsersFilter = { q?: string; role?: string }

/** A role the table can assign, as the page passes it in. */
export type RoleOption = { name: string; label: string }
