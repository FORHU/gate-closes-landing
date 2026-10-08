import { DM_Mono } from "next/font/google"

// Departure-board type for the 404 page. A plain module (not "use client") so
// both Server and Client Components can read `className`.
export const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"] })
