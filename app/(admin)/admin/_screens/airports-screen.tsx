"use client"

import { AirportsTable } from "@/features/airports/components/AirportsTable"
import { PageHeader } from "@/shared/components/admin-ui"

export function AirportsScreen() {
  return (
    <>
      <PageHeader
        title="Airports"
        description="How far from each airport counts as being at it: where echoes can be posted, and the circle on the map. Changes show on the map within seconds."
      />
      <AirportsTable />
    </>
  )
}
