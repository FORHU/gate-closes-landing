import { DM_Mono, Plus_Jakarta_Sans } from "next/font/google"

// Departure-board type for the 404 page and flight-data labels on the landing
// page. A plain module (not "use client") so both Server and Client Components
// can read `className`.
export const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" })

// The app's own typeface (gate-closes-app-v2 assets/fonts). Applied on the
// landing page wrapper only; admin and 404 keep the root DM Sans.
export const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" })
