export const featuresCopy = {
  heading: "Leave a record. Find your people.",
  subheading:
    "Post where you are, then meet travelers whose trips cross yours: before, during and after the flight.",
  anchorPhone: {
    src: "/features/intro-phone.svg",
    alt: "GateCloses app feature preview",
  },
  // `color` mirrors each marker SVG's own accent gradient — used for its pulse rings.
  markers: [
    {
      src: "/features/terminal-echo.svg",
      title: "Terminal Echo",
      description: "Leave a voice note or a text at the airport you're in. Only people there see it.",
      position: "top-left",
      color: "#BBE40A",
    },
    {
      src: "/features/parallel-soul.svg",
      title: "Parallel Soul",
      description: "Meet travelers flying your exact route, from the same airport to the same city.",
      position: "top-right",
      color: "#50D6FF",
    },
    {
      src: "/features/destination-thread.svg",
      title: "Destination Thread",
      description: "Coming from different cities to the same place? Meet who lands when you do.",
      position: "bottom-left",
      color: "#FFB457",
    },
    {
      src: "/features/baton-touch.svg",
      title: "Baton Touch",
      description: "Flying A to B while someone flies B to A? Hand each other the tips.",
      position: "bottom-right",
      color: "#FF6DA8",
    },
  ],
  // The app's matches (Parallel Soul, Destination Thread, Baton Touch) come
  // from the boarding passes travelers add, so this intro leads into them.
  boardingPassIntro: {
    heading: "Add your boarding pass, unlock your matches",
    subheading:
      "Add a boarding pass and GateCloses finds the travelers whose trips cross yours: on your route with Parallel Soul, landing where you land with Destination Thread, and flying back the other way with Baton Touch.",
  },
  // Decorative only — continues the same fictional-traveler motif as the Hero
  // Showcase's Terminal Echo cards, reusing the same airports.
  boardingPass: {
    flightCode: "GC 452",
    from: { city: "Singapore", airport: "Changi Airport" },
    to: { city: "Seoul", airport: "Incheon Airport" },
    departDate: "14 Dec",
    arriveDate: "15 Dec",
  },
  // Feeds the Stack Card deck below the Boarding Pass — a scroll-pinned deck
  // (skiper-ui "Card Stack" pattern) where each card sticks and scales down
  // as the next one arrives on top of it. One card per feature.
  stackCards: [
    {
      id: "terminal-echo",
      eyebrow: "Terminal Echo",
      badge: "/features/badge-terminal-echo.svg",
      color: "#BBE40A",
      heading: "Leave your echo at the airport",
      subheading:
        "Record up to ten seconds of voice or type a few words, and leave it where you are. Everyone at the same airport can listen, reply and react, so the place keeps a record of who passed through.",
      ctaLabel: "See Terminal Echo in action",
      image: {
        // Placeholder mockup imagery, not a real product screenshot.
        src: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1200&auto=format&fit=crop",
        alt: "Live monitoring dashboard showing real-time activity",
      },
      // "See it in action" dialog: one carousel slide per onboarding step,
      // in order. Same placeholder phone screen on every step until real
      // per-step screenshots replace it.
      steps: [
        {
          src: "/features/intro-phone.svg",
          alt: "Terminal Echo step 1: Be at the airport",
          title: "Be at the airport",
          description:
            "Open the map. Once you're inside an airport, you can leave an echo there. Echoes can only be posted from inside an airport.",
        },
        {
          src: "/features/intro-phone.svg",
          alt: "Terminal Echo step 2: Record or type",
          title: "Record or type",
          description:
            "Hold to record up to ten seconds of voice, or type a few words, and post it where you are.",
        },
        {
          src: "/features/intro-phone.svg",
          alt: "Terminal Echo step 3: Others reply and react",
          title: "Others reply and react",
          description:
            "Travelers at the same airport find your echo on the map and in the feed, and can listen, reply and react.",
        },
      ],
    },
    {
      id: "parallel-soul",
      eyebrow: "Parallel Soul",
      badge: "/features/badge-parallel-soul.svg",
      color: "#50D6FF",
      heading: "Same route, same journey",
      subheading:
        "Flying from the same airport to the same city? Parallel Soul connects you with travelers on your exact route for a private one-on-one chat, from the gate to the arrivals hall.",
      ctaLabel: "See Parallel Soul in action",
      image: {
        // Placeholder mockup imagery, not a real product screenshot.
        src: "https://images.unsplash.com/photo-1730967844913-29eb5cae5f34?q=80&w=1200&auto=format&fit=crop",
        alt: "Several synced devices displaying the same status",
      },
      steps: [
        {
          src: "/features/intro-phone.svg",
          alt: "Parallel Soul step 1: Add your boarding pass",
          title: "Add your boarding pass",
          description:
            "Add your flight: where you're flying from, where to, and when.",
        },
        {
          src: "/features/intro-phone.svg",
          alt: "Parallel Soul step 2: Get matched on your route",
          title: "Get matched on your route",
          description:
            "GateCloses finds travelers flying your exact route: the same departure airport and the same destination.",
        },
        {
          src: "/features/intro-phone.svg",
          alt: "Parallel Soul step 3: Start a private chat",
          title: "Start a private chat",
          description:
            "Say hi one-on-one, share the wait at the gate, and keep talking after you land.",
        },
      ],
    },
    {
      id: "destination-thread",
      eyebrow: "Destination Thread",
      badge: "/features/badge-destination-thread.svg",
      color: "#FFB457",
      heading: "Different starts, same destination",
      subheading:
        "Travelers from other cities are landing where you land, around the same time. Destination Thread puts you in touch before you arrive: share a ride, a plan, or just a hello.",
      ctaLabel: "See Destination Thread in action",
      image: {
        // Placeholder mockup imagery, not a real product screenshot.
        src: "https://images.unsplash.com/photo-1759256243611-502772ac391b?q=80&w=1200&auto=format&fit=crop",
        alt: "Phone showing a turn-by-turn navigation app",
      },
      steps: [
        {
          src: "/features/intro-phone.svg",
          alt: "Destination Thread step 1: Add your boarding pass",
          title: "Add your boarding pass",
          description:
            "Add your flight: where you're flying from, where to, and when.",
        },
        {
          src: "/features/intro-phone.svg",
          alt: "Destination Thread step 2: Meet who lands with you",
          title: "Meet who lands with you",
          description:
            "GateCloses finds travelers coming from other cities to your destination, landing around the same time.",
        },
        {
          src: "/features/intro-phone.svg",
          alt: "Destination Thread step 3: Plan your arrival together",
          title: "Plan your arrival together",
          description:
            "Chat one-on-one to share a ride, swap tips about the city, or just have company on arrival.",
        },
      ],
    },
    {
      id: "baton-touch",
      eyebrow: "Baton Touch",
      badge: "/features/badge-baton-touch.svg",
      color: "#FF6DA8",
      heading: "Pass the baton to the next traveler",
      subheading:
        "Someone is flying the trip you just made, the other way. Baton Touch connects you to swap what you know: the gate, the transfer, the best seat, the place you're both heading.",
      ctaLabel: "See Baton Touch in action",
      image: {
        // Placeholder mockup imagery, not a real product screenshot. Same
        // photo as Destination Thread until a Baton Touch image exists.
        src: "https://images.unsplash.com/photo-1759256243611-502772ac391b?q=80&w=1200&auto=format&fit=crop",
        alt: "Phone showing a turn-by-turn navigation app",
      },
      steps: [
        {
          src: "/features/intro-phone.svg",
          alt: "Baton Touch step 1: Add your boarding pass",
          title: "Add your boarding pass",
          description:
            "Add your flight: where you're flying from, where to, and when.",
        },
        {
          src: "/features/intro-phone.svg",
          alt: "Baton Touch step 2: Find who's flying back",
          title: "Find who's flying back",
          description:
            "If you fly A to B while someone flies B to A, Baton Touch connects the two of you.",
        },
        {
          src: "/features/intro-phone.svg",
          alt: "Baton Touch step 3: Hand over what you know",
          title: "Hand over what you know",
          description:
            "Swap what you've learned one-on-one: gate status, transfer tips, the best seat, the place you're heading.",
        },
      ],
    },
  ],
} as const
