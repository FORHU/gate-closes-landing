import { cookies } from "next/headers"
import { PanelShell } from "@/app/(admin)/admin/_screens/panel-shell"
import { ADMIN_SIDEBAR_COOKIE, ADMIN_THEME_COOKIE } from "@/shared/lib/admin-prefs"

/** Every admin page except login. */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  return (
    <PanelShell
      initialCollapsed={cookieStore.get(ADMIN_SIDEBAR_COOKIE)?.value === "collapsed"}
      initialTheme={cookieStore.get(ADMIN_THEME_COOKIE)?.value === "light" ? "light" : "dark"}
    >
      {children}
    </PanelShell>
  )
}
