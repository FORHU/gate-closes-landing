"use client"

import { useState, useTransition } from "react"

import { setAirportRadius } from "@/app/admin/airports/actions"
import { cn } from "@/lib/utils"

const BUTTON =
  "inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme"

/** Edits one airport's radius (0.5–30 km), or puts it back to its type's default. */
export function RadiusEditor({
  id,
  airport,
  radiusKm,
  defaultRadiusKm,
  manual,
}: {
  id: string
  airport: string
  radiusKm: number | null
  defaultRadiusKm: number | null
  manual: boolean
}) {
  const [value, setValue] = useState(radiusKm == null ? "" : String(radiusKm))
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const parsed = Number(value)
  const valid = value !== "" && Number.isFinite(parsed) && parsed >= 0.5 && parsed <= 30
  const changed = valid && parsed !== radiusKm

  function save(next: number | null) {
    setStatus(null)
    startTransition(async () => {
      const res = await setAirportRadius(id, next)
      if (res.ok) {
        setValue(String(res.radiusKm))
        setStatus({ tone: "ok", text: next === null ? "Back to default" : "Saved" })
      } else {
        setStatus({ tone: "error", text: res.error })
      }
    })
  }

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (changed) save(parsed)
      }}
    >
      <label className="relative">
        <span className="sr-only">Radius for {airport}, in km</span>
        <input
          type="number"
          inputMode="decimal"
          min={0.5}
          max={30}
          step={0.1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setStatus(null)
          }}
          aria-invalid={value !== "" && !valid}
          className="h-8 w-[5.5rem] rounded-full bg-ink/[0.03] pr-8 pl-3 text-sm tabular-nums text-ink ring-1 ring-ink/10 outline-none focus-visible:ring-2 focus-visible:ring-theme/60 aria-[invalid=true]:ring-red-500/60"
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] text-ink/35">km</span>
      </label>
      <button type="submit" disabled={!changed || pending} className={cn(BUTTON, "bg-theme text-black")}>
        {pending ? "Saving…" : "Save"}
      </button>
      {manual && defaultRadiusKm != null && (
        <button
          type="button"
          disabled={pending}
          onClick={() => save(null)}
          className={cn(BUTTON, "text-ink/60 ring-1 ring-ink/10 hover:text-ink")}
        >
          Use default ({defaultRadiusKm} km)
        </button>
      )}
      <span
        aria-live="polite"
        className={cn("text-xs", status?.tone === "error" ? "text-red-600 dark:text-red-300" : "text-theme-ink")}
      >
        {status?.text}
      </span>
    </form>
  )
}
