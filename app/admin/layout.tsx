import type { ReactNode } from "react"
import { cookies } from "next/headers"

import { AdminShell } from "@/components/admin/admin-shell"
import { Backdrop } from "@/components/backdrop"
import { SIDEBAR_COOKIE, THEME_COOKIE } from "@/lib/admin/cookies"
import { getAdmin } from "@/lib/admin/dal"
import { cn } from "@/lib/utils"

// Shell with the floating sidebar around every /admin page. Not an auth
// gate: each page still calls requireAdmin(), so with no admin this renders
// the page alone and the page redirects to sign-in. The theme comes from a
// cookie (dark by default) so the first paint is already right.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [admin, cookieStore] = await Promise.all([getAdmin(), cookies()])
  const theme = cookieStore.get(THEME_COOKIE)?.value === "light" ? "light" : "dark"

  return (
    <div
      data-admin-root
      className={cn(
        "relative isolate flex min-h-[100dvh] flex-1 flex-col bg-paper text-ink transition-colors duration-500",
        theme === "dark" && "dark"
      )}
    >
      <Backdrop plane={false} />
      {admin ? (
        <AdminShell
          account={{ email: admin.user.email, role: admin.user.role }}
          initialCollapsed={cookieStore.get(SIDEBAR_COOKIE)?.value === "collapsed"}
          initialTheme={theme}
        >
          {children}
        </AdminShell>
      ) : (
        children
      )}
    </div>
  )
}
