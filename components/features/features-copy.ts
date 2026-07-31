export const featuresCopy = {
  heading: "Everything your gate needs, in one app",
  subheading:
    "From live activity to visitor hand-offs, GateCloses keeps every part of community access in sync.",
  anchorPhone: {
    src: "/features/intro-phone.svg",
    alt: "GateCloses app feature preview",
  },
  // `color` mirrors each marker SVG's own accent gradient — used for its pulse rings.
  markers: [
    {
      src: "/features/terminal-echo.svg",
      title: "Terminal Echo",
      description: "Every gate event echoes back in real time, so you always know who came and went.",
      position: "top-left",
      color: "#BBE40A",
    },
    {
      src: "/features/parallel-soul.svg",
      title: "Parallel Soul",
      description: "Keep every device in your household in sync, always seeing the same gate status.",
      position: "top-right",
      color: "#50D6FF",
    },
    {
      src: "/features/destination-thread.svg",
      title: "Destination Thread",
      description: "Guide every visitor straight to your door with a clear, trackable path.",
      position: "bottom-left",
      color: "#FFB457",
    },
    {
      src: "/features/baton-touch.svg",
      title: "Baton Touch",
      description: "Pass access along in a tap — from guard to resident, instantly.",
      position: "bottom-right",
      color: "#FF6DA8",
    },
  ],
  boardingPassIntro: {
    heading: "Create your boarding pass, unlock more",
    subheading:
      "Every boarding pass you create syncs your household with Parallel Soul, guides visitors home with Destination Thread, and hands off access in a tap with Baton Touch.",
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
  // as the next one arrives on top of it. One entry per feature not already
  // given a deep-dive elsewhere.
  stackCards: [
    {
      id: "terminal-echo",
      eyebrow: "Terminal Echo",
      badge: "/features/badge-terminal-echo.svg",
      color: "#BBE40A",
      heading: "Watch every gate event unfold, live",
      subheading:
        "From a tapped badge to a granted entry, Terminal Echo streams it to your feed the instant it happens — so you're never the last to know what's going on at your own gate.",
      ctaLabel: "See Terminal Echo in action",
      image: {
        // Placeholder mockup imagery, not a real product screenshot.
        src: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1200&auto=format&fit=crop",
        alt: "Live monitoring dashboard showing real-time activity",
      },
    },
    {
      id: "parallel-soul",
      eyebrow: "Parallel Soul",
      badge: "/features/badge-parallel-soul.svg",
      color: "#50D6FF",
      heading: "Every device, seeing the same gate — together",
      subheading:
        "One household, one status. When the gate opens for one, every synced device knows instantly, so nobody's left checking a stale screen.",
      ctaLabel: "See Parallel Soul in action",
      image: {
        // Placeholder mockup imagery, not a real product screenshot.
        src: "https://images.unsplash.com/photo-1730967844913-29eb5cae5f34?q=80&w=1200&auto=format&fit=crop",
        alt: "Several synced devices displaying the same status",
      },
    },
    {
      id: "destination-thread",
      eyebrow: "Destination Thread",
      badge: "/features/badge-destination-thread.svg",
      color: "#FFB457",
      heading: "Guide every visitor straight to your door",
      subheading:
        "Share one link and Destination Thread walks them in — turn by turn, gate to doorstep, with zero confused phone calls at the gate.",
      ctaLabel: "See Destination Thread in action",
      image: {
        // Placeholder mockup imagery, not a real product screenshot.
        src: "https://images.unsplash.com/photo-1759256243611-502772ac391b?q=80&w=1200&auto=format&fit=crop",
        alt: "Phone showing a turn-by-turn navigation app",
      },
    },
    {
      id: "batton-touch",
      eyebrow: "Batton touch",
      badge: "/features/badge-baton-touch.svg",
      color: "#FF6DA8",
      heading: "Guide every visitor straight to your door",
      subheading:
        "Share one link and Destination Thread walks them in — turn by turn, gate to doorstep, with zero confused phone calls at the gate.",
      ctaLabel: "See Destination Thread in action",
      image: {
        // Placeholder mockup imagery, not a real product screenshot.
        src: "https://images.unsplash.com/photo-1759256243611-502772ac391b?q=80&w=1200&auto=format&fit=crop",
        alt: "Phone showing a turn-by-turn navigation app",
      },
    },
  ],
} as const
