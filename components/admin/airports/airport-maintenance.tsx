"use client"

import { useEffect, useState, useTransition, type ReactNode } from "react"

import { runAirportCrawl, syncAirportBoundaries } from "@/app/admin/airports/actions"
import { cn } from "@/lib/utils"

const BUTTON =
  "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-xs font-semibold transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme"

type Outcome = { tone: "ok" | "error"; text: string } | null

/**
 * A button that asks once more before running a job: the first press arms
 * it ("Confirm, run now") for 5 seconds, the second runs it.
 */
function JobButton({ label, pending, onRun }: { label: string; pending: boolean; onRun: () => void }) {
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const timer = setTimeout(() => setArmed(false), 5000)
    return () => clearTimeout(timer)
  }, [armed])

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (armed) {
          setArmed(false)
          onRun()
        } else {
          setArmed(true)
        }
      }}
      className={cn(BUTTON, armed ? "bg-theme text-black" : "text-ink/80 ring-1 ring-ink/15 hover:bg-ink/5")}
    >
      {pending ? "Running…" : armed ? "Confirm, run now" : label}
    </button>
  )
}

function Job({ title, body, children, outcome }: { title: string; body: string; children: ReactNode; outcome: Outcome }) {
  return (
    <div className="flex flex-col gap-3 border-b border-ink/[0.08] py-4 last:border-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="text-sm font-medium text-ink/90">{title}</h3>
        <p className="max-w-prose text-xs text-ink/45">{body}</p>
        <p
          aria-live="polite"
          className={cn("text-xs", outcome?.tone === "error" ? "text-red-600 dark:text-red-300" : "text-theme-ink")}
        >
          {outcome?.text}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

/** Import (crawl) and redraw (boundary sync): the airport jobs that were API-only. */
export function AirportMaintenance() {
  const [crawlPending, startCrawl] = useTransition()
  const [syncPending, startSync] = useTransition()
  const [crawl, setCrawl] = useState<Outcome>(null)
  const [sync, setSync] = useState<Outcome>(null)
  const [force, setForce] = useState(false)

  return (
    <div className="flex flex-col">
      <Job
        title="Import airports"
        body="Adds airline airports that aren't stored yet, from the API's airport file. Existing airports and hand-set radii are never changed."
        outcome={crawl}
      >
        <JobButton
          label="Run import"
          pending={crawlPending}
          onRun={() =>
            startCrawl(async () => {
              setCrawl(null)
              const res = await runAirportCrawl()
              setCrawl(
                res.ok
                  ? {
                      tone: "ok",
                      text: `${res.result.insertedCount} added, ${res.result.skippedAlreadyStored} already stored, ${res.result.skippedOutOfScope + res.result.skippedNoBoundary} skipped.`,
                    }
                  : { tone: "error", text: res.error }
              )
            })
          }
        />
      </Job>
      <Job
        title="Redraw circles"
        body="Draws each airport's circle from its radius. Normally only airports missing a circle; tick the box to redraw every one."
        outcome={sync}
      >
        <label className="flex items-center gap-2 text-xs text-ink/60">
          <input
            type="checkbox"
            checked={force}
            onChange={(e) => setForce(e.target.checked)}
            className="size-4 accent-[var(--color-theme)]"
          />
          Redraw all
        </label>
        <JobButton
          label="Redraw"
          pending={syncPending}
          onRun={() =>
            startSync(async () => {
              setSync(null)
              const res = await syncAirportBoundaries(force)
              setSync(
                res.ok
                  ? { tone: "ok", text: `${res.result.updatedCount} redrawn, ${res.result.skippedCount} skipped, of ${res.result.total}.` }
                  : { tone: "error", text: res.error }
              )
            })
          }
        />
      </Job>
    </div>
  )
}
