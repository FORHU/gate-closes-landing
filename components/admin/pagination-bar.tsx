import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

// Page controls shared by the admin tables. Pages are links built by the
// caller (`hrefFor`), so the search and sort in the URL carry over; the API
// does the paging and sends `pagination` back.

export type Pagination = { page: number; limit: number; total: number; totalPages: number }

const MAX_PAGE = 10_000 // the API rejects anything higher

/** A positive whole page number from the URL; anything else means page 1. */
export function parsePage(raw?: string | string[]) {
  const page = Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isInteger(page) && page >= 1 ? Math.min(page, MAX_PAGE) : 1
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

const CONTROL =
  "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-full px-3 text-xs font-medium tabular-nums transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme"

export function PaginationBar({
  pagination,
  shown,
  hrefFor,
  label,
}: {
  pagination: Pagination
  /** Rows on this page. */
  shown: number
  hrefFor: (page: number) => string
  /** Accessible name of the controls, e.g. "Users pagination". */
  label: string
}) {
  const { page, limit, total, totalPages } = pagination
  const from = (page - 1) * limit + 1
  const to = from + shown - 1

  const step = (target: number, text: string, icon: ReactNode, disabled: boolean) =>
    disabled ? (
      <span aria-disabled className={cn(CONTROL, "cursor-not-allowed text-ink/25 ring-1 ring-ink/[0.06]")}>
        {icon}
        <span className="max-sm:sr-only">{text}</span>
      </span>
    ) : (
      <Link
        href={hrefFor(target)}
        prefetch={false}
        scroll={false}
        aria-label={`${text} page`}
        className={cn(CONTROL, "text-ink/70 ring-1 ring-ink/10 hover:bg-ink/5 hover:text-ink")}
      >
        {icon}
        <span className="max-sm:sr-only">{text}</span>
      </Link>
    )

  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.08] pt-4">
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
                href={hrefFor(item)}
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
