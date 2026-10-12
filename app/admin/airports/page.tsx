import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Search } from "lucide-react"

import { AirportMaintenance } from "@/components/admin/airports/airport-maintenance"
import { PaginationBar, parsePage, type Pagination } from "@/components/admin/pagination-bar"
import { RadiusEditor } from "@/components/admin/airports/radius-editor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/admin/api"
import { AIRPORTS_PERMISSION, requireAdmin } from "@/lib/admin/dal"

export const metadata: Metadata = {
  title: "Airports · Admin · GateCloses",
  robots: { index: false, follow: false },
}

const PAGE_SIZE = 10

type AdminAirport = {
  _id: string
  airport?: string
  iata?: string | null
  icao?: string | null
  countryCode?: string | null
  type?: string | null
  radiusKm?: number | null
  radiusManual: boolean
  defaultRadiusKm: number | null
}

/** Asks the API for one page only; the database does the filtering, sorting, slicing and counting. */
async function fetchAirports(accessToken: string, q: string, page: number) {
  const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
  if (q) params.set("q", q)
  try {
    const res = await apiFetch(`/api/admin/airports?${params}`, { token: accessToken })
    if (!res.ok) return { error: `Couldn't load airports (HTTP ${res.status}).` } as const
    const { data, pagination } = (await res.json()) as { data: AdminAirport[]; pagination: Pagination }
    return { airports: data, pagination, error: null } as const
  } catch {
    return { error: "Can't reach the server." } as const
  }
}

/** Keeps the search when changing pages; page 1 stays out of the URL. */
function pageHref(q: string, page: number) {
  const params = new URLSearchParams()
  if (q) params.set("q", q)
  if (page > 1) params.set("page", String(page))
  const query = params.toString()
  return query ? `/admin/airports?${query}` : "/admin/airports"
}

const PANEL_OUTER = "rounded-[1.75rem] bg-ink/[0.03] p-1.5 ring-1 ring-ink/10"
const PANEL_INNER =
  "flex flex-col gap-5 rounded-[calc(1.75rem-0.375rem)] bg-panel p-4 shadow-[inset_0_1px_1px_rgb(255_255_255/0.07)] md:p-6"

