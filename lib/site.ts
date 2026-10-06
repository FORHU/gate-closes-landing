/**
 * Site-wide facts used by metadata, the share image, robots and sitemap.
 * Section copy stays in each section's `*-copy.ts`.
 */
export const site = {
  name: "GateCloses",
  // Set NEXT_PUBLIC_SITE_URL in production: share links and the sitemap
  // are built from it.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "GateCloses: leave a record where you pass through",
  // Short line for the share image.
  tagline: "Leave a record where you pass through.",
  description:
    "Leave voice and text echoes at the airport you're in, and meet the travelers whose trips cross yours. Starting with airports.",
  // GateCloses lime (`--theme-color`), for the share image.
  themeColor: "#BBE40A",
} as const
