"use client"

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronLeft,
  LogOut,
  PlaneTakeoff,
  ShieldCheck,
  TicketPercent,
  Moon,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react"

import { logout } from "@/app/fagc-admin-login/actions"
import { SIDEBAR_COOKIE, THEME_COOKIE } from "@/lib/admin/cookies"
import { cn } from "@/lib/utils"

const EASE = "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"

type NavItem = { label: string; icon: LucideIcon; href?: string }

// Users is the only admin page today; the rest are shown as upcoming and
// are not links.
const NAV: NavItem[] = [
  { label: "Users", icon: Users, href: "/admin" },
  { label: "Offers", icon: TicketPercent },
  { label: "Roles", icon: ShieldCheck },
  { label: "Airports", icon: PlaneTakeoff },
]

// Labels show only while the sidebar is wide (desktop expanded, or the mobile
// overlay open). Pure CSS off the sidebar's data attributes, so the first
// paint is already right and nothing jumps on hydration.
const LABEL = cn(
  "whitespace-nowrap transition-[opacity,translate]",
  EASE,
  "pointer-events-none -translate-x-1 opacity-0",
  "max-md:group-data-[open=true]/side:pointer-events-auto max-md:group-data-[open=true]/side:translate-x-0 max-md:group-data-[open=true]/side:opacity-100",
  "md:pointer-events-auto md:translate-x-0 md:opacity-100",
  "md:group-data-[collapsed=true]/side:pointer-events-none md:group-data-[collapsed=true]/side:-translate-x-1 md:group-data-[collapsed=true]/side:opacity-0"
)

const ITEM =
  "flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme"