export default async function AdminAirportsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>
}) {
  const admin = await requireAdmin()
  const params = await searchParams
  const q = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? ""
  const page = parsePage(params.page)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <header className="mb-8 flex flex-col gap-3 animate-rise motion-reduce:animate-none">
        <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">Airports</h1>
        <p className="max-w-2xl text-sm text-ink/45">
          Each airport&rsquo;s circle decides who counts as inside it. Search an airport to check or change its radius.
        </p>
      </header>

      {!admin.permissions.includes(AIRPORTS_PERMISSION) ? (
        <p className="w-fit rounded-2xl bg-ink/[0.03] px-5 py-4 text-sm text-ink/60 ring-1 ring-ink/10">
          Your role can&rsquo;t manage airports. Ask a super admin to add{" "}
          <code className="font-mono text-ink/80">{AIRPORTS_PERMISSION}</code> to your role.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <section
            aria-label="Airports"
            className={`${PANEL_OUTER} animate-rise [animation-delay:80ms] motion-reduce:animate-none`}
          >
            <div className={PANEL_INNER}>
              {/* Submits `q` but never `page`, so a new search starts at page 1. */}
              <form method="get" className="flex w-full max-w-md gap-2" role="search">
                <div className="relative min-w-0 flex-1">
                  <Search
                    strokeWidth={1.5}
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/35"
                  />
                  <Input
                    name="q"
                    defaultValue={q}
                    placeholder="Code or name, e.g. MNL"
                    aria-label="Search airports"
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

              {/* A new key per page or search shows the skeleton while it loads. */}
              <Suspense key={`${q}|${page}`} fallback={<TableSkeleton />}>
                <AirportsTable accessToken={admin.accessToken} q={q} page={page} />
              </Suspense>
            </div>
          </section>

          <section
            aria-labelledby="maintenance-title"
            className={`${PANEL_OUTER} animate-rise [animation-delay:160ms] motion-reduce:animate-none`}
          >
            <div className={PANEL_INNER}>
              <div className="flex flex-col gap-1">
                <h2 id="maintenance-title" className="text-lg font-medium tracking-[-0.02em]">
                  Maintenance
                </h2>
                <p className="text-xs text-ink/45">Jobs that touch every airport. Each asks you to confirm.</p>
              </div>
              <AirportMaintenance />
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

async function AirportsTable({ accessToken, q, page }: { accessToken: string; q: string; page: number }) {
  const result = await fetchAirports(accessToken, q, page)
  if (result.error) {
    return (
      <p
        role="alert"
        className="w-fit rounded-full bg-destructive/10 px-4 py-2.5 text-xs text-red-600 ring-1 ring-destructive/30 dark:text-red-300"
      >
        {result.error}
      </p>
    )
  }

  const { airports, pagination } = result
  if (pagination.total === 0) {
    return <p className="py-6 text-sm text-ink/45">{q ? `No airport matches “${q}”.` : "No airports stored yet. Run the import below."}</p>
  }
  // Past the end (e.g. airports were removed or the URL was edited): go to the last page.
  if (page > pagination.totalPages) redirect(pageHref(q, pagination.totalPages))

  // Keep every page the same height: the last page gets empty rows up to the
  // page size, so the controls don't jump. (Not for single-page results.)
  const fillers = pagination.totalPages > 1 ? Math.max(0, PAGE_SIZE - airports.length) : 0

  return (
    <>
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full min-w-[46rem] table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[16%]" />
            <col className="w-[28%]" />
          </colgroup>
          <thead className="text-[10px] tracking-[0.18em] text-ink/35 uppercase">
            <tr className="border-b border-ink/[0.08]">
              <th className="py-3 pr-4 font-medium">Airport</th>
              <th className="py-3 pr-4 font-medium">Codes</th>
              <th className="py-3 pr-4 font-medium">Size</th>
              <th className="py-3 pr-4 font-medium">Radius</th>
              <th className="py-3 font-medium">
                <span className="sr-only">Change radius</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {airports.map((a) => (
              <tr key={a._id} className="border-b border-ink/[0.06] align-top transition-colors last:border-0 hover:bg-ink/[0.02]">
                <td className="py-3 pr-4">
                  <p className="truncate font-medium text-ink/90" title={a.airport}>
                    {a.airport || "Unnamed airport"}
                  </p>
                  <p className="text-xs text-ink/40">{a.countryCode || "—"}</p>
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-ink/70">
                  {a.iata || "—"}
                  <span className="text-ink/30"> · </span>
                  {a.icao || "—"}
                </td>
                <td className="py-3 pr-4 text-ink/55 capitalize">{a.type?.replace("_airport", "") || "—"}</td>
                <td className="py-3 pr-4">
                  <p className="tabular-nums text-ink/90">{a.radiusKm != null ? `${a.radiusKm} km` : "—"}</p>
                  {a.radiusManual ? (
                    <Badge variant="outline" className="mt-1 border-theme/30 bg-theme/10 text-[10px] text-theme-ink">
                      Set by hand
                    </Badge>
                  ) : (
                    <p className="text-xs text-ink/40">Default for its size</p>
                  )}
                </td>
                <td className="py-3">
                  <RadiusEditor
                    id={a._id}
                    airport={a.airport || a.iata || "this airport"}
                    radiusKm={a.radiusKm ?? null}
                    defaultRadiusKm={a.defaultRadiusKm}
                    manual={a.radiusManual}
                  />
                </td>
              </tr>
            ))}
            {Array.from({ length: fillers }, (_, i) => (
              <tr key={`filler-${i}`} aria-hidden className="h-[4.75rem] border-b border-transparent last:border-0">
                <td colSpan={5}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationBar
        pagination={pagination}
        shown={airports.length}
        hrefFor={(p) => pageHref(q, p)}
        label="Airports pagination"
      />
    </>
  )
}

function TableSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col">
      <span className="sr-only" role="status">
        Loading airports…
      </span>
      <div className="h-10 border-b border-ink/[0.08]" />
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex h-14 items-center gap-6 border-b border-ink/[0.06] last:border-0">
          <div className="h-3 w-[26%] animate-pulse rounded-full bg-ink/[0.07] motion-reduce:animate-none" />
          <div className="h-3 w-[10%] animate-pulse rounded-full bg-ink/[0.05] motion-reduce:animate-none" />
          <div className="h-3 w-[8%] animate-pulse rounded-full bg-ink/[0.05] motion-reduce:animate-none" />
          <div className="ml-auto h-8 w-40 animate-pulse rounded-full bg-ink/[0.05] motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  )
}
