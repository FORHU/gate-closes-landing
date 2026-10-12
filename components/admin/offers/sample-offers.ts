import { addDays, ALL_AIRPORTS, type PrototypeOffer } from "./offer-model"

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=960&q=70`

/**
 * The four sample offers the prototype starts with, one per status the team
 * needs to see (live, scheduled, live card-only announcement, expired).
 * Dates are relative to `today` so the statuses stay meaningful.
 */
export function sampleOffers(today: string): PrototypeOffer[] {
  return [
    {
      id: "sample-coffee",
      kind: "voucher",
      title: "15% off coffee at the Terminal 3 café",
      body: "Show the code at the counter before your flight. One drink per voucher.",
      imageUrl: unsplash("1509042239860-f550ce710b93"),
      ctaLabel: "",
      ctaUrl: "",
      airports: ["SIN"],
      placements: ["pin", "card"],
      status: "active",
      startsAt: addDays(today, -6),
      endsAt: addDays(today, 15),
      rewardCode: "T3COFFEE15",
      maxClaims: 200,
      maxClaimsPerUser: 1,
    },
    {
      id: "sample-lounge",
      kind: "lounge_pass",
      title: "Day pass to the departures lounge",
      body: "Quiet seating, showers and a hot buffet. Valid for one visit on the day you claim it.",
      imageUrl: unsplash("1530521954074-e64f6810b32d"),
      ctaLabel: "See lounge hours",
      ctaUrl: "https://example.com/lounge",
      airports: ["SIN", "ICN"],
      placements: ["card"],
      status: "active",
      startsAt: addDays(today, 5),
      endsAt: addDays(today, 35),
      rewardCode: "",
      maxClaims: null,
      maxClaimsPerUser: null,
    },
    {
      id: "sample-wifi",
      kind: "announcement",
      title: "Faster Wi-Fi in every terminal",
      body: "Connect to the airport network and accept the terms once. No time limit.",
      imageUrl: unsplash("1569154941061-e231b4725ef1"),
      ctaLabel: "",
      ctaUrl: "",
      airports: [ALL_AIRPORTS],
      placements: ["card"],
      status: "active",
      startsAt: addDays(today, -2),
      endsAt: "",
      rewardCode: "",
      maxClaims: null,
      maxClaimsPerUser: null,
    },
    {
      id: "sample-duty-free",
      kind: "advertisement",
      title: "Duty-free spring sale",
      body: "Up to 30% off fragrances and travel essentials after security.",
      imageUrl: unsplash("1441986300917-64674bd600d8"),
      ctaLabel: "Browse the sale",
      ctaUrl: "https://example.com/duty-free",
      airports: ["ICN"],
      placements: ["pin"],
      status: "active",
      startsAt: addDays(today, -40),
      endsAt: addDays(today, -7),
      rewardCode: "",
      maxClaims: null,
      maxClaimsPerUser: null,
    },
  ]
}
