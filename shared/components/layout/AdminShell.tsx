"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type NavItem = { href: string; label: string; icon: LucideIcon }

/**
 * Sidebar (top bar on phones) + page area. Dumb on purpose: the app layer
 * decides which items the current role may see and passes them in.
 */
export function AdminShell({
  items,
  user,
  onLogout,
  children,
}: {
  items: NavItem[]
  user: { email: string; role: string }
  onLogout: () => void
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30 md:flex-row">
      <aside className="flex shrink-0 flex-col border-b bg-background md:sticky md:top-0 md:h-dvh md:w-60 md:border-r md:border-b-0">
        <Link href="/admin" className="flex items-center gap-2.5 px-5 py-4">
          <Image src="/gate-closes-logo.svg" alt="" width={28} height={28} />
          <span className="font-semibold">
            GateCloses <span className="text-muted-foreground">Admin</span>
          </span>
        </Link>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap",
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            )
          })}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted md:hidden"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </nav>

        <div className="mt-auto hidden border-t px-5 py-4 md:block">
          <p className="truncate text-sm font-medium">{user.email}</p>
          <p className="text-xs text-muted-foreground">{user.role.replace(/_/g, " ")}</p>
          <button
            onClick={onLogout}
            className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-3.5" /> Log out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}
