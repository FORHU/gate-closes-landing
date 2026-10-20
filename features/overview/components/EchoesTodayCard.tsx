"use client"

import { Notice, Panel, Pill, Stat, formatDate } from "@/shared/components/admin-ui"
import { useOverview } from "../hooks/useOverview"

/** Echoes posted in the last 24 hours, per airport, busiest first. */
export function EchoesTodayCard() {
  const { data, isPending, error } = useOverview()
  const echoes = data?.echoes

  return (
    <Panel className="overflow-hidden">
      <div className="p-5">
        <Stat
          label="Echoes in the last 24 hours"
          value={echoes ? echoes.total.toLocaleString() : "—"}
          hint={echoes && `${echoes.airports.length} airports with activity`}
        />
      </div>
      {(error || isPending || echoes?.airports.length === 0) && (
        <div className="px-5 pb-5">
          {error && <Notice tone="error">{error.message}</Notice>}
          {isPending && <Notice>Loading…</Notice>}
          {echoes?.airports.length === 0 && <Notice>No echoes in the last 24 hours.</Notice>}
        </div>
      )}

      {echoes && echoes.airports.length > 0 && (
        <div className="overflow-x-auto border-t">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Airport</th>
                <th className="px-5 py-3 text-right font-medium">Echoes</th>
                <th className="px-5 py-3 font-medium">Latest</th>
              </tr>
            </thead>
            <tbody>
              {echoes.airports.map((a) => (
                <tr key={a.airportIata} className="border-b last:border-0">
                  <td className="px-5 py-3">
                    <Pill>{a.airportIata}</Pill>{" "}
                    <span className="text-muted-foreground">
                      {a.airportName ?? "Unknown airport"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums">
                    {a.count.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-xs whitespace-nowrap text-muted-foreground">
                    {formatDate(a.latestAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}