const DESKTOP = "(min-width: 768px)"
const subscribeDesktop = (onChange: () => void) => {
  const media = window.matchMedia(DESKTOP)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

type Account = { email: string; role: string }

export function AdminShell({
  account,
  initialCollapsed,
  initialTheme,
  children,
}: {
  account: Account
  initialCollapsed: boolean
  initialTheme: "light" | "dark"
  children: ReactNode
}) {
  const pathname = usePathname()
  // Desktop: collapse is a saved preference. Mobile: the expanded sidebar is
  // a temporary overlay that closes on navigation, scrim tap or Escape.
  const [collapsed, setCollapsed] = useState(initialCollapsed)
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(initialTheme === "dark")
  const desktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP).matches, () => true)
  const expanded = desktop ? !collapsed : open

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  function toggle() {
    if (window.matchMedia(DESKTOP).matches) {
      const next = !collapsed
      setCollapsed(next)
      document.cookie = `${SIDEBAR_COOKIE}=${next ? "collapsed" : "expanded"}; path=/admin; max-age=31536000; samesite=lax`
    } else {
      setOpen(!open)
    }
  }

  // The `.dark` class lives on the layout's wrapper (set from the cookie on
  // the server); flip it in place so the switch is instant, then save it.
  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.querySelector("[data-admin-root]")?.classList.toggle("dark", next)
    document.cookie = `${THEME_COOKIE}=${next ? "dark" : "light"}; path=/admin; max-age=31536000; samesite=lax`
  }

  return (
    <>
      <div
        aria-hidden
        data-open={open}
        onClick={() => setOpen(false)}
        className={cn(
          "pointer-events-none fixed inset-0 z-30 bg-black/50 opacity-0 transition-opacity md:hidden",
          EASE,
          "data-[open=true]:pointer-events-auto data-[open=true]:opacity-100"
        )}
      />

      <aside
        aria-label="Admin navigation"
        data-collapsed={collapsed}
        data-open={open}
        className={cn(
          "group/side fixed top-3 bottom-3 left-3 z-40 w-[4.5rem] transition-[width] md:top-4 md:bottom-4 md:left-4",
          EASE,
          "max-md:data-[open=true]:w-64 md:w-64 md:data-[collapsed=true]:w-[4.5rem]"
        )}
      >
        <div className="h-full rounded-[1.75rem] bg-ink/[0.03] p-1.5 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.25)] dark:shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)] ring-1 ring-ink/10 backdrop-blur-xl">
          <div className="flex h-full flex-col overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-panel/85 px-2 py-3 shadow-[inset_0_1px_1px_rgb(255_255_255/0.07)]">
            <div className="flex h-11 items-center gap-3 px-1.5">
              <Image src="/gate-closes-logo.svg" alt="GateCloses" width={32} height={32} className="flex-none" />
              <span className={cn(LABEL, "flex items-center gap-2")}>
                <span className="font-semibold tracking-tight text-theme-ink">GateCloses</span>
                <span className="rounded-full px-2 py-0.5 text-[9px] font-medium tracking-[0.18em] text-ink/50 uppercase ring-1 ring-ink/10">
                  Admin
                </span>
              </span>
            </div>

            <p className={cn(LABEL, "mt-6 mb-2 px-3 text-[10px] font-medium tracking-[0.2em] text-ink/30 uppercase")}>
              Manage
            </p>
            <nav>
              <ul className="flex flex-col gap-1">
                {NAV.map(({ label, icon: Icon, href }) => {
                  const icon = (
                    <Icon
                      strokeWidth={1.5}
                      className={cn("size-5 flex-none transition-transform", EASE, href && "group-hover/item:translate-x-0.5")}
                    />
                  )
                  if (!href) {
                    return (
                      <li key={label}>
                        <span aria-disabled title={`${label} (coming soon)`} className={cn(ITEM, "cursor-not-allowed text-ink/25")}>
                          {icon}
                          <span className={cn(LABEL, "flex flex-1 items-center justify-between")}>
                            {label}
                            <span className="rounded-full bg-ink/[0.04] px-2 py-0.5 text-[9px] tracking-[0.16em] text-ink/35 uppercase ring-1 ring-ink/10">
                              Soon
                            </span>
                          </span>
                        </span>
                      </li>
                    )
                  }
                  const active = pathname === href
                  return (
                    <li key={label}>
                      <Link
                        href={href}
                        title={label}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          ITEM,
                          "group/item",
                          EASE,
                          active
                            ? "bg-theme/10 text-theme-ink ring-1 ring-theme/20"
                            : "text-ink/60 hover:bg-ink/5 hover:text-ink"
                        )}
                      >
                        {icon}
                        <span className={LABEL}>{label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="mt-auto flex flex-col gap-1 border-t border-ink/[0.08] pt-3">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                title={dark ? "Light mode" : "Dark mode"}
                className={cn(ITEM, "group/item text-ink/50 hover:bg-ink/5 hover:text-ink")}
              >
                {dark ? (
                  <Sun strokeWidth={1.5} className={cn("size-5 flex-none transition-transform group-hover/item:rotate-45", EASE)} />
                ) : (
                  <Moon strokeWidth={1.5} className={cn("size-5 flex-none transition-transform group-hover/item:-rotate-12", EASE)} />
                )}
                <span className={LABEL}>{dark ? "Light mode" : "Dark mode"}</span>
              </button>
              <div className="flex h-11 items-center gap-3 overflow-hidden px-1.5" title={`${account.email} (${account.role})`}>
                <span className="grid size-8 flex-none place-items-center rounded-full bg-theme text-sm font-semibold text-black uppercase">
                  {account.email.charAt(0)}
                </span>
                <span className={cn(LABEL, "flex min-w-0 flex-col")}>
                  <span className="truncate text-xs text-ink/80">{account.email}</span>
                  <span className="text-[10px] tracking-[0.16em] text-theme-ink/80 uppercase">{account.role.replace("_", " ")}</span>
                </span>
              </div>
              <form action={logout}>
                <button type="submit" title="Sign out" className={cn(ITEM, "text-ink/50 hover:bg-ink/5 hover:text-ink")}>
                  <LogOut strokeWidth={1.5} className="size-5 flex-none" />
                  <span className={LABEL}>Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className={cn(
            "absolute top-9 -right-3 grid size-7 place-items-center rounded-full bg-panel text-ink/70 ring-1 ring-ink/15 transition-colors hover:text-theme-ink hover:ring-theme/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme",
            EASE
          )}
        >
          <ChevronLeft
            strokeWidth={1.75}
            className={cn(
              "size-4 transition-transform",
              EASE,
              "max-md:rotate-180 max-md:group-data-[open=true]/side:rotate-0 md:group-data-[collapsed=true]/side:rotate-180"
            )}
          />
        </button>
      </aside>

      <div
        data-collapsed={collapsed}
        className={cn(
          "flex min-w-0 flex-1 flex-col pl-[5.25rem] transition-[padding] md:pl-[18rem] md:data-[collapsed=true]:pl-[6.5rem]",
          EASE
        )}
      >
        {children}
      </div>
    </>
  )
}
