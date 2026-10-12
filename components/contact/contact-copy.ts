import { site } from "@/lib/site"

export const contactCopy = {
  intro: {
    heading: site.contactLabel,
    subheading: "Questions, feedback or press. Send a message and the team will get back to you.",
  },
  // The four match/feature badges, straight from the app's map badges.
  featureBadges: [
    { src: "/badges/terminal-echo.svg", alt: "Terminal Echo" },
    { src: "/badges/parallel-soul.svg", alt: "Parallel Soul" },
    { src: "/badges/destination-thread.svg", alt: "Destination Thread" },
    { src: "/badges/baton-touch.svg", alt: "Baton Touch" },
  ],
  recipientEmail: site.contactEmail,
} as const
