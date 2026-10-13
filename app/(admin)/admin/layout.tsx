import type { Metadata } from "next"
import { AuthListener } from "@/features/auth/components/AuthListener"
import { QueryProvider } from "@/shared/providers/query-provider"

export const metadata: Metadata = {
  title: "Admin",
  // Staff only: never in search results (robots.txt disallows /admin too).
  robots: { index: false, follow: false },
}

/** Data, toasts and session-ended handling for the admin area only. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthListener />
      {children}
    </QueryProvider>
  )
}
