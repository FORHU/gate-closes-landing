// Every claim here maps to shipped behavior in gate-closes-api /
// gate-closes-app-v2 (see CONTEXT.md). Badge SVGs are the app's own map
// badges, copied from gate-closes-app-v2/assets/map_badges.
export const featuresCopy = {
  heading: "Built for the hours between check-in and takeoff.",
  subheading:
    "Short voice posts for the whole terminal, and private conversations with travelers whose flights line up with yours.",
  echo: {
    name: "Terminal Echo",
    badge: "/badges/terminal-echo.svg",
    heading: "Hear what's happening at your airport.",
    body: "Voice clips of up to 10 seconds, visible to everyone at the airport. Travelers on site can react and reply.",
    // Example post for the preview card.
    sample: {
      author: "mara.k",
      meta: "SIN Terminal 3 · 4 min ago",
      caption: "Security at T3 is moving fast right now. Ten minutes, tops.",
      duration: "0:08",
      reactions: { like: 12, love: 4, haha: 2 },
      footer: "3 replies · 41 listens",
    },
  },
  connections: {
    name: "Connections",
    heading: "Three ways your flight meets someone else's.",
    body: "When flights line up, you can start a private voice conversation. They only see it once you send the first voice note.",
    yourFlight: "SIN to ICN",
    matches: [
      {
        id: "parallel-soul",
        name: "Parallel Soul",
        badge: "/badges/parallel-soul.svg",
        color: "var(--parallel-soul)",
        route: "SIN to ICN",
        body: "Same origin, same destination. Someone making your exact trip.",
      },
      {
        id: "destination-thread",
        name: "Destination Thread",
        badge: "/badges/destination-thread.svg",
        color: "var(--destination-thread)",
        route: "BKK to ICN",
        body: "Same destination from somewhere else, landing within 24 hours of you.",
      },
      {
        id: "baton-touch",
        name: "Baton Touch",
        badge: "/badges/baton-touch.svg",
        color: "var(--baton-touch)",
        route: "ICN to SIN",
        body: "Flying the opposite way. Swap gate tips and transfer advice.",
      },
    ],
  },
  map: {
    name: "World Map",
    heading: "Every echo, pinned where it was posted.",
    body: "Pins are badged by how that traveler's flight relates to yours. Tap one to listen or start a conversation.",
    pins: [
      { badge: "/badges/terminal-echo.svg", x: "38%", y: "38%" },
      { badge: "/badges/parallel-soul.svg", x: "58%", y: "30%" },
      { badge: "/badges/destination-thread.svg", x: "64%", y: "64%" },
      { badge: "/badges/baton-touch.svg", x: "33%", y: "68%" },
      { badge: "/badges/offer.svg", x: "49%", y: "54%" },
      { badge: "/badges/cluster.svg", x: "22%", y: "48%", count: 3 },
    ],
  },
  offers: {
    name: "Airport offers",
    badge: "/badges/offer.svg",
    heading: "Vouchers and lounge passes, where you are.",
    body: "Offers show up for the airport you're in. Claim one and the code is yours.",
    // Example offer for the preview card.
    sample: { title: "Lounge pass", meta: "SIN Terminal 3", code: "GC7-LNG-24" },
  },
} as const
