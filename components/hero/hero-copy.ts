export const heroCopy = {
  headline: "Say hello before the gate closes.",
  // Max 20 words: the hero carries one idea, details live in the sections below.
  subheadline:
    "A voice-first social app for air travelers. Hear your airport, and talk with people flying your route.",
  secondaryCta: { label: "How it works", href: "#how-it-works" },
  // Mixkit clip 10150 (sunset over a sea of clouds), re-encoded as a
  // forward/reverse loop. Credits in public/media/CREDITS.md.
  video: {
    sources: [
      { src: "/media/hero-1280.mp4", media: "(min-width: 768px)" },
      { src: "/media/hero-960.mp4" },
    ],
    poster: "/media/hero-poster.webp",
  },
  nearClouds: "/media/near-clouds.webp",
} as const
