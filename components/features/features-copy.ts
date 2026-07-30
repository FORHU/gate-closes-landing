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
} as const
