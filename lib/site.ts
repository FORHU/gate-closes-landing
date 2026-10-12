// Sitewide facts the landing page repeats in several places (nav, hero, CTA,
// footer, contact). One label per intent: every download link says
// "Download for Android", every contact link says "Get in touch".
export const site = {
  name: "GateCloses",
  tagline: "A voice-first social app for air travelers.",
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
