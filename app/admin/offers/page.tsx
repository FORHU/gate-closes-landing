import type { Metadata } from "next"

import { OffersPrototype } from "@/components/admin/offers/offers-prototype"
import { toISODay } from "@/components/admin/offers/offer-model"
import { requireAdmin } from "@/lib/admin/dal"

export const metadata: Metadata = {
  title: "Offers · Admin · GateCloses",
  robots: { index: false, follow: false },
}

// Frontend-only prototype of offers management: sample data and local state,
// no requests to /api/admin/offers yet.
export default async function AdminOffersPage() {
  await requireAdmin()
  // Computed once on the server and passed down, so server and client agree on
  // "today" (sample dates and Live/Scheduled/Expired all hang off it).
  const today = toISODay(new Date())

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <header className="mb-6 flex flex-col gap-3 animate-rise motion-reduce:animate-none">
        <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">Offers</h1>
        <p className="text-sm text-ink/45">
          Vouchers, announcements and ads shown to travelers on the map and in airport cards.
        </p>
      </header>
      <OffersPrototype today={today} />
    </main>
  )
}
