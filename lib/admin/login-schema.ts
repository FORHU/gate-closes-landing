import { z } from "zod"

// Shared by the login form (client) and the login Server Function (server).
export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
})

export type AdminLoginValues = z.infer<typeof adminLoginSchema>
