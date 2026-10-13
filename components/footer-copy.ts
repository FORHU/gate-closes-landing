import { site } from "@/lib/site"

export const footerCopy = {
  tagline: "A voice-first social app for air travelers. Hear your airport, and meet the people whose flights cross yours.",
  columns: [
    { title: "Explore", links: site.navLinks },
    {
      title: "The app",
      links: [
        { label: site.downloadLabel, href: site.downloadUrl },
        { label: "Terminal Echo", href: "#features" },
        { label: "Connections", href: "#features" },
      ],
    },
  ],
  // TODO: replace with real profile URLs once these accounts exist.
  socials: [
    { label: "X", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
  ],
  copyright: "© 2026 GateCloses. All rights reserved.",
} as const
