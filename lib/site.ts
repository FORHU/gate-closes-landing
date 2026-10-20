// Sitewide facts the landing page repeats in several places (nav, hero, CTA,
// footer, contact). One label per intent: every download link says
// "Download for Android", every contact link says "Get in touch".
// Also read by metadata, the share image, robots and the sitemap.
export const site = {
  name: "GateCloses",
  tagline: "A voice-first social app for air travelers.",
  // Set NEXT_PUBLIC_SITE_URL in production: share links and the sitemap
  // are built from it.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "GateCloses: say hello before the gate closes",
  description:
    "A voice-first social app for air travelers. Hear your airport, and talk with people flying your route.",
  // GateCloses lime (`--theme-color`), for the share image.
  themeColor: "#BBE40A",
  // TODO: point at the real APK (or store listing) once one is published.
  downloadUrl: "#",
  downloadLabel: "Download for Android",
  contactLabel: "Get in touch",
  // TODO: replace with the real inbox once one is decided on.
  contactEmail: "hello@gatecloses.app",
  navLinks: [
    { label: "About", href: "#about" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Contact", href: "#contact" },
  ],
} as const
