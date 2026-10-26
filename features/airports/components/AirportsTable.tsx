"use client"

import { useDeferredValue, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Notice, Panel, Pill } from "@/shared/components/admin-ui"
import { RADIUS_LIMITS_KM, type AdminAirport } from "../contracts/airports.contract"
import {
  useAirports,
  useSetAirportMapVisibility,
  useSetAirportRadius,
} from "../hooks/useAirports"

const TYPE_LABEL: Record<string, string> = {
  large_airport: "Large",
  medium_airport: "Medium",
  small_airport: "Small",
}

/**
 * Airports by code or name, with the radius that counts as "at the airport"
 * (where echoes can be posted, and the circle on the map). Each one can get
 * its own radius, or go back to the default for its type, and can be always
 * shown on or hidden from the map instead of only when busy.
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
          className="h-10 w-full rounded-full sm:w-72 border-ink/10 bg-ink/[0.03] px-4 text-sm text-ink placeholder:text-ink/30 md:text-sm focus-visible:border-theme/60 focus-visible:ring-4 focus-visible:ring-theme/10"
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
            <thead className="border-b border-ink/[0.08] text-left text-[10px] tracking-[0.18em] text-ink/35 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Airport</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Radius</th>
                <th className="px-4 py-3 font-medium">Change radius</th>
                <th className="px-4 py-3 font-medium">On map</th>
              </tr>
            </thead>
            <tbody>
              {airports.map((airport) => (
                <AirportRow key={airport.id} airport={airport} />
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
      { id: airport.id, radiusKm },
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
    <tr className="border-b border-ink/[0.06] align-top transition-colors last:border-0 hover:bg-ink/[0.02]">
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
      <td className="px-4 py-3">
        <MapVisibility airport={airport} name={name} />
      </td>
    </tr>
  )
}

const MAP_CHOICES = [
  { label: "Auto", value: null, title: "Shown when busy: large, or with echoes or a live offer" },
  { label: "Show", value: true, title: "Always on the map" },
  { label: "Hide", value: false, title: "Never on the map" },
] as const

/**
 * Whether the airport is on the app's map: automatically (busy airports
 * only), or always shown or hidden by an admin.
 */
function MapVisibility({ airport, name }: { airport: AdminAirport; name: string }) {
  const setMap = useSetAirportMapVisibility()
  const override = airport.showOnMap ?? null
  const onMap = override ?? airport.busy

  function save(showOnMap: boolean | null) {
    setMap.mutate(
      { id: airport.id, showOnMap },
      {
        onSuccess: () =>
          toast.success(
            showOnMap === null
              ? `${name}: on the map when busy.`
              : `${name}: ${showOnMap ? "always on" : "hidden from"} the map.`
          ),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="whitespace-nowrap">
        <span className="font-medium">
          {onMap === undefined ? "—" : onMap ? "On map" : "Hidden"}
        </span>{" "}
        {override !== null ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
            Set by admin
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Auto</span>
        )}
      </div>
      <div className="flex gap-1" role="group" aria-label={`${name} on the map`}>
        {MAP_CHOICES.map((choice) => (
          <Button
            key={choice.label}
            type="button"
            variant={override === choice.value ? "default" : "outline"}
            className="h-8 px-3"
            title={choice.title}
            aria-pressed={override === choice.value}
            disabled={setMap.isPending || override === choice.value}
            onClick={() => save(choice.value)}
          >
            {choice.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
