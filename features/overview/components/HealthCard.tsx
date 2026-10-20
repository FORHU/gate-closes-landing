"use client"

import { Fragment } from "react"
import { Notice, Panel, Pill, StatusPill } from "@/shared/components/admin-ui"
import { useReadiness } from "../hooks/useOverview"

const CHECKS = [
  ["database", "Database"],
  ["postgis", "PostGIS"],
  ["redis", "Redis"],
  ["storage", "Storage"],
] as const

/** The API's own checks: database, PostGIS, Redis, storage and sockets. Refreshes every 30s. */
export function HealthCard() {
  const { data, error } = useReadiness()

  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">API health</p>
        {data && <StatusPill status={data.status} />}
      </div>
      {error && (
        <div className="mt-3">
          <Notice tone="error">API unreachable: {error.message}</Notice>
        </div>
      )}
      {data && (
        <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
          {CHECKS.map(([key, label]) => (
            <Fragment key={key}>
              <dt>{label}</dt>
              <dd title={data.checks[key].detail}>
                <StatusPill status={data.checks[key].status} />
              </dd>
            </Fragment>
          ))}
          <dt>Sockets</dt>
          <dd>
            <Pill>{data.socketAdapter}</Pill>
          </dd>
          <dt className="text-muted-foreground">Up for</dt>
          <dd className="text-right text-muted-foreground tabular-nums">
            {formatUptime(data.uptime)}
          </dd>
        </dl>
      )}
    </Panel>
  )
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86_400)
  const h = Math.floor((seconds % 86_400) / 3_600)
  const m = Math.floor((seconds % 3_600) / 60)
  if (d) return `${d}d ${h}h`
  if (h) return `${h}h ${m}m`
  return `${m}m`
}
