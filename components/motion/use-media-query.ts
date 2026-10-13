"use client"

import { useSyncExternalStore } from "react"

/**
 * Live `matchMedia` result. Hydration-safe: the first client render uses
 * `serverValue` (matching the server HTML), then React re-renders with the
 * real value, so there's no hydration mismatch.
 */
export function useMediaQuery(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  )
}

export const useReducedMotionSafe = () => useMediaQuery("(prefers-reduced-motion: reduce)", false)
