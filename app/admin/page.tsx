import { Suspense, type ReactNode } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react"

import { SortSelect } from "@/components/admin/sort-select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/admin/api"
import { isAdminRole, requireAdmin } from "@/lib/admin/dal"
import { DEFAULT_USER_SORT, parseUserSort, type UserSort } from "@/lib/admin/user-sort"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Admin · GateCloses",
  robots: { index: false, follow: false },
}

const PAGE_SIZE = 10
const MAX_PAGE = 10_000 // the API rejects anything higher

type ListedUser = {
  _id: string
  email: string
  username?: string
  role: string
  createdAt?: string
}

type Pagination = { page: number; limit: number; total: number; totalPages: number }

/** What the table is showing: the search and the sort order. */
type View = { q: string; sort: UserSort }

/** Asks the API for one page only; the database does the sorting, slicing and counting. */
async function fetchUsers(accessToken: string, { q, sort }: View, page: number) {
  const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE), sort })
  if (q) params.set("q", q)
  try {
    const res = await apiFetch(`/api/admin/users?${params}`, { token: accessToken })
    if (!res.ok) return { error: `Couldn't load users (HTTP ${res.status}).` } as const
    const { data, pagination } = (await res.json()) as { data: ListedUser[]; pagination: Pagination }
    return { users: data, pagination, error: null } as const
  } catch {
    return { error: "Can't reach the server." } as const
  }
}

function formatDate(value?: string) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

/** A positive whole page number from the URL; anything else means page 1. */
function parsePage(raw?: string | string[]) {
  const page = Number(first(raw))
  return Number.isInteger(page) && page >= 1 ? Math.min(page, MAX_PAGE) : 1
}

/** Keeps the search and sort when changing pages; defaults stay out of the URL. */
function pageHref({ q, sort }: View, page: number) {
  const params = new URLSearchParams()
  if (q) params.set("q", q)
  if (sort !== DEFAULT_USER_SORT) params.set("sort", sort)
  if (page > 1) params.set("page", String(page))
  const query = params.toString()
  return query ? `/admin?${query}` : "/admin"
}

/** First, last and the pages around the current one, with gaps between. */
function pageWindow(page: number, totalPages: number) {
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)
  const items: (number | "gap")[] = []
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push("gap")
    items.push(p)
  })
  return items
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[]; sort?: string | string[] }>
}) {
  const admin = await requireAdmin()
  const params = await searchParams
  const q = first(params.q)?.trim() ?? ""
  const page = parsePage(params.page)
  const view: View = { q, sort: parseUserSort(first(params.sort)) }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <header className="mb-8 flex flex-col gap-3 animate-rise motion-reduce:animate-none">
        <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
          Users
        </h1>
        <p className="text-sm text-ink/45">
          Here’s who’s joining the community. Browse the latest accounts or search by username.
        </p>
      </header>

      <section className="rounded-[1.75rem] bg-ink/[0.03] p-1.5 ring-1 ring-ink/10 animate-rise [animation-delay:80ms] motion-reduce:animate-none">
        <div className="flex flex-col gap-5 rounded-[calc(1.75rem-0.375rem)] bg-panel p-4 shadow-[inset_0_1px_1px_rgb(255_255_255/0.07)] md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Submits `q` (and the current sort) but never `page`, so a new search starts at page 1. */}
            <form method="get" className="flex w-full max-w-md gap-2" role="search">
              {view.sort !== DEFAULT_USER_SORT && <input type="hidden" name="sort" value={view.sort} />}
              <div className="relative min-w-0 flex-1">
                <Search
                  strokeWidth={1.5}
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/35"
                />
                <Input
                  name="q"
                  defaultValue={q}
                  placeholder="Email or username"
                  aria-label="Search users"
                  className="h-10 rounded-full border-ink/10 bg-ink/[0.03] pl-10 text-sm text-ink placeholder:text-ink/30 md:text-sm focus-visible:border-theme/60 focus-visible:ring-4 focus-visible:ring-theme/10"
                />
              </div>
              <Button
                type="submit"
                className="h-10 rounded-full bg-theme px-5 text-sm font-semibold text-black transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-theme/90 active:scale-[0.98]"
              >
                Search
              </Button>
            </form>
            <SortSelect value={view.sort} />
          </div>

          {/* A new key per page, search or sort shows the skeleton while that page loads. */}
          <Suspense key={`${q}|${view.sort}|${page}`} fallback={<TableSkeleton />}>
            <UsersTable accessToken={admin.accessToken} view={view} page={page} />
          </Suspense>
        </div>
      </section>
    </main>
  )
}

/** Small arrow on the column the table is sorted by. */
function SortMark({ dir }: { dir?: "up" | "down" }) {
  if (!dir) return null
  const Icon = dir === "up" ? ArrowUp : ArrowDown
  return <Icon strokeWidth={1.75} aria-hidden className="ml-1 inline size-3 -translate-y-px text-theme-ink" />
}

