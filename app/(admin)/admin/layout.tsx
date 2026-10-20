import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Backdrop } from "@/components/backdrop"
import { cn } from "@/lib/utils"
import { AuthListener } from "@/features/auth/components/AuthListener"
import { ADMIN_THEME_COOKIE } from "@/shared/lib/admin-prefs"
import { QueryProvider } from "@/shared/providers/query-provider"

export const metadata: Metadata = {
  title: "Admin",
  // Staff only: never in search results (robots.txt disallows /admin too).
  robots: { index: false, follow: false },
}

/**
 * Data, toasts and session-ended handling for the admin area only. The
 * wrapper carries the admin look: the paper/ink/panel palette, the backdrop,
 * and `.dark` from the theme cookie (dark by default).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const theme = (await cookies()).get(ADMIN_THEME_COOKIE)?.value === "light" ? "light" : "dark"
  return (
    <div
      data-admin-root
      className={cn(
        "relative isolate flex min-h-[100dvh] flex-1 flex-col bg-paper text-ink transition-colors duration-500",
        theme === "dark" && "dark"
      )}
    >
      <Backdrop plane={false} />
      <QueryProvider>
        <AuthListener />
        {children}
      </QueryProvider>
    </div>
  )
}
