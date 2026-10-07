"use client"

import { useDeferredValue, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Notice, Panel, Pill } from "@/shared/components/admin-ui"
import { RADIUS_LIMITS_KM, type AdminAirport } from "../contracts/airports.contract"
import { useAirports, useSetAirportRadius } from "../hooks/useAirports"

const TYPE_LABEL: Record<string, string> = {
  large_airport: "Large",
  medium_airport: "Medium",
  small_airport: "Small",
}

/**
 * Airports by code or name, with the radius that counts as "at the airport"
 * (where echoes can be posted, and the circle on the map). Each one can get
 * its own radius, or go back to the default for its type.
 */
export function AirportsTable() {
  const [search, setSearch] = useState("")
  const q = useDeferredValue(search.trim())
  const { data: airports, isPending, error } = useAirports(q)

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <Input
          type="search"
          placeholder="Code (BAG, MNL) or name"
          className="h-8 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-muted-foreground">
          Airports with a radius set by an admin are listed first.
        </span>
      </div>

      {error && <Notice tone="error">{error.message}</Notice>}
      {isPending && <Notice>Loading…</Notice>}
      {airports?.length === 0 && <Notice>No airports match.</Notice>}

      {airports && airports.length > 0 && (
        <Panel className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Airport</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Radius</th>
                <th className="px-4 py-3 font-medium">Change radius</th>
              </tr>
            </thead>
            <tbody>
              {airports.map((airport) => (
                <AirportRow key={airport._id} airport={airport} />
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  )
}

function AirportRow({ airport }: { airport: AdminAirport }) {
  const setRadius = useSetAirportRadius()
  const [value, setValue] = useState(airport.radiusKm?.toString() ?? "")
  const name = `${airport.iata ?? airport.icao ?? "?"} ${airport.airport ?? ""}`.trim()
  const parsed = Number(value)
  const valid =
    value.trim() !== "" && parsed >= RADIUS_LIMITS_KM.min && parsed <= RADIUS_LIMITS_KM.max
  const changed = valid && parsed !== airport.radiusKm

  function save(radiusKm: number | null) {
    setRadius.mutate(
      { id: airport._id, radiusKm },
      {
        onSuccess: () =>
          toast.success(
            radiusKm === null
              ? `${name}: back to the default ${airport.defaultRadiusKm} km.`
              : `${name}: radius ${radiusKm} km.`
          ),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3">
        <div className="font-medium">{airport.airport ?? "—"}</div>
        <div className="mt-0.5 flex gap-1 text-xs text-muted-foreground">
          {airport.iata && <Pill>{airport.iata}</Pill>}
          {airport.icao && <Pill>{airport.icao}</Pill>}
          {airport.countryCode && <span>{airport.countryCode}</span>}
        </div>
      </td>
      <td className="px-4 py-3 text-xs">{TYPE_LABEL[airport.type ?? ""] ?? airport.type ?? "—"}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="font-medium tabular-nums">{airport.radiusKm ?? "—"} km</span>{" "}
        {airport.radiusManual ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
            Set by admin
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Default</span>
        )}
      </td>
      <td className="px-4 py-3">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (changed) save(parsed)
          }}
        >
          <Input
            type="number"
            aria-label={`Radius of ${name} in km`}
            min={RADIUS_LIMITS_KM.min}
            max={RADIUS_LIMITS_KM.max}
            step={0.1}
            className="h-8 w-24"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <span className="text-xs text-muted-foreground">km</span>
          <Button type="submit" className="h-8 px-3" disabled={!changed || setRadius.isPending}>
            Save
          </Button>
          {airport.radiusManual && (
            <Button
              type="button"
              variant="outline"
              className="h-8 px-3"
              disabled={setRadius.isPending}
              onClick={() => {
                setValue(airport.defaultRadiusKm?.toString() ?? "")
                save(null)
              }}
            >
              Reset to {airport.defaultRadiusKm} km
            </Button>
          )}
        </form>
        {value.trim() !== "" && !valid && (
          <p className="mt-1 text-xs text-destructive">
            Between {RADIUS_LIMITS_KM.min} and {RADIUS_LIMITS_KM.max} km.
          </p>
        )}
      </td>
    </tr>
  )
}
