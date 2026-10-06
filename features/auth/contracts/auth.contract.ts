import { z } from "zod"
import { PERMISSIONS } from "@/shared/auth/permissions"

/** `GET /auth/me`: the logged-in user and what their role allows. */
export const MeSchema = z.object({
  user: z.object({
    _id: z.string(),
    email: z.string(),
    username: z.string().optional(),
    role: z.string(),
  }),
  // Unknown permissions (API newer than this site) are dropped, not fatal.
  permissions: z
    .array(z.string())
    .transform((list) =>
      list.filter((p): p is (typeof PERMISSIONS)[number] =>
        (PERMISSIONS as readonly string[]).includes(p)
      )
    ),
})

export type Me = z.infer<typeof MeSchema>

export const LoginSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
})

export type LoginInput = z.infer<typeof LoginSchema>
