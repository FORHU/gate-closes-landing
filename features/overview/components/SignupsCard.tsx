"use client"

import { Notice, Panel, Stat } from "@/shared/components/admin-ui"
import { useOverview } from "../hooks/useOverview"

/** New accounts in the last 7 days, against the 7 days before. */
export function SignupsCard() {
  const { data, error } = useOverview()
  const signups = data?.signups

  return (
    <Panel className="p-5">
      <Stat
        label="Sign-ups in the last 7 days"
        value={signups ? signups.last7d.toLocaleString() : "—"}
        hint={signups && change(signups.last7d, signups.prev7d)}
      />
      {error && (
        <div className="mt-3">
          <Notice tone="error">{error.message}</Notice>
        </div>
      )}
    </Panel>
  )
}

function change(now: number, before: number) {
  const diff = now - before
  if (diff === 0) return `Same as the week before (${before})`
  return `${diff > 0 ? "+" : "−"}${Math.abs(diff)} on the week before (${before})`
}