async function UsersTable({ accessToken, view, page }: { accessToken: string; view: View; page: number }) {
  const result = await fetchUsers(accessToken, view, page)
  const { sort } = view

  if (result.error) {
    return (
      <p role="alert" className="w-fit rounded-full bg-destructive/10 px-4 py-2.5 text-xs text-red-600 ring-1 dark:text-red-300 ring-destructive/30">
        {result.error}
      </p>
    )
  }

  const { users, pagination } = result
  if (pagination.total === 0) return <p className="py-6 text-sm text-ink/45">No users found.</p>
  // Past the end (e.g. users were removed or the URL was edited): go to the last page.
  if (page > pagination.totalPages) redirect(pageHref(view, pagination.totalPages))

  // Keep every page the same height: the last page gets empty rows up to the
  // page size, so the controls don't jump. (Not for single-page results.)
  const fillers = pagination.totalPages > 1 ? Math.max(0, PAGE_SIZE - users.length) : 0

  return (
    <>
      <div className="-mx-1 overflow-x-auto px-1">
        {/* Fixed layout: columns keep the same widths on every page. */}
        <table className="w-full min-w-[34rem] table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[38%]" />
            <col className="w-[24%]" />
            <col className="w-[18%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead className="text-[10px] tracking-[0.18em] text-ink/35 uppercase">
            <tr className="border-b border-ink/[0.08]">
              <th className="py-3 pr-4 font-medium">Email</th>
              <th
                className="py-3 pr-4 font-medium"
                aria-sort={sort === "username_asc" ? "ascending" : sort === "username_desc" ? "descending" : undefined}
              >
                Username
                <SortMark dir={sort === "username_asc" ? "up" : sort === "username_desc" ? "down" : undefined} />
              </th>
              <th className="py-3 pr-4 font-medium">Role</th>
              <th
                className="py-3 font-medium"
                aria-sort={sort === "oldest" ? "ascending" : sort === "newest" ? "descending" : undefined}
              >
                Joined
                <SortMark dir={sort === "oldest" ? "up" : sort === "newest" ? "down" : undefined} />
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="h-12 border-b border-ink/[0.06] transition-colors last:border-0 hover:bg-ink/[0.02]"
              >
                <td className="truncate py-3 pr-4 font-medium text-ink/90" title={user.email}>
                  {user.email}
                </td>
                <td className="truncate py-3 pr-4 text-ink/50" title={user.username}>
                  {user.username || "—"}
                </td>
                <td className="py-3 pr-4">
                  <Badge
                    variant="outline"
                    className={
                      isAdminRole(user.role)
                        ? "border-theme/30 bg-theme/10 text-theme-ink"
                        : "border-ink/10 bg-ink/[0.03] text-ink/60"
                    }
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="py-3 text-ink/50 tabular-nums">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
            {Array.from({ length: fillers }, (_, i) => (
              <tr key={`filler-${i}`} aria-hidden className="h-12 border-b border-transparent last:border-0">
                <td colSpan={4} className="py-3 text-sm">
                  &nbsp;
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationBar view={view} pagination={pagination} shown={users.length} />
    </>
  )
}

const CONTROL =
  "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-full px-3 text-xs font-medium tabular-nums transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme"

function PaginationBar({ view, pagination, shown }: { view: View; pagination: Pagination; shown: number }) {
  const { page, limit, total, totalPages } = pagination
  const from = (page - 1) * limit + 1
  const to = from + shown - 1

  const step = (target: number, label: string, icon: ReactNode, disabled: boolean) =>
    disabled ? (
      <span aria-disabled className={cn(CONTROL, "cursor-not-allowed text-ink/25 ring-1 ring-ink/[0.06]")}>
        {icon}
        <span className="max-sm:sr-only">{label}</span>
      </span>
    ) : (
      <Link
        href={pageHref(view, target)}
        prefetch={false}
        scroll={false}
        aria-label={`${label} page`}
        className={cn(CONTROL, "text-ink/70 ring-1 ring-ink/10 hover:bg-ink/5 hover:text-ink")}
      >
        {icon}
        <span className="max-sm:sr-only">{label}</span>
      </Link>
    )

  return (
    <nav
      aria-label="Users pagination"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.08] pt-4"
    >
      <p className="text-xs text-ink/45 tabular-nums">
        Showing <span className="font-medium text-ink/80">{from}–{to}</span> of{" "}
        <span className="font-medium text-ink/80">{total}</span>
      </p>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {step(page - 1, "Previous", <ChevronLeft strokeWidth={1.5} className="size-4" />, page <= 1)}
          {pageWindow(page, totalPages).map((item, i) =>
            item === "gap" ? (
              <span key={`gap-${i}`} aria-hidden className="px-1 text-xs text-ink/30">
                …
              </span>
            ) : item === page ? (
              <span key={item} aria-current="page" className={cn(CONTROL, "bg-theme font-semibold text-black")}>
                {item}
              </span>
            ) : (
              <Link
                key={item}
                href={pageHref(view, item)}
                prefetch={false}
                scroll={false}
                aria-label={`Page ${item}`}
                className={cn(CONTROL, "text-ink/60 hover:bg-ink/5 hover:text-ink")}
              >
                {item}
              </Link>
            )
          )}
          {step(page + 1, "Next", <ChevronRight strokeWidth={1.5} className="size-4" />, page >= totalPages)}
          <span className="ml-1 text-xs text-ink/40 tabular-nums">
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </nav>
  )
}

function TableSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col">
      <span className="sr-only" role="status">
        Loading users…
      </span>
      <div className="h-10 border-b border-ink/[0.08]" />
      {Array.from({ length: PAGE_SIZE }, (_, i) => (
        <div key={i} className="flex h-12 items-center gap-6 border-b border-ink/[0.06] last:border-0">
          <div className="h-3 w-[32%] animate-pulse rounded-full bg-ink/[0.07] motion-reduce:animate-none" />
          <div className="h-3 w-[18%] animate-pulse rounded-full bg-ink/[0.05] motion-reduce:animate-none" />
          <div className="h-4 w-14 animate-pulse rounded-full bg-ink/[0.05] motion-reduce:animate-none" />
          <div className="ml-auto h-3 w-20 animate-pulse rounded-full bg-ink/[0.05] motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  )
}
