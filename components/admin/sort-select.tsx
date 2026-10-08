"use client"

import { useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { DEFAULT_USER_SORT, USER_SORTS, type UserSort } from "@/lib/admin/user-sort"
import { cn } from "@/lib/utils"

/** Changes `?sort=` (keeping the search) and goes back to page 1. */
export function SortSelect({ value }: { value: UserSort }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  function onChange(next: string) {
    const params = new URLSearchParams(searchParams)
    params.delete("page")
    if (next === DEFAULT_USER_SORT) params.delete("sort")
    else params.set("sort", next)
    const query = params.toString()
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }))
  }

  return (
    <label className={cn("relative flex items-center", pending && "opacity-60")}>
      <span className="sr-only">Sort users</span>
      <ArrowUpDown strokeWidth={1.5} aria-hidden className="pointer-events-none absolute left-3.5 size-4 text-ink/40" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 cursor-pointer appearance-none rounded-full border border-ink/10 bg-ink/[0.03] pr-9 pl-10 text-sm text-ink outline-none transition-colors duration-300 hover:border-ink/20 focus-visible:border-theme/60 focus-visible:ring-4 focus-visible:ring-theme/10"
      >
        {USER_SORTS.map((s) => (
          <option key={s.value} value={s.value} className="bg-panel text-ink">
            {s.label}
          </option>
        ))}
      </select>
      <ChevronDown strokeWidth={1.5} aria-hidden className="pointer-events-none absolute right-3.5 size-4 text-ink/40" />
    </label>
  )
}
