"use client"

import { useEffect } from "react"
import { UNAUTHORIZED_EVENT } from "@/shared/providers/query-provider"

/** Sends to the login page when any request finds the session ended. */
export function AuthListener() {
  useEffect(() => {
    const onUnauthorized = () => {
      const next = window.location.pathname + window.location.search
      window.location.assign(`/admin/login?next=${encodeURIComponent(next)}`)
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])
  return null
}
